import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import IconFont from '@/icons';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Badge } from '@/ui/badge';
import { ImageWithFallback } from '@/ui/image'; // 假设这是通用组件路径，或者保持 ./figma/...
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

interface MyPostsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function MyPostsPage({ onNavigate }: MyPostsPageProps) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '小橘吃罐头啦',
      content: '今天在小区又遇到了小橘，给它喂了罐头，吃得可香了！希望它能早日找到温暖的家🏠',
      images: [
        'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      time: '2小时前',
      likes: 45,
      comments: 12,
      postType: 'DISCUSSION',
      status: 'PUBLISHED',
      isTop: false,
      isElite: false,
    },
    {
      id: 2,
      title: '流浪猫救助经验分享',
      content: '提醒大家，最近天气转凉，流浪猫咪们需要更多关爱。如果看到流浪猫，请给它们一些食物和水💧',
      images: [],
      time: '1天前',
      likes: 89,
      comments: 23,
      postType: 'EXPERIENCE',
      status: 'PENDING',
      isTop: false,
      isElite: false,
    },
    {
      id: 3,
      title: '领养日活动记录',
      content: '上周末参加了领养日活动，看到好多可爱的猫咪找到了家，真是太开心了！',
      images: [
        'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1680178551733-66a544d08a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJieSUyMGNhdCUyMHNpdHRpbmd8ZW58MXx8fHwxNzYwNDczNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      time: '3天前',
      likes: 67,
      comments: 18,
      postType: 'EXPERIENCE',
      status: 'PUBLISHED',
      isTop: false,
      isElite: true,
    },
    {
      id: 4,
      title: '求助：如何照顾受伤的流浪猫',
      content: '在小区发现一只受伤的流浪猫，应该如何处理？',
      images: [],
      time: '5天前',
      likes: 0,
      comments: 0,
      postType: 'HELP',
      status: 'REJECTED',
      isTop: false,
      isElite: false,
    },
  ]);

  const [deletePostId, setDeletePostId] = useState<number | null>(null);

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

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    setDeletePostId(null);
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
        {posts.map((post) => {
          const statusInfo = getStatusInfo(post.status);
          
          return (
            <Card key={post.id} className="p-4 bg-[#ffffff]">
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
      {posts.length === 0 && (
        <View className="px-4 py-16 text-center">
          <View className="mx-auto mb-4 flex justify-center">
            <IconFont name="message-circle" size={80} color="rgba(120, 113, 108, 0.4)" />
          </View>
          <Text className="text-[#78716c] mb-2 block">还没有发布帖子</Text>
          <Text className="text-[#78716c] text-sm mb-6 block">分享你和流浪猫的故事吧</Text>
          {/* <Button
            onClick={() => onNavigate('createPost')}
            className="bg-[#ff8c42] hover:bg-[#ff8c42]/90"
          >
            发布帖子
          </Button> */}
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