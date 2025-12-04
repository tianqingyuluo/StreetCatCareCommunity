import { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
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
import { navigateTo } from '@tarojs/taro';
import IconFont from '@/icons';

interface CatDetailPageProps {
  data: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function CatDetailPage({ data, onNavigate }: CatDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const catId = useCatStore((state) => state.selectedCatId);
  console.log('Selected Cat ID from Store:', catId);

  const cat = data || {
    id: 1,
    name: '小橘',
    image: 'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    breed: '中华田园猫',
    age: '2岁',
    gender: '公',
    health: '健康',
    status: '待领养',
    location: '朝阳区',
    likes: 328,
  };

  const images = [
    cat.image,
    'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1680178551733-66a544d08a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJieSUyMGNhdCUyMHNpdHRpbmd8ZW58MXx8fHwxNzYwNDczNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const feedingRecords = [
    { date: '2025-10-14', feeder: '爱心志愿者A', food: '猫粮', amount: '200g' },
    { date: '2025-10-13', feeder: '爱心志愿者B', food: '罐头', amount: '1罐' },
    { date: '2025-10-12', feeder: '爱心志愿者C', food: '猫粮', amount: '150g' },
  ];

  const topComments = [
    {
      id: 1,
      author: {
        name: '猫咪爱好者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
      },
      content: '小橘真的太可爱了！每次看到它都让人心情变好，希望它能早日找到温暖的家。',
      time: '3天前',
      likes: 156,
    },
    {
      id: 2,
      author: {
        name: '志愿者小张',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
      },
      content: '已经投喂了好几次，小橘很亲人，适合家庭领养。',
      time: '5天前',
      likes: 89,
    },
    {
      id: 3,
      author: {
        name: '铲屎官新手',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
      },
      content: '看着真的好心疼，希望能有好心人领养它！',
      time: '1周前',
      likes: 67,
    },
  ];

  const handleCommentsClick = () => {
    navigateTo({url: '/subpackages/catPages/pages/catComments/catComments'});
  };

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
          {/* <Button
            className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full w-10 h-10"
            onClick={() => onNavigate('cats')}
          >
            <Text className="text-white text-lg">⬅️</Text>
          </Button> */}
          <View>
            
          </View>
          
          <View className="flex gap-2">
            <Button
              className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full w-10 h-10"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {/* <Text className={`text-lg ${isFavorite ? 'text-red-500' : 'text-white'}`}>
                {isFavorite ? '❤️' : '🤍'}
              </Text> */}
              <FontAwesome family={isFavorite ? 'solid' : 'regular'} name='heart' size={20} color={isFavorite ? 'red' : 'white'}/>
            </Button>
            <Button
              className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full w-10 h-10"
            >
              {/* <Text className="text-white text-lg">↗️</Text> */}
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
              <FontAwesome family={isFavorite ? 'solid' : 'regular'} name='heart' size={20} color={isFavorite ? 'red' : 'grey'}/>
              <Text className="text-[#ff8c42]">{cat.likes}</Text>
            </View>
            <Text className="text-[#78716c] text-sm">人喜欢</Text>
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
              variant="ghost"
              size="sm"
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
              onClick={() => onNavigate('feeding')}
            >
              <Text className="text-[#ff8c42] text-sm">查看全部</Text>
            </Button>
          </View>
          
          <Card className="p-4 bg-white">
            <View className="space-y-3">
              {feedingRecords.map((record, index) => (
                <View key={index}>
                  <View className="flex items-center justify-between pb-3 flex-row">
                    <View className='flex flex-col'>
                      <Text className="text-[#141414] text-sm mb-1">{record.feeder}</Text>
                      <Text className="text-[#78716c] text-xs">{record.date}</Text>
                    </View>
                    <View className="text-right flex flex-col">
                      <Text className="text-[#141414] text-sm">{record.food}</Text>
                      <Text className="text-[#78716c] text-xs">{record.amount}</Text>
                    </View>
                  </View>
                  {index < feedingRecords.length - 1 && (
                    <View className="border-b border-gray-300" />
                  )}
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Spacer for fixed bottom */}
        <View className="h-24" />
      </View>

      {/* Bottom Actions */}
      <View className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-6">
        <View className="flex gap-3 max-w-lg mx-auto flex-row">
          <Button
            className="flex-1 h-12 rounded-xl text-[#ff8c42] hover:bg-[#fff5ed] border-[#ff8c42] border-1"
            onClick={() => onNavigate('feeding')}
          >
            <Text className="text-[#ff8c42]">记录投喂</Text>
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#ff8c42] to-amber-500 hover:from-[#ff8c42]/90 hover:to-amber-500/90 text-white"
            onClick={() => onNavigate('adoption', cat)}
          >
            <Text className="text-white">申请领养</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}