import React from 'react';
import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import IconFont from '@/icons';
import { FontAwesome } from 'taro-icons'
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { ImageWithFallback } from '@/ui/image';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useCatStore } from '@/stores/catStore';
import { usePostStore } from '@/stores/postStore';
import { NavigationHelper } from '@/utils/navigation';
import { ROUTES } from '@/config/routes';

export default function FavoritesPage() {
  // 使用 Store 获取数据和导航方法
  const { 
    getFavoritesForUI, 
    getCatFavoritesForUI, 
    getPostFavoritesForUI,
    fetchFavorites,
    loading 
  } = useFavoriteStore();
  const { navigateToCatDetail } = useCatStore();
  const { navigateToPostDetail } = usePostStore();

  // 页面加载时获取收藏数据
  useLoad(() => {
    fetchFavorites('all');
  });

  const favorites = getFavoritesForUI();
  const catFavorites = getCatFavoritesForUI();
  const postFavorites = getPostFavoritesForUI();

  const getPostTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'DISCUSSION': '讨论贴',
      'EXPERIENCE': '经验贴',
      'HELP': '求助帖',
    };
    return typeMap[type] || '讨论贴';
  };

  // 处理猫咪卡片点击 - 使用 catStore 的导航方法
  const handleCatClick = (catId: string) => {
    navigateToCatDetail(catId);
  };

  // 处理帖子卡片点击 - 使用 postStore 的导航方法
  const handlePostClick = (postId: string) => {
    navigateToPostDetail(postId);
  };

  // 处理导航到猫咪列表
  const handleNavigateToCats = () => {
    NavigationHelper.navigateTo({ url: ROUTES.CATS });
  };

  // 处理导航到社区
  const handleNavigateToCommunity = () => {
    NavigationHelper.navigateTo({ url: ROUTES.COMMUNITY });
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
                    onClick={() => handleCatClick(cat.id)}
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
                            <FontAwesome family='solid' name="star" size={18} color="#fbbf24" />
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
                    onClick={() => handlePostClick(post.id)}
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
                    onClick={() => handleCatClick(cat.id)}
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
                          <FontAwesome family='solid' name="star" size={18} color="#fbbf24" />
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
                  onClick={handleNavigateToCats}
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
                  onClick={() => handlePostClick(post.id)}
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
                  onClick={handleNavigateToCommunity}
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
