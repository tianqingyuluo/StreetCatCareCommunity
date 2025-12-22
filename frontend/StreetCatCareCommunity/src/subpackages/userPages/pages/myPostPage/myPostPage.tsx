import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import IconFont from '@/icons';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Badge } from '@/ui/badge';
import { ImageWithFallback } from '@/ui/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog';
import { usePostStore } from '@/stores/postStore';
import { ROUTES } from '@/config/routes';

export default function MyPostsPage() {
  const { loading, error, fetchMyPosts, getMyPostsForUI, navigateToPostDetail, deletePost } = usePostStore();
  const posts = getMyPostsForUI();
  
  useLoad(() => {
    fetchMyPosts();
  });

  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const user = {
    name: '爱心志愿者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; iconName: string; iconColor: string; className: string }> = {
      'PUBLISHED': { 
        label: '已发布', 
        iconName: 'check-circle', 
        iconColor: '#15803d', // green-700
        className: 'bg-[#dcfce7] text-[#15803d]' // bg-green-100 text-green-700
      },
      'PENDING': { 
        label: '待审核', 
        iconName: 'clock', 
        iconColor: '#b45309', // amber-700
        className: 'bg-[#fef3c7] text-[#b45309]' // bg-amber-100 text-amber-700
      },
      'REJECTED': { 
        label: '未通过', 
        iconName: 'x-circle', 
        iconColor: '#b91c1c', // red-700
        className: 'bg-[#fee2e2] text-[#b91c1c]' // bg-red-100 text-red-700
      },
    };
    return statusMap[status] || statusMap['PENDING'];
  };

  const getPostTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'DISCUSSION': '讨论贴',
      'EXPERIENCE': '经验贴',
      'HELP': '求助帖',
    };
    return typeMap[type] || '讨论贴';
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setDeletePostId(null);
    } catch (error) {
      console.error('删除帖子失败:', error);
    }
  };

  const handlePostClick = (postId: string) => {
    navigateToPostDetail(postId);
  };

  const handleCreatePost = async () => {
    try {
      await Taro.navigateTo({ url: ROUTES.CREATE_POST });
    } catch (error) {
      Taro.showToast({
        title: '页面跳转失败',
        icon: 'none'
      });
    }
  };

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <View className="flex items-center gap-3 mb-4">
          <Text className="text-white text-2xl">我的帖子</Text>
        </View>
        <Text className="text-white/90 text-sm">共 {posts.length} 条帖子</Text>
      </View>

      {/* Posts List */}
      <View className="px-4 py-4 space-y-4">
        {loading && (
          <View className='text-center py-8'>
            <Text className='text-gray-500'>加载中...</Text>
          </View>
        )}

        {error && (
          <View className='text-center py-8'>
            <Text className='text-red-500'>加载失败: {error}</Text>
          </View>
        )}

        {!loading && !error && posts.map((post) => {
          const statusInfo = getStatusInfo(post.status);
          
          return (
            <Card 
              key={post.id} 
              className="p-4 bg-[#ffffff]"
              onClick={() => handlePostClick(post.id)}
            >
              {/* Author Info and Status */}
              <View className="flex items-center justify-between mb-3">
                <View className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <View>
                    <View className="flex items-center gap-2">
                      <Text className="text-[#252525]">{user.name}</Text>
                      {post.isTop && (
                        <Badge className="bg-[#ef4444] text-white text-xs px-1.5 py-0">
                          <IconFont name="pin" size={20} color="#ffffff" />
                          <Text className="ml-0.5">置顶</Text>
                        </Badge>
                      )}
                      {post.isElite && (
                        <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0">
                          <IconFont name="award" size={20} color="#ffffff" />
                          <Text className="ml-0.5">精华</Text>
                        </Badge>
                      )}
                    </View>
                    <View className="flex items-center gap-2">
                      <Text className="text-[#78716c] text-xs">{post.time}</Text>
                      <Text className="text-[#78716c] text-xs">·</Text>
                      <Text className="text-[#78716c] text-xs">{getPostTypeLabel(post.postType)}</Text>
                    </View>
                  </View>
                </View>
                <View className="flex items-center gap-2">
                  <Badge className={statusInfo.className}>
                    <View className="mr-1">
                        <IconFont name={statusInfo.iconName} size={30} color={statusInfo.iconColor} />
                    </View>
                    <Text>{statusInfo.label}</Text>
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconFont name="x-circle" size={35} color="#78716c" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-[#dc2626] focus:text-[#dc2626]"
                        onClick={() => setDeletePostId(post.id)}
                      >
                        <IconFont name="trash-2" size={40} color="#dc2626" />
                        <Text className="ml-2">删除帖子</Text>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </View>
              </View>

              {/* Title */}
              <Text className="text-[#252525] mb-2 font-medium block">{post.title}</Text>

              {/* Content */}
              <Text className="text-[#252525] mb-3 leading-relaxed block">{post.content}</Text>

              {/* Images */}
              {post.images.length > 0 && (
                <View className={`grid gap-2 mb-3 ${
                  post.images.length === 1 ? 'grid-cols-1' : 
                  post.images.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-3'
                }`}>
                  {post.images.map((image, index) => (
                    <View
                      key={index}
                      className={`relative rounded-lg overflow-hidden ${
                        post.images.length === 1 ? 'aspect-video' : 'aspect-square'
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                        mode='aspectFill'
                      />
                    </View>
                  ))}
                </View>
              )}

              {/* Actions - Only show for published posts */}
              {post.status === 'PUBLISHED' && (
                <View className="flex items-center gap-6 pt-3 border-t border-[rgba(0,0,0,0.08)]">
                  <View className="flex items-center gap-1.5 text-[#78716c]">
                    <IconFont name="heart" size={35} color="#78716c" />
                    <Text className="text-sm">{post.likes}</Text>
                  </View>
                  
                  <View className="flex items-center gap-1.5 text-[#78716c]">
                    <IconFont name="message-circle" size={35} color="#78716c" />
                    <Text className="text-sm">{post.comments}</Text>
                  </View>
                </View>
              )}
            </Card>
          );
        })}
      </View>

      {/* Empty State */}
      {posts.length === 0 && !loading && !error && (
        <View className="px-4 py-16 text-center">
          <View className="mx-auto mb-4 flex justify-center">
            <IconFont name="message-circle" size={80} color="rgba(120, 113, 108, 0.4)" />
          </View>
          <Text className="text-[#78716c] mb-2 block">还没有发布帖子</Text>
          <Text className="text-[#78716c] text-sm mb-6 block">分享你和流浪猫的故事吧</Text>
          <Button
            onClick={handleCreatePost}
            className="bg-[#ff8c42] hover:bg-[#ff8c42]/90"
          >
            发布帖子
          </Button>
        </View>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletePostId !== null} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条帖子吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && handleDeletePost(deletePostId)}
              className="bg-[#dc2626] hover:bg-[#dc2626]/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}