import React from 'react';
import { navigateTo } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import IconFont from '@/icons';
import { FontAwesome } from 'taro-icons'
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { ImageWithFallback } from '@/ui/image';

interface FavoritesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function FavoritesPage({ onNavigate }: FavoritesPageProps) {
  const favorites = [
    {
      targetType: 'CAT',
      targetId: 1,
      createdAt: '2025-11-20',
      cat: {
        id: 1,
        name: '小橘',
        image: 'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        breed: '中华田园猫',
        age: '2岁',
        status: '待领养',
        location: '朝阳区',
        likes: 328,
      },
    },
    {
      targetType: 'CAT',
      targetId: 2,
      createdAt: '2025-11-22',
      cat: {
        id: 2,
        name: '小白',
        image: 'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        breed: '白猫',
        age: '1岁',
        status: '待领养',
        location: '海淀区',
        likes: 256,
      },
    },
    {
      targetType: 'CAT',
      targetId: 3,
      createdAt: '2025-11-24',
      cat: {
        id: 3,
        name: '咪咪',
        image: 'https://images.unsplash.com/photo-1609854892516-6078bb3b5442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBhZG9yYWJsZXxlbnwxfHx8fDE3NjA1MjczNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        breed: '狸花猫',
        age: '6个月',
        status: '待领养',
        location: '丰台区',
        likes: 523,
      },
    },
    {
      targetType: 'POST',
      targetId: 101,
      createdAt: '2025-11-23',
      post: {
        id: '101',
        title: '【精华】新手养猫完整指南',
        content: '整理了一份新手养猫的完整指南，包括猫咪日常护理、疫苗接种、饮食搭配等，希望能帮到大家😊',
        images: [
          'https://images.unsplash.com/photo-1609854892516-6078bb3b5442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBhZG9yYWJsZXxlbnwxfHx8fDE3NjA1MjczNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        ],
        authorId: '10',
        author: {
          name: '资深铲屎官',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
        },
        createdAt: '2025-11-15',
        likeCount: 256,
        commentCount: 67,
        postType: 'EXPERIENCE',
        status: 'PUBLISHED',
        isTop: false,
        isElite: true,
      },
    },
    {
      targetType: 'POST',
      targetId: 102,
      createdAt: '2025-11-25',
      post: {
        id: '102',
        title: '【置顶】周末领养日活动通知',
        content: '本周末将举办领养日活动，欢迎大家来参加！地点：朝阳区流浪猫救助站，时间：周六上午10点❤️',
        images: [
          'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        ],
        authorId: '11',
        author: {
          name: '志愿者小王',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        },
        createdAt: '2025-11-20',
        likeCount: 328,
        commentCount: 89,
        postType: 'EXPERIENCE',
        status: 'PUBLISHED',
        isTop: true,
        isElite: true,
      },
    },
  ];

  const catFavorites = favorites.filter(f => f.targetType === 'CAT');
  const postFavorites = favorites.filter(f => f.targetType === 'POST');

  const getPostTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'DISCUSSION': '讨论贴',
      'EXPERIENCE': '经验贴',
      'HELP': '求助帖',
    };
    return typeMap[type] || '讨论贴';
  };

  const handleCatClick = () => {
    navigateTo({url: '/pages/catDetails/catDetails'});
  };

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <View className="flex items-center gap-3 mb-4">
          <Text className="text-white text-2xl">我的收藏</Text>
        </View>
        <Text className="text-white/90 text-sm">共 {favorites.length} 条收藏</Text>
      </View>

      {/* Tabs */}
      <View className="px-4 py-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-white rounded-xl shadow-sm mb-4 grid grid-cols-3">
            <TabsTrigger value="all" className="rounded-lg">全部</TabsTrigger>
            <TabsTrigger value="cats" className="rounded-lg">猫咪</TabsTrigger>
            <TabsTrigger value="posts" className="rounded-lg">帖子</TabsTrigger>
          </TabsList>

          {/* All Favorites */}
          <TabsContent value="all" className="space-y-4 mt-0">
            {favorites.map((favorite, index) => {
              if (favorite.targetType === 'CAT' && favorite.cat) {
                const cat = favorite.cat;
                return (
                  <Card
                    key={`cat-${index}`}
                    className="p-3 bg-[#ffffff] cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleCatClick()}
                  >
                    <View className="flex gap-3">
                      <View className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          mode='aspectFill'
                        />
                      </View>
                      
                      <View className="flex-1">
                        <View className="flex items-start justify-between">
                          <Text className="text-[#252525]">{cat.name}</Text>
                          <Badge className="bg-[#ff8c42] text-[#ffffff] text-xs">
                            {cat.status}
                          </Badge>
                        </View>
                        
                        <View className="mt-1">
                          <Text className="text-[#78716c] text-sm">
                          {cat.breed} · {cat.age}
                          </Text>
                        </View>
                        
                        <View className="flex items-center justify-between text-xs mt-8">
                          <View className="flex items-center gap-1 text-[#78716c]">
                            <IconFont name="map-pin" size={30} color="#78716c" />
                            <Text>{cat.location}</Text>
                          </View>
                          <View className="flex items-center gap-1 text-[#ff8c42]">
                            {/* <IconFont name="heart" size={30} color="#ff8c42" /> */}
                            <FontAwesome family='solid' name="heart" size={18} color="orange" />
                            <Text>{cat.likes}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Card>
                );
              } else if (favorite.targetType === 'POST' && favorite.post) {
                const post = favorite.post;
                return (
                  <Card
                    key={`post-${index}`}
                    className="p-4 bg-[#ffffff] cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onNavigate('postDetail', post)}
                  >
                    <View className="flex items-center gap-3 mb-3">
                      <Avatar className="flex-shrink-0">
                        <AvatarImage src={post.author?.avatar} />
                        <AvatarFallback>{post.author?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <View className="flex-1">
                        <Text className="text-[#252525] text-sm">{post.author?.name}</Text>
                        <Text className="text-[#78716c] text-xs">{post.createdAt}</Text>
                      </View>
                      <View className="flex gap-1">
                        {post.isTop && (
                          <Badge className="bg-red-500 text-white text-xs">
                            <IconFont name="pin" size={30} color="#ffffff" />
                            <Text className="ml-0.5">置顶</Text>
                          </Badge>
                        )}
                        {post.isElite && (
                          <Badge className="bg-amber-500 text-white text-xs">
                            <IconFont name="award" size={30} color="#ffffff" />
                            <Text className="ml-0.5">精华</Text>
                          </Badge>
                        )}
                      </View>
                    </View>

                    <Text className="text-[#252525] mb-2">{post.title}</Text>
                    <Text className="text-[#252525] text-sm mb-3 leading-relaxed line-clamp-2">
                      {post.content}
                    </Text>

                    {post.images && post.images.length > 0 && (
                      <View className="mb-3">
                        <View className="relative aspect-video rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={post.images[0]}
                            alt="帖子图片"
                            className="w-full h-full object-cover"
                            mode='aspectFill'
                          />
                        </View>
                      </View>
                    )}

                    <View className="flex items-center gap-4 pt-3 border-t border-[rgba(0,0,0,0.08)] text-[#78716c] text-sm">
                      <View className="flex items-center gap-1">
                        <IconFont name="heart" size={30} color="#78716c" />
                        <Text>{post.likeCount}</Text>
                      </View>
                      <View className="flex items-center gap-1">
                        <IconFont name="message-circle" size={30} color="#78716c" />
                        <Text>{post.commentCount}</Text>
                      </View>
                      <Text className="ml-auto text-xs">{getPostTypeLabel(post.postType || '')}</Text>
                    </View>
                  </Card>
                );
              }
              return null;
            })}

            {favorites.length === 0 && (
              <View className="py-16 text-center">
                <View className="mx-auto mb-4 flex justify-center">
                  <IconFont name="heart" size={64} color="rgba(120, 113, 108, 0.4)" />
                </View>
                <Text className="text-[#78716c] mb-2 block">还没有收藏</Text>
                <Text className="text-[#78716c] text-sm block">快去收藏喜欢的猫咪或帖子吧</Text>
              </View>
            )}
          </TabsContent>

          {/* Cat Favorites */}
          <TabsContent value="cats" className="mt-0">
            <View className="grid grid-cols-2 gap-3">
              {catFavorites.map((favorite, index) => {
                const cat = favorite.cat;
                if (!cat) return null;
                
                return (
                  <Card
                    key={index}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-[#ffffff]"
                    onClick={() => onNavigate('catDetail', cat)}
                  >
                    <View className="relative aspect-square">
                      <ImageWithFallback
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                        mode='aspectFill'
                      />
                      <View className="absolute top-2 right-2">
                        <Badge className="bg-[#ff8c42] text-[#ffffff] text-xs px-2 py-0.5">
                          {cat.status}
                        </Badge>
                      </View>
                      <View className="absolute top-2 left-2">
                        <IconFont name="heart" size={30} color="#ef4444" />
                      </View>
                    </View>
                    
                    <View className="p-3">
                      <Text className="text-[#252525] mb-1 block">{cat.name}</Text>
                      <Text className="text-[#78716c] text-sm mb-2 block">
                        {cat.breed} · {cat.age}
                      </Text>
                      
                      <View className="flex items-center justify-between text-xs">
                        <View className="flex items-center gap-1 text-[#78716c]">
                          <IconFont name="map-pin" size={30} color="#78716c" />
                          <Text>{cat.location}</Text>
                        </View>
                        <View className="flex items-center gap-1 text-[#ff8c42]">
                          <IconFont name="heart" size={30} color="#ff8c42" />
                          <Text>{cat.likes}</Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>

            {catFavorites.length === 0 && (
              <View className="py-16 text-center">
                <View className="mx-auto mb-4 flex justify-center">
                  <IconFont name="heart" size={64} color="rgba(120, 113, 108, 0.4)" />
                </View>
                <Text className="text-[#78716c] mb-2 block">还没有收藏的猫咪</Text>
                <Text className="text-[#78716c] text-sm mb-6 block">去猫咪列表看看吧</Text>
                <Button
                  onClick={() => onNavigate('cats')}
                  className="bg-[#ff8c42] hover:bg-[#ff8c42]/90"
                >
                  浏览猫咪
                </Button>
              </View>
            )}
          </TabsContent>

          {/* Post Favorites */}
          <TabsContent value="posts" className="space-y-4 mt-0">
            {postFavorites.map((favorite, index) => {
              const post = favorite.post;
              if (!post) return null;
              
              return (
                <Card
                  key={index}
                  className="p-4 bg-[#ffffff] cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onNavigate('postDetail', post)}
                >
                  <View className="flex items-center gap-3 mb-3">
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={post.author?.avatar} />
                      <AvatarFallback>{post.author?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <View className="flex-1">
                      <Text className="text-[#252525] text-sm">{post.author?.name}</Text>
                      <Text className="text-[#78716c] text-xs">{post.createdAt}</Text>
                    </View>
                    <View className="flex gap-1">
                      {post.isTop && (
                        <Badge className="bg-red-500 text-white text-xs">
                          <IconFont name="pin" size={30} color="#ffffff" />
                          <Text className="ml-0.5">置顶</Text>
                        </Badge>
                      )}
                      {post.isElite && (
                        <Badge className="bg-amber-500 text-white text-xs">
                          <IconFont name="award" size={30} color="#ffffff" />
                          <Text className="ml-0.5">精华</Text>
                        </Badge>
                      )}
                    </View>
                  </View>

                  <Text className="text-[#252525] mb-2">{post.title}</Text>
                  <Text className="text-[#252525] text-sm mb-3 leading-relaxed line-clamp-2">
                    {post.content}
                  </Text>

                  {post.images && post.images.length > 0 && (
                    <View className="mb-3">
                      <View className="relative aspect-video rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={post.images[0]}
                          alt="帖子图片"
                          className="w-full h-full object-cover"
                          mode='aspectFill'
                        />
                      </View>
                    </View>
                  )}

                  <View className="flex items-center gap-4 pt-3 border-t border-[rgba(0,0,0,0.08)] text-[#78716c] text-sm">
                    <View className="flex items-center gap-1">
                      <IconFont name="heart" size={30} color="#78716c" />
                      <Text>{post.likeCount}</Text>
                    </View>
                    <View className="flex items-center gap-1">
                      <IconFont name="message-circle" size={30} color="#78716c" />
                      <Text>{post.commentCount}</Text>
                    </View>
                    <Text className="ml-auto text-xs">{getPostTypeLabel(post.postType || '')}</Text>
                  </View>
                </Card>
              );
            })}

            {postFavorites.length === 0 && (
              <View className="py-16 text-center">
                <View className="mx-auto mb-4 flex justify-center">
                  <IconFont name="heart" size={64} color="rgba(120, 113, 108, 0.4)" />
                </View>
                <Text className="text-[#78716c] mb-2 block">还没有收藏的帖子</Text>
                <Text className="text-[#78716c] text-sm mb-6 block">去社区看看吧</Text>
                <Button
                  onClick={() => onNavigate('community')}
                  className="bg-[#ff8c42] hover:bg-[#ff8c42]/90"
                >
                  浏览帖子
                </Button>
              </View>
            )}
          </TabsContent>
        </Tabs>
      </View>
    </View>
  );
}