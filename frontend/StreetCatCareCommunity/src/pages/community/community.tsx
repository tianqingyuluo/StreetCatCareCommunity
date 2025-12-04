import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
// 保持自定义组件导入
import { Card } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Input } from '@/ui/input';
import { Badge } from '@/ui/badge';
import { ImageWithFallback } from '@/ui/image';
import { FontAwesome } from 'taro-icons';
import { navigateTo } from '@tarojs/taro';
import IconFont from '@/icons';

interface CommunityPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [posts, setPosts] = useState([
    {
      id: 0,
      title: '【必读】社区版规 & 新手指南',
      author: {
        name: '社区管理员',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
      },
      content: '欢迎来到流浪猫关爱社区！为了维护良好的社区环境，请大家遵守以下规则：1. 文明交流... 2. 领养需谨慎...',
      images: [],
      time: '2025-01-01',
      likes: 999,
      comments: 0,
      liked: false,
      postType: 'DISCUSSION',
      isPinned: true,
      isFeatured: false,
    },
    {
      id: 1,
      title: '小橘吃罐头啦',
      author: {
        name: '爱猫人士小李',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      },
      content: '今天在小区又遇到了小橘，给它喂了罐头，吃得可香了！希望它能早日找到温暖的家🏠',
      images: [
        'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      time: '2小时前',
      likes: 45,
      comments: 12,
      liked: false,
      postType: 'DISCUSSION',
      isPinned: false,
      isFeatured: false,
    },
    {
      id: 2,
      title: '周末领养日活动圆满成功',
      author: {
        name: '志愿者小王',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      },
      content: '周末领养日活动圆满成功！感谢所有参与的志愿者和爱心人士，今天有3只流浪猫找到了新家❤️',
      images: [
        'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1680178551733-66a544d08a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJieSUyMGNhdCUyMHNpdHRpbmd8ZW58MXx8fHwxNzYwNDczNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      time: '5小时前',
      likes: 128,
      comments: 34,
      liked: false,
      postType: 'EXPERIENCE',
      isPinned: false,
      isFeatured: true,
    },
    {
      id: 3,
      title: '最近天气转凉，流浪猫需要关爱',
      author: {
        name: '猫咪守护者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      },
      content: '提醒大家，最近天气转凉，流浪猫咪们需要更多关爱。如果看到流浪猫，请给它们一些食物和水💧',
      images: [],
      time: '1天前',
      likes: 89,
      comments: 23,
      liked: false,
      postType: 'HELP',
      isPinned: false,
      isFeatured: false,
    },
    {
      id: 4,
      title: '领养小花的温馨日常',
      author: {
        name: '新手铲屎官',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      },
      content: '上周领养的小花已经完全适应新家啦！每天都活泼可爱，感谢这个平台让我遇见它😊',
      images: [
        'https://images.unsplash.com/photo-1609854892516-6078bb3b5442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBhZG9yYWJsZXxlbnwxfHx8fDE3NjA1MjczNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      time: '2天前',
      likes: 156,
      comments: 45,
      liked: false,
      postType: 'EXPERIENCE',
      isPinned: false,
      isFeatured: true,
    },
  ]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handlePostClick = (postId: number) => {
    navigateTo({url: '/pages/postDetails/postDetails'});
  };

  const handlePostCreate = () => {
    navigateTo({url: '/pages/createPost/createPost'});
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

  const renderPostCard = (post: any) => (
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
        onClick={() => handlePostClick(123)}
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
          onClick={(e) => { e.stopPropagation(); handlePostClick(123); }}
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
            {filterPostsByType().map(renderPostCard)}
          </TabsContent>

          <TabsContent value="discussion" className="space-y-4 mt-0">
            {filterPostsByType('DISCUSSION').map(renderPostCard)}
          </TabsContent>

          <TabsContent value="experience" className="space-y-4 mt-0">
            {filterPostsByType('EXPERIENCE').map(renderPostCard)}
          </TabsContent>

          <TabsContent value="help" className="space-y-4 mt-0">
            {filterPostsByType('HELP').map(renderPostCard)}
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}