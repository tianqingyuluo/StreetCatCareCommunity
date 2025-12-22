import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useLoad, useUnload } from '@tarojs/taro';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/ui/carousel';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/avatar';
import { FontAwesome } from 'taro-icons' 

import { useCatStore } from '@/stores/catStore';
import { useFeedingStore } from '@/stores/feedingStore';
import { useCommentStore } from '@/stores/commentStore';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { ROUTES } from '@/config/routes';
import { TargetType } from '@/types/api';
import IconFont from '@/icons';

export default function CatDetailPage() {
  // 从 CatStore 获取猫咪数据
  const { 
    currentTargetId, 
    fetchCatDetail, 
    clearCurrentTargetId,
    getSelectedCatForUI,
    loading: catLoading,
    error: catError
  } = useCatStore();
  
  const cat = getSelectedCatForUI();

  // 从 FavoriteStore 获取收藏状态
  const {
    fetchFavorites,
    toggleFavorite,
    isFavorited,
    favoriteIds,
    loading: favoriteLoading
  } = useFavoriteStore();
  
  // 检查当前猫咪是否已收藏
  const isCollected = currentTargetId ? isFavorited(currentTargetId) : false;
  
  console.log('🐱 当前猫咪ID:', currentTargetId, ', 是否收藏:', isCollected, ', 收藏列表:', Array.from(favoriteIds));

  // 从 FeedingStore 获取投喂记录
  const {
    getFeedingsForUI,
    fetchFeedingsByCat,
    loading: feedingLoading
  } = useFeedingStore();
  
  const feedingRecords = getFeedingsForUI();

  // 从 CommentStore 获取评论数据
  const {
    getCommentsForUI,
    fetchComments,
    loading: commentLoading
  } = useCommentStore();
  
  const comments = getCommentsForUI();

  // 页面加载时获取所有数据
  useLoad(() => {
    if (currentTargetId) {
      // 获取猫咪详情
      fetchCatDetail(currentTargetId);
      
      // 获取投喂记录
      fetchFeedingsByCat(currentTargetId);
      
      // 获取评论（只获取前3条热门评论）
      fetchComments({ targetType: TargetType.CAT, targetId: currentTargetId });
      
      // 获取收藏列表
      fetchFavorites('cats');
    }
  });

  // 页面卸载时清除导航状态
  useUnload(() => {
    clearCurrentTargetId();
  });

  const handleCommentsClick = () => {
    if (currentTargetId) {
      Taro.navigateTo({
        url: ROUTES.CAT_COMMENTS
      }).catch(() => {
        Taro.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      });
    }
  };

  const handleFeedingClick = () => {
    Taro.navigateTo({
      url: ROUTES.FEEDING_RECORD
    }).catch(() => {
      Taro.showToast({
        title: '页面跳转失败',
        icon: 'none'
      });
    });
  };

  const handleAdoptionClick = () => {
    Taro.navigateTo({
      url: `${ROUTES.ADOPTION_APPLICATION}?showForm=true`
    }).catch(() => {
      Taro.showToast({
        title: '页面跳转失败',
        icon: 'none'
      });
    });
  };

  // 处理收藏/取消收藏
  const handleFavoriteClick = async () => {
    if (!currentTargetId || favoriteLoading) return;
    
    await toggleFavorite(TargetType.CAT, currentTargetId);
  };

  // 如果正在加载，显示加载状态
  if (catLoading || feedingLoading || commentLoading) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-[#fafaf9]">
        <Text className="text-[#78716c]">加载中...</Text>
      </View>
    );
  }

  // 如果有错误，显示错误信息
  if (catError) {
    return (
      <View className="flex flex-col items-center justify-center min-h-screen bg-[#fafaf9] px-4">
        <Text className="text-red-500 mb-4">{catError}</Text>
        <Button onClick={() => currentTargetId && fetchCatDetail(currentTargetId)}>
          <Text>重试</Text>
        </Button>
      </View>
    );
  }

  // 如果没有猫咪数据，显示提示
  if (!cat) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-[#fafaf9]">
        <Text className="text-[#78716c]">未找到猫咪信息</Text>
      </View>
    );
  }

  // 使用猫咪的实际照片，如果没有则使用默认图片
  const images = cat.image ? [
    cat.image
  ] : [
    'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  // 只显示前3条热门评论
  const topComments = comments.slice(0, 3);

  return (
    <ScrollView className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Image Carousel */}
      <Carousel orientation="horizontal" className="relative w-full">
        <CarouselContent className="relative">
          {images.map((image, index) => (
            <CarouselItem key={index} className="basis-full pl-0">
              <View className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={image}
                  mode="aspectFill"
                  className="w-full h-full"
                />
              </View>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Indicators */}
        <View className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {/* 这里可以添加自定义的指示器点 */}
          <View className="flex items-center justify-center gap-2">
            {images.map((_, index) => (
              <View
                key={index}
                className="w-2 h-2 rounded-full bg-white/50"
              />
            ))}
          </View>
        </View>

        {/* Top Actions */}
        <View className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-20">
          <View>
            
          </View>
          
          <View className="flex gap-2">
            <Button
              className={`bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full w-10 h-10 ${favoriteLoading ? 'opacity-50' : ''}`}
              onClick={handleFavoriteClick}
            >
              <FontAwesome family={isCollected ? 'solid' : 'regular'} name='star' size={20} color={isCollected ? '#fbbf24' : 'white'}/>
            </Button>
            <Button
              className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full w-10 h-10"
            >
              <FontAwesome family='solid' name='share-square' size={18} color='white'/>
            </Button>
          </View>
        </View>

        {/* Carousel Navigation Buttons
        <View className="absolute bottom-4 left-0 right-0 flex justify-between px-4 z-10 pointer-events-none">
          <View className="pointer-events-auto">
            <CarouselPrevious className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full w-10 h-10 relative top-0 left-0 -translate-y-0 -translate-x-0" />
          </View>
          <View className="pointer-events-auto">
            <CarouselNext className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full w-10 h-10 relative top-0 right-0 -translate-y-0 translate-x-0" />
          </View>
        </View>
      </Carousel> */}
      </Carousel>

      {/* Cat Info */}
      <View className="px-4 py-6">
        <View className="flex items-start justify-between mb-4">
          <View>
            <Text className="text-2xl text-[#141414] mb-2 font-bold">
              {cat.name}
            </Text>
            <View className="flex items-center gap-2 flex-row">
              <Badge className="bg-[#ff8c42] text-white">
                {cat.status}
              </Badge>
              <Badge variant="outline" className="text-[#141414]">
                {cat.health}
              </Badge>
            </View>
          </View>
          
          <View className="text-right">
            <View className="flex items-center gap-1 text-[#ff8c42] flex-row justify-end">
              <FontAwesome family={isCollected ? 'solid' : 'regular'} name='star' size={20} color={isCollected ? '#fbbf24' : 'grey'}/>
              <Text className="text-[#ff8c42]">{cat.likes}</Text>
            </View>
            <Text className="text-[#78716c] text-sm">人收藏</Text>
          </View>
        </View>

        {/* Basic Info Grid */}
        <Card className="p-4 bg-white mb-6">
          <View className="grid grid-cols-2 gap-4">
            <View className="flex items-start gap-3 flex-row">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center flex-shrink-0">
                <FontAwesome family='solid' name='calendar' size={20} color='orange'/>
              </View>
              <View className='flex flex-col'>
                <Text className="text-[#78716c] text-sm">年龄</Text>
                <Text className="text-[#141414]">{cat.age}</Text>
              </View>
            </View>
            
            <View className="flex items-start gap-3 flex-row">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center flex-shrink-0">
                <FontAwesome family='solid' name='venus-mars' size={20} color='orange'/>
              </View>
              <View className='flex flex-col'>
                <Text className="text-[#78716c] text-sm">性别</Text>
                <Text className="text-[#141414]">{cat.gender}猫</Text>
              </View>
            </View>
            
            <View className="flex items-start gap-3 flex-row">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center flex-shrink-0">
                <FontAwesome family='solid' name='map-marker-alt' size={20} color='orange' />
              </View>
              <View className='flex flex-col'>
                <Text className="text-[#78716c] text-sm">位置</Text>
                <Text className="text-[#141414]">{cat.location}</Text>
              </View>
            </View>
            
            <View className="flex items-start gap-3 flex-row">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center flex-shrink-0">
                <FontAwesome family='solid' name='tag' size={20} color='orange' />
              </View>
              <View className='flex flex-col'>
                <Text className="text-[#78716c] text-sm">品种</Text>
                <Text className="text-[#141414]">{cat.breed}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Description */}
        <View className='mb-3'>
          <Text className="text-[#141414] mb-3 font-semibold">猫咪介绍</Text>
          <Card className="p-4 bg-white mt-3">
            <Text className="text-[#78716c] leading-relaxed">
              {cat.name}是一只非常温顺可爱的{cat.breed}，性格亲人，喜欢和人互动。目前身体健康，已完成疫苗接种和绝育手术。希望能找到一个有爱心的家庭，给它一个温暖的家。
            </Text>
          </Card>
        </View>

        {/* Top Comments */}
        <View className="mb-6">
          <View className="flex flex-row items-center justify-between mb-3">
            <View className="flex flex-row items-center gap-2">
              <IconFont name="message-circle" size={20} color="#252525" />
              <Text className="text-[#252525] font-medium text-base">热门评论</Text>
            </View>
            <Button
              className="text-[#ff8c42] hover:bg-[#fff5ed]"
              onClick={() => handleCommentsClick()}
            >
              查看全部
            </Button>
          </View>
          
          <Card className="p-4 bg-[#ffffff]">
            <View className="space-y-4">
              {topComments.slice(0, 3).map((comment) => (
                <View key={comment.id} className="pb-4 border-b border-[rgba(0,0,0,0.08)] last:border-0 last:pb-0">
                  <View className="flex flex-row gap-3">
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <View className="flex-1">
                      <View className="flex flex-row items-center justify-between mb-1">
                        <Text className="text-[#252525] text-sm">{comment.author.name}</Text>
                        <Text className="text-[#78716c] text-xs">{comment.time}</Text>
                      </View>
                      <Text className="text-[#78716c] text-sm leading-relaxed mb-2 block">
                        {comment.content}
                      </Text>
                      <View className="flex flex-row items-center gap-1 text-[#ff8c42]">
                        <IconFont name="thumbs-up" size={12} color="#ff8c42" />
                        <Text className="text-xs">{comment.likes}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Feeding Records */}
        <View className="mb-6">
          <View className="flex items-center justify-between mb-3 flex-row">
            <Text className="text-[#141414] font-semibold">近期投喂记录</Text>
            <Button
              className="text-[#ff8c42] hover:bg-[#fff5ed]"
              onClick={handleFeedingClick}
            >
              <Text className="text-[#ff8c42] text-sm">查看全部</Text>
            </Button>
          </View>
          
          {feedingRecords.length > 0 ? (
            <Card className="p-4 bg-white">
              <View className="space-y-3">
                {feedingRecords.slice(0, 3).map((record, index) => (
                  <View key={record.id}>
                    <View className="flex items-center justify-between pb-3 flex-row">
                      <View className='flex flex-col'>
                        <Text className="text-[#141414] text-sm mb-1">{record.catName || '爱心志愿者'}</Text>
                        <Text className="text-[#78716c] text-xs">{record.date}</Text>
                      </View>
                      <View className="text-right flex flex-col">
                        <Text className="text-[#141414] text-sm">{record.foodType}</Text>
                        <Text className="text-[#78716c] text-xs">{record.amount}</Text>
                      </View>
                    </View>
                    {index < Math.min(feedingRecords.length, 3) - 1 && (
                      <View className="border-b border-gray-300" />
                    )}
                  </View>
                ))}
              </View>
            </Card>
          ) : (
            <Card className="p-4 bg-white">
              <Text className="text-[#78716c] text-center">暂无投喂记录</Text>
            </Card>
          )}
        </View>

        {/* Spacer for fixed bottom */}
        <View className="h-24" />
      </View>

      {/* Bottom Actions */}
      <View className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-6">
        <View className="flex gap-3 max-w-lg mx-auto flex-row">
          <Button
            className="flex-1 h-12 rounded-xl text-[#ff8c42] hover:bg-[#fff5ed] border-[#ff8c42] border-1"
            onClick={handleFeedingClick}
          >
            <Text className="text-[#ff8c42]">记录投喂</Text>
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#ff8c42] to-amber-500 hover:from-[#ff8c42]/90 hover:to-amber-500/90 text-white"
            onClick={handleAdoptionClick}
          >
            <Text className="text-white">申请领养</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}