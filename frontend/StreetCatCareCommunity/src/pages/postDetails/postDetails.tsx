import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useLoad, useUnload } from '@tarojs/taro';
// 保持自定义组件导入
import { Card } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Textarea } from '@/ui/textarea';
import { ImageWithFallback } from '@/ui/image';
import { FontAwesome } from 'taro-icons';
import IconFont from '@/icons';

import { UIComment } from '@/types/ui';
import { usePostStore } from '@/stores/postStore';
import { useCommentStore } from '@/stores/commentStore';
import { TargetType } from '@/types/api';
import type * as API from '@/types/api';

export default function PostDetailPage() {
  // 使用 PostStore 获取数据和方法
  const { 
    getSelectedPostForUI, 
    currentTargetId, 
    fetchPostDetail,
    clearCurrentTargetId,
    loading: postLoading,
    error: postError
  } = usePostStore();

  // 使用 CommentStore 获取评论数据
  const {
    getCommentsForUI,
    fetchComments,
    createComment,
    loading: commentLoading,
    error: commentError
  } = useCommentStore();

  // 从 Store 获取评论数据
  const storeComments = getCommentsForUI();

  // 合并加载和错误状态
  const loading = postLoading || commentLoading;
  const error = postError || commentError;

  // 从 Store 获取帖子数据
  const post = getSelectedPostForUI();

  // 页面加载时获取帖子详情和评论
  useLoad(() => {
    if (currentTargetId) {
      fetchPostDetail(currentTargetId);
      // 获取帖子评论
      fetchComments({ targetType: TargetType.POST, targetId: currentTargetId });
    } else {
      Taro.showToast({
        title: '帖子ID不存在',
        icon: 'none'
      });
    }
  });

  // 页面卸载时清除导航状态
  useUnload(() => {
    clearCurrentTargetId();
  });

  // 本地评论状态（用于UI交互，如展开/收起回复、点赞状态等）
  const [localCommentState, setLocalCommentState] = useState<Record<string, { showReplies: boolean; liked: boolean }>>({});

  // 合并 store 评论和本地状态
  const comments: UIComment[] = storeComments.map(comment => ({
    ...comment,
    showReplies: localCommentState[comment.id]?.showReplies ?? false,
    liked: localCommentState[comment.id]?.liked ?? false,
    replies: (comment.replies || []).map(reply => ({
      ...reply,
      liked: localCommentState[reply.id]?.liked ?? false,
    })),
  }));

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; userName?: string } | null>(null);

  const getPostTypeLabel = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      'DISCUSSION': { label: '讨论贴', color: 'bg-[#3b82f6]' },
      'EXPERIENCE': { label: '经验贴', color: 'bg-[#22c55e]' },
      'HELP': { label: '求助帖', color: 'bg-[#f59e0b]' },
    };
    return typeMap[type] || typeMap['DISCUSSION'];
  };

  const handleLikePost = () => {
    // TODO: 实现点赞功能 - 需要在 PostStore 中添加 likePost 方法
    Taro.showToast({
      title: '点赞功能待实现',
      icon: 'none'
    });
  };

  const handleLikeComment = (commentId: string) => {
    setLocalCommentState(prev => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        showReplies: prev[commentId]?.showReplies ?? false,
        liked: !(prev[commentId]?.liked ?? false),
      },
    }));
    // TODO: 调用API进行点赞操作
  };

  const handleLikeReply = (replyId: string) => {
    setLocalCommentState(prev => ({
      ...prev,
      [replyId]: {
        ...prev[replyId],
        showReplies: prev[replyId]?.showReplies ?? false,
        liked: !(prev[replyId]?.liked ?? false),
      },
    }));
    // TODO: 调用API进行点赞操作
  };

  const handleToggleReplies = (commentId: string) => {
    setLocalCommentState(prev => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        liked: prev[commentId]?.liked ?? false,
        showReplies: !(prev[commentId]?.showReplies ?? false),
      },
    }));
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Taro.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }

    if (!currentTargetId) {
      Taro.showToast({
        title: '帖子ID不存在',
        icon: 'none'
      });
      return;
    }

    try {
      const commentData: API.CreateCommentReq = {
        targetType: TargetType.POST,
        targetId: currentTargetId,
        content: newComment.trim(),
        parentId: replyingTo?.commentId,
      };

      await createComment(commentData);

      Taro.showToast({
        title: '评论成功',
        icon: 'success'
      });

      // 清空输入框和回复状态
      setNewComment('');
      setReplyingTo(null);

      // 重新获取评论列表
      await fetchComments({ targetType: TargetType.POST, targetId: currentTargetId });
    } catch (error) {
      console.error('发表评论失败:', error);
      Taro.showToast({
        title: '评论失败，请重试',
        icon: 'none'
      });
    }
  };

  const handleImageClick = (images: string[], index: number) => {
    Taro.previewImage({
      current: images[index],
      urls: images
    });
  };

  // 如果没有帖子数据，显示加载或错误状态
  if (loading) {
    return (
      <View className="bg-[#fafaf9] min-h-screen flex items-center justify-center">
        <Text className="text-[#78716c]">加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-[#fafaf9] min-h-screen flex items-center justify-center p-4">
        <Text className="text-[#ef4444] mb-4">{error}</Text>
        <Button onClick={() => Taro.navigateBack()}>返回</Button>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="bg-[#fafaf9] min-h-screen flex items-center justify-center p-4">
        <Text className="text-[#78716c] mb-4">帖子不存在</Text>
        <Button onClick={() => Taro.navigateBack()}>返回</Button>
      </View>
    );
  }

  return (
    <View className="bg-[#fafaf9] min-h-screen flex flex-col">
      <ScrollView scrollY className="flex-1 pb-32">
        {/* Header */}
        <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
          <View className="flex flex-row items-center gap-3">
            <Text className="text-[#ffffff] text-2xl">帖子详情</Text>
          </View>
        </View>

        {/* Post Content */}
        <View className="px-4 py-6">
          <Card className="p-4 mb-6 bg-[#ffffff]">
            {/* Author Info */}
            <View className="flex flex-row items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <View className="flex-1">
                <Text className="text-[#292524] block">{post.author.name}</Text>
                <Text className="text-[#78716c] text-xs block">{post.time}</Text>
              </View>
              
              {/* 详情页右上角状态标签 */}
              <View className="flex flex-row gap-2">
                {post.isPinned && (
                  <View className="flex flex-row items-center gap-1 bg-[#fef2f2] px-2 py-1 rounded-full border border-[#fef2f2]">
                    <Text className="text-[#ef4444] text-xs font-medium">📌 置顶</Text>
                  </View>
                )}
                {post.isFeatured && (
                  <View className="flex flex-row items-center gap-1 bg-[#fffbeb] px-2 py-1 rounded-full border border-[#fffbeb]">
                    <Text className="text-[#f59e0b] text-xs font-medium">🏆 精华</Text>
                  </View>
                )}
                <Badge className={`${getPostTypeLabel(post.postType).color} text-[#ffffff]`}>
                  {getPostTypeLabel(post.postType).label}
                </Badge>
              </View>
            </View>

            {/* Title */}
            <Text className="text-[#292524] text-xl mb-3 font-bold block">{post.title}</Text>

            {/* Content */}
            <Text className="text-[#292524] mb-4 leading-relaxed block">{post.content}</Text>

            {/* Images */}
            {post.images.length > 0 && (
              <View className={`grid gap-2 mb-4 ${
                post.images.length === 1 ? 'grid-cols-1' : 
                post.images.length === 2 ? 'grid-cols-2' : 
                'grid-cols-3'
              }`}>
                {post.images.map((image: string, index: number) => (
                  <View
                    key={index}
                    className={`relative rounded-lg overflow-hidden ${
                      post.images.length === 1 ? 'aspect-video' : 'aspect-square'
                    }`}
                    onClick={() => handleImageClick(post.images, index)}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            <View className="flex flex-row items-center gap-6 pt-4 border-t border-[rgba(0,0,0,0.08)]">
              <View
                onClick={handleLikePost}
                className="flex flex-row items-center gap-1.5"
              >
                <FontAwesome family={post.liked ? 'solid': 'regular'} name='heart' size={16} color={post.liked ? 'orange' : 'black'} />
                <Text className={`text-sm ${post.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                  {post.likes}
                </Text>
              </View>
              
              <View className="flex flex-row items-center gap-1.5">
                <FontAwesome family='regular' name='comment' size={16} />
                <Text className="text-sm text-[#78716c]">{comments.length}</Text>
              </View>
              
              <View className="flex flex-row items-center gap-1.5 ml-auto">
                <IconFont name='share' size={30} color='black' />
              </View>
            </View>
          </Card>

          {/* Comments Section */}
          <View className="mb-6">
            <Text className="text-[#292524] mb-4 block font-medium">评论 ({comments.length})</Text>
            
            <View className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-4 bg-[#ffffff]">
                  {/* Comment */}
                  <View className="flex flex-row gap-3">
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <View className="flex-1">
                      <View className="flex flex-row items-center gap-2 mb-1">
                        <Text className="text-[#292524]">{comment.author.name}</Text>
                        <Text className="text-[#78716c] text-xs">{comment.time}</Text>
                      </View>
                      
                      <Text className="text-[#292524] mb-2 leading-relaxed block">{comment.content}</Text>
                      
                      {/* Comment Images */}
                      {comment.photos.length > 0 && (
                        <View className="grid grid-cols-3 gap-2 mb-2">
                          {comment.photos.map((photo, index) => (
                            <View
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden"
                              onClick={() => handleImageClick(comment.photos, index)}
                            >
                              <ImageWithFallback
                                src={photo}
                                alt={`评论图片 ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </View>
                          ))}
                        </View>
                      )}
                      
                      <View className="flex flex-row items-center gap-4 mt-2">
                        <View
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex flex-row items-center gap-1"
                        >
                          <FontAwesome family={post.liked ? 'solid': 'regular'} name='heart' size={16} color={post.liked ? 'orange' : 'black'} />
                          <Text className={`text-sm ${comment.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                            {comment.likes}
                          </Text>
                        </View>
                        
                        <View
                          onClick={() => setReplyingTo({ commentId: comment.id })}
                        >
                          <Text className="text-[#78716c] text-sm">回复</Text>
                        </View>
                        
                        {(comment.replies || []).length > 0 && (
                          <View
                            onClick={() => handleToggleReplies(comment.id)}
                            className="flex flex-row items-center gap-1"
                          >
                            {comment.showReplies ? (
                              <>
                                <IconFont name='chevron-up' size={30} color='#ff8c42' />
                                <Text className="text-[#ff8c42] text-sm">收起回复</Text>
                              </>
                            ) : (
                              <>
                                <IconFont name='chevron-down' size={30} color='#ff8c42' />
                                <Text className="text-[#ff8c42] text-sm">{(comment.replies || []).length} 条回复</Text>
                              </>
                            )}
                          </View>
                        )}
                      </View>
                      
                      {/* Replies */}
                      {comment.showReplies && (comment.replies || []).length > 0 && (
                        <View className="mt-4 pl-4 border-l-2 border-[rgba(0,0,0,0.08)] space-y-3">
                          {(comment.replies || []).map((reply) => (
                            <View key={reply.id} className="flex flex-row gap-3">
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage src={reply.author.avatar} />
                                <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                              </Avatar>
                              
                              <View className="flex-1">
                                <View className="flex flex-row items-center gap-2 mb-1 flex-wrap">
                                  <Text className="text-[#292524] text-sm">{reply.author.name}</Text>
                                  {reply.replyTo && (
                                    <>
                                      <Text className="text-[#78716c] text-xs">回复</Text>
                                      <Text className="text-[#ff8c42] text-sm">@{reply.replyTo}</Text>
                                    </>
                                  )}
                                  <Text className="text-[#78716c] text-xs">{reply.time}</Text>
                                </View>
                                
                                <Text className="text-[#292524] text-sm mb-2 leading-relaxed block">{reply.content}</Text>
                                
                                {/* Reply Images */}
                                {reply.photos.length > 0 && (
                                  <View className="grid grid-cols-3 gap-2 mb-2">
                                    {reply.photos.map((photo, index) => (
                                      <View
                                        key={index}
                                        className="relative aspect-square rounded-lg overflow-hidden"
                                        onClick={() => handleImageClick(reply.photos, index)}
                                      >
                                        <ImageWithFallback
                                          src={photo}
                                          alt={`回复图片 ${index + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </View>
                                    ))}
                                  </View>
                                )}
                                
                                <View className="flex flex-row items-center gap-4 mt-1">
                                  <View
                                    onClick={() => handleLikeReply(reply.id)}
                                    className="flex flex-row items-center gap-1"
                                  >
                                    <FontAwesome family={post.liked ? 'solid': 'regular'} name='heart' size={16} color={post.liked ? 'orange' : 'black'} />
                                    <Text className={`text-xs ${reply.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                                      {reply.likes}
                                    </Text>
                                  </View>
                                  
                                  <View
                                    onClick={() => setReplyingTo({ commentId: comment.id, userName: reply.author.name })}
                                  >
                                    <Text className="text-[#78716c] text-xs">回复</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Comment Input - Fixed at bottom */}
      <View className="fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t border-[rgba(0,0,0,0.08)] p-4 pb-6 z-50">
        {replyingTo && (
          <View className="flex flex-row items-center justify-between mb-2 px-2">
            <Text className="text-sm text-[#78716c]">
              {replyingTo.userName ? `回复 @${replyingTo.userName}` : '回复评论'}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="h-6 text-xs"
            >
              取消
            </Button>
          </View>
        )}
        <View className="flex flex-row gap-2 max-w-lg mx-auto">
          <Textarea
            placeholder={replyingTo ? '写下你的回复...' : '写下你的评论...'}
            value={newComment}
            onInput={(e) => setNewComment(e.detail.value)}
            // 注意：Taro Textarea 属性可能需要根据你的自定义组件调整
            autoHeight
            className="flex-1 bg-[#fafaf9] rounded-lg p-2"
          />
          <Button
            size="icon"
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="flex-shrink-0 bg-gradient-to-r from-[#ff8c42] to-[#f59e0b] hover:from-[#ff8c42]/90 hover:to-[#f59e0b]/90 flex items-center justify-center w-10 h-10 rounded-full"
          >
            <FontAwesome family='solid' name='paper-plane' size={20}/>
          </Button>
        </View>
      </View>
    </View>
  );
}
