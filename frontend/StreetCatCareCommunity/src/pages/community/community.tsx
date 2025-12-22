import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useLoad, useDidShow } from '@tarojs/taro';
// 保持自定义组件导入
import { Card } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Input } from '@/ui/input';
import { Badge } from '@/ui/badge';
import { ImageWithFallback } from '@/ui/image';
import { FontAwesome } from 'taro-icons';
import IconFont from '@/icons';
import { usePostStore } from '@/stores/postStore';
import type { UIPost } from '@/types/ui';

export default function CommunityPage() {
  const { loading, error, fetchPosts, getPostsForUI, navigateToPostDetail } = usePostStore();
  const posts = getPostsForUI();
  const [searchQuery, setSearchQuery] = useState('');
  
  useLoad(() => {
    fetchPosts();
  });

  // 每次页面显示时重新加载数据（从创建帖子页面返回时会触发）
  useDidShow(() => {
    fetchPosts();
  });

  const handleLike = (postId: string) => {
    // TODO: 实现点赞功能
    console.log('Like post:', postId);
  };

  const handlePostClick = (postId: string) => {
    navigateToPostDetail(postId);
  };

  const handlePostCreate = () => {
    Taro.navigateTo({url: '/pages/createPost/createPost'});
  };
  const getPostTypeLabel = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      'DISCUSSION': { label: '讨论贴', color: 'bg-[#3b82f6]' }, // blue-500
      'EXPERIENCE': { label: '经验贴', color: 'bg-[#22c55e]' }, // green-500
      'HELP': { label: '求助帖', color: 'bg-[#f59e0b]' }, // amber-500
    };
    return typeMap[type] || typeMap['DISCUSSION'];
  };

  const filterPostsByType = (type?: string) => {
    let filtered = posts;
    if (type) {
      filtered = filtered.filter(p => p.postType === type);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  };

  const renderPostCard = (post: UIPost) => (
    <Card 
      key={post.id} 
      className={`p-4 bg-[#ffffff] ${post.isPinned ? 'border-[#ff8c42]/30 bg-[#ff8c42]/5' : ''}`}
    >
      {/* Author Info */}
      <View className="flex flex-row items-center gap-3 mb-3">
        <Avatar>
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <View className="flex-1">
          <Text className="text-[#292524] block">{post.author.name}</Text>
          <Text className="text-[#78716c] text-xs block">{post.time}</Text>
        </View>
        
        {/* 状态标签区域 */}
        <View className="flex flex-row gap-2">
          {post.isPinned && (
            <Badge variant="outline" className="border-[#ef4444] text-[#ef4444] gap-1 px-2 bg-[#fef2f2]">
              <Text className="text-xs">📌 置顶</Text>
            </Badge>
          )}
          {post.isFeatured && (
            <Badge variant="outline" className="border-[#f59e0b] text-[#f59e0b] gap-1 px-2 bg-[#fffbeb]">
              <Text className="text-xs">🏆 精华</Text>
            </Badge>
          )}
          <Badge className={`${getPostTypeLabel(post.postType).color} text-[#ffffff]`}>
            {getPostTypeLabel(post.postType).label}
          </Badge>
        </View>
      </View>

      {/* Title & Content */}
      <View 
        onClick={() => handlePostClick(post.id)}
      >
        <View className="mb-2 flex flex-row items-center gap-2">
          <Text className="text-[#292524] font-medium text-base">{post.title}</Text>
        </View>

        <Text className="text-[#292524] mb-3 leading-relaxed block">{post.content}</Text>

        {/* Images */}
        {post.images.length > 0 && (
          <View className={`grid gap-2 mb-3 ${
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
      </View>

      {/* Actions */}
      <View className="flex flex-row items-center gap-6 pt-3 border-t border-[rgba(0,0,0,0.08)]">
        <View
          onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
          className="flex flex-row items-center gap-1.5"
        >
          <Text className={`text-lg ${post.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
            <FontAwesome family={post.liked ? 'solid': 'regular'} name="heart" size={19} color={post.liked ? 'orange' : 'black'} />
          </Text>
          <Text className={`text-sm ${post.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
            {post.likes}
          </Text>
        </View>
        
        <View 
          onClick={(e) => { e.stopPropagation(); handlePostClick(post.id); }}
          className="flex flex-row items-center gap-1.5"
        >
          <FontAwesome family='regular' name='comment' size={19}/>
          <Text className="text-sm text-[#78716c]">{post.comments}</Text>
        </View>
        
        <View className="flex flex-row items-center gap-1.5 ml-auto">
          <IconFont name='share' size={40} color="#000000" />
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView scrollY className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="text-[#ffffff] text-2xl">社区交流</Text>
          <Button
            size="icon"
            className="bg-[#ffffff] text-[#ff8c42] hover:bg-[#ffffff]/90 rounded-full h-10 w-10 flex items-center justify-center"
            onClick={() => handlePostCreate()}
          >
            {/* <Text className="text-xl">➕</Text> */}
            <FontAwesome family='solid' name='plus' size={22}/>
          </Button>
        </View>
        
        {/* Search Bar */}
        <View className="relative w-full">
          {/* <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Text className="text-[#78716c]">🔍</Text>
          </View> */}
          <Input
            type="text"
            placeholder="搜索帖子..."
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            className="bg-[#ffffff] border-0 h-10 rounded-xl w-full box-border"
          />
        </View>
      </View>

      {/* Tabs */}
      <View className="px-4 -mt-3">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-[#ffffff] rounded-xl shadow-sm mb-4 flex flex-row">
            <TabsTrigger value="all" className="flex-1 rounded-lg">全部</TabsTrigger>
            <TabsTrigger value="discussion" className="flex-1 rounded-lg">讨论贴</TabsTrigger>
            <TabsTrigger value="experience" className="flex-1 rounded-lg">经验贴</TabsTrigger>
            <TabsTrigger value="help" className="flex-1 rounded-lg">求助帖</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-0">
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
            {!loading && !error && filterPostsByType().map(renderPostCard)}
          </TabsContent>

          <TabsContent value="discussion" className="space-y-4 mt-0">
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
            {!loading && !error && filterPostsByType('DISCUSSION').map(renderPostCard)}
          </TabsContent>

          <TabsContent value="experience" className="space-y-4 mt-0">
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
            {!loading && !error && filterPostsByType('EXPERIENCE').map(renderPostCard)}
          </TabsContent>

          <TabsContent value="help" className="space-y-4 mt-0">
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
            {!loading && !error && filterPostsByType('HELP').map(renderPostCard)}
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}