import { useState, useEffect } from 'react';
import { View, Text, Textarea, Picker, ScrollView } from '@tarojs/components';
import { useLoad, useUnload } from '@tarojs/taro';
import IconFont from '@/icons';
import { FontAwesome } from 'taro-icons';
import { Card } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { ImageWithFallback } from '@/ui/image';
import { UIComment } from '@/types/ui';
import { TargetType } from '@/types/api';
import { useCatStore } from '@/stores/catStore';
import { useCommentStore } from '@/stores/commentStore';
import { useLikeStore } from '@/stores/likeStore';
import { NavigationHelper } from '@/utils/navigation';

export default function CatCommentsPage() {
  // 从Store获取数据
  const { currentTargetId, getSelectedCatForUI, fetchCatDetail } = useCatStore();
  const { getCommentsForUI, fetchComments, setTarget, clearTarget } = useCommentStore();
  
  // 从 LikeStore 获取点赞状态
  const {
    fetchMyLikes,
    toggleLike,
    isLiked,
    loading: likeLoading
  } = useLikeStore();
  
  const cat = getSelectedCatForUI() || { id: '1', name: '小橘' };
  
  // 从Store获取评论数据
  const commentsFromStore = getCommentsForUI();
  
  const [comments, setComments] = useState<UIComment[]>(commentsFromStore);

  const [newComment, setNewComment] = useState('');
  const [commentPhotos, setCommentPhotos] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'time' | 'likes'>('time');

  // 页面加载时获取数据
  useLoad(() => {
    if (currentTargetId) {
      // 设置目标类型和ID
      setTarget('CAT', currentTargetId);
      // 获取猫咪详情（如果还没有）
      if (!cat || cat.id !== currentTargetId) {
        fetchCatDetail(currentTargetId);
      }
      // 获取评论数据
      fetchComments({ targetType: TargetType.CAT, targetId: currentTargetId });
      // 获取点赞列表
      fetchMyLikes();
    }
  });

  // 页面卸载时清理
  useUnload(() => {
    clearTarget();
  });

  // 当Store中的评论数据更新时，同步到本地state
  useEffect(() => {
    setComments(commentsFromStore);
  }, [commentsFromStore]);
  
  // 当点赞列表更新时，同步评论的点赞状态
  useEffect(() => {
    setComments(prevComments => 
      prevComments.map(comment => ({
        ...comment,
        liked: isLiked(comment.id),
      }))
    );
  }, [useLikeStore.getState().likedIds]); // 监听 likedIds 的变化

  // Picker 选项
  const sortOptions = [
    { label: '按时间排序', value: 'time' },
    { label: '按点赞排序', value: 'likes' }
  ];

  const handleLikeComment = async (commentId: string) => {
    // 使用真实的点赞逻辑
    // 注意：评论点赞使用 POST 类型（因为 TargetType 中没有 COMMENT）
    // 这是一个临时方案，等后端支持 COMMENT 类型后需要更新
    await toggleLike(TargetType.POST, commentId);
    
    // useEffect 会自动监听 likedIds 的变化并更新评论列表
  };

  const handleAddPhoto = () => {
    if (commentPhotos.length < 3) {
      const mockImages = [
        'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ];
      setCommentPhotos([...commentPhotos, mockImages[0]]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setCommentPhotos(commentPhotos.filter((_, i) => i !== index));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: UIComment = {
      id: String(Date.now()),
      author: {
        name: '当前用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      },
      content: newComment,
      time: '刚刚',
      likes: 0,
      liked: false,
      photos: commentPhotos,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    setCommentPhotos([]);
  };

  const handleImageClick = (images: string[], index: number) => {
    // TODO: 实现图片预览功能
    console.log('预览图片:', images, index);
  };

  const getSortedComments = () => {
    const sorted = [...comments];
    if (sortBy === 'likes') {
      return sorted.sort((a, b) => b.likes - a.likes);
    } else {
      // 按时间排序 - ID越大越新
      return sorted.sort((a, b) => Number(b.id) - Number(a.id));
    }
  };

  return (
    <View className="pb-32 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <View className="flex flex-row items-center gap-3 mb-4">
          <Text className="text-white text-2xl font-medium">{cat.name} 的评论</Text>
        </View>
        
        {/* Sort Selector using Taro Picker */}
        <View className="flex flex-row items-center gap-2">
          <IconFont name="arrow-up-down" size={16} color="rgba(255,255,255,0.8)" />
          <Picker 
            mode="selector" 
            range={sortOptions} 
            rangeKey="label"
            onChange={(e) => setSortBy(sortOptions[e.detail.value].value as 'time' | 'likes')}
          >
            <View className="w-[140px] bg-white/20 border border-white/30 h-9 rounded-lg flex flex-row items-center px-3">
              <Text className="text-white text-sm">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </Text>
            </View>
          </Picker>
        </View>
      </View>

      {/* Comments List */}
      <ScrollView scrollY className="px-4 py-6">
        <View className="space-y-4">
          {getSortedComments().map((comment) => {
            // 检查当前评论是否已点赞
            const commentLiked = isLiked(comment.id);
            
            return (
            <Card key={comment.id} className="p-4 bg-[#ffffff]">
              <View className="flex flex-row gap-3">
                <Avatar className="flex-shrink-0">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                
                <View className="flex-1">
                  <View className="flex flex-row items-center justify-between mb-1">
                    <Text className="text-[#252525] font-medium">{comment.author.name}</Text>
                    <Text className="text-[#78716c] text-xs">{comment.time}</Text>
                  </View>
                  
                  <Text className="text-[#252525] leading-relaxed mb-2 block">{comment.content}</Text>
                  
                  {/* Comment Photos */}
                  {comment.photos && comment.photos.length > 0 && (
                    <View className="grid grid-cols-3 gap-2 mb-3">
                      {comment.photos.map((photo, index) => (
                        <View
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden active:opacity-80"
                          onClick={() => handleImageClick(comment.photos, index)}
                        >
                          <ImageWithFallback
                            src={photo}
                            alt={`评论图片 ${index + 1}`}
                            className="w-full h-full object-cover"
                            mode='aspectFill'
                          />
                        </View>
                      ))}
                    </View>
                  )}
                  
                  {/* <View
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex flex-row items-center gap-1 active:opacity-60 transition-opacity"
                  >
                    <IconFont 
                      name="heart" 
                      size={32} 
                      color={commentLiked ? '#ff8c42' : '#78716c'} 
                    />
                    <Text className={`text-sm ${commentLiked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                      {comment.likes}
                    </Text>
                  </View> */}
                </View>
              </View>
            </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Comment Input - Fixed at bottom */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.08)] p-4 pb-6 z-10">
        {/* Photo Preview */}
        {commentPhotos.length > 0 && (
          <View className="flex flex-row gap-2 mb-2">
            {commentPhotos.map((photo, index) => (
              <View key={index} className="relative w-16 h-16 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={photo}
                  alt={`图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <View
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center active:bg-black/80"
                >
                  <Text className="text-white text-xs">×</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        <View className="flex flex-row gap-2 max-w-lg mx-auto items-end">
          <Button
            size="icon"
            variant="outline"
            onClick={handleAddPhoto}
            disabled={commentPhotos.length >= 3}
            className="flex-shrink-0"
          >
            <IconFont name="image" size={36} color="#78716c" />
          </Button>
          
          <Textarea
            placeholder="写下你的评论..."
            value={newComment}
            onInput={(e) => setNewComment(e.detail.value)}
            autoHeight
            className="flex-1 min-h-[40px] max-h-[100px] bg-[#fafaf9] rounded-md p-2 text-sm"
            showConfirmBar={false}
          />
          
          <Button
            size="icon"
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="flex-shrink-0 bg-gradient-to-r from-[#ff8c42] to-amber-500"
          >
            <FontAwesome family='solid' name='paper-plane' size={20} color='white'></FontAwesome>
          </Button>
        </View>
      </View>
    </View>
  );
}