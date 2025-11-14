import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { FontAwesome } from 'taro-icons'
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Label } from '@/ui/label';
import { ImageWithFallback } from '@/ui/image';

import { useCatStore } from '@/stores/catStore';

// ... (其他接口和状态保持不变)

interface CatListPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Cat {
  id: number;
  name: string;
  image: string;
  breed: string;
  age: string;
  gender: string;
  health: string;
  status: string;
  location: string;
  likes: number;
}

export default function CatListPage({ onNavigate }: CatListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBreed, setFilterBreed] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterHealth, setFilterHealth] = useState('all');

  const cats: Cat[] = [
    {
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
    },
    {
      id: 2,
      name: '小白',
      image: 'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      breed: '白猫',
      age: '1岁',
      gender: '母',
      health: '健康',
      status: '待领养',
      location: '海淀区',
      likes: 256,
    },
    {
      id: 3,
      name: '虎斑',
      image: 'https://images.unsplash.com/photo-1680178551733-66a544d08a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJieSUyMGNhdCUyMHNpdHRpbmd8ZW58MXx8fHwxNzYwNDczNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      breed: '虎斑猫',
      age: '3岁',
      gender: '公',
      health: '健康',
      status: '待领养',
      location: '西城区',
      likes: 412,
    },
    {
      id: 4,
      name: '小花',
      image: 'https://images.unsplash.com/photo-1669085899780-e4a41f42d3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJheSUyMGNhdCUyMGN1dGV8ZW58MXx8fHwxNzYwNTI3MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      breed: '中华田园猫',
      age: '1.5岁',
      gender: '母',
      health: '健康',
      status: '待领养',
      location: '东城区',
      likes: 189,
    },
    {
      id: 5,
      name: '咪咪',
      image: 'https://images.unsplash.com/photo-1609854892516-6078bb3b5442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBhZG9yYWJsZXxlbnwxfHx8fDE3NjA1MjczNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      breed: '狸花猫',
      age: '6个月',
      gender: '母',
      health: '健康',
      status: '待领养',
      location: '丰台区',
      likes: 523,
    },
    {
      id: 6,
      name: '大黄',
      image: 'https://images.unsplash.com/photo-1651590733106-3147aea068b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBvdXRkb29yJTIwbmF0dXJlfGVufDF8fHx8MTc2MDUyNzM0OXww&ixlib=rb-4.1.0&q=80&w=1080',
      breed: '中华田园猫',
      age: '4岁',
      gender: '公',
      health: '健康',
      status: '待领养',
      location: '石景山区',
      likes: 234,
    },
  ];

  const filteredCats = cats.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBreed = filterBreed === 'all' || cat.breed === filterBreed;
    const matchesGender = filterGender === 'all' || cat.gender === filterGender;
    const matchesHealth = filterHealth === 'all' || cat.health === filterHealth;

    return matchesSearch && matchesBreed && matchesGender && matchesHealth;
  });

  const handleCatClick = (catId: number) => {
    useCatStore.getState().setSelectedCatId(catId);
    navigateTo({ url: `/pages/catDetails/catDetails` });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <ScrollView className="pb-20 bg-[#fafaf9] min-h-screen" scrollY>
      {/* Header - 保持不变 */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <Text className="text-[#ffffff] text-2xl mb-5">猫咪列表</Text>

        {/* Search Bar - 保持不变 */}
        <View className="flex gap-2 flex-row items-center mt-4">
          <View className="flex-1 relative">
            <Input
              placeholder="搜索猫咪名称或品种..."
              value={searchQuery}
              onInput={(e) => handleSearch(e.detail.value)}
              className="bg-[#ffffff] border-0 rounded-full h-11"
            />
          </View>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="bg-[#ffffff] text-[#ff8c42] hover:bg-[rgba(255,255,255,0.9)] ml-5 rounded-full h-11 w-11 flex-shrink-0 z-50"
              >
                <FontAwesome family="solid" name="filter" color="gray" size={15}></FontAwesome>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl bg-[#fafaf9] h-3/4">
              <SheetHeader>
                <SheetTitle>筛选条件</SheetTitle>
              </SheetHeader>

              <ScrollView className="space-y-6 mt-6" scrollY>
                {/* 筛选内容 - 保持不变 */}
                <View className="mb-6">
                  <Text className="mb-3 font-bold">品种</Text>
                  <RadioGroup value={filterBreed} onChange={(e) => {
                    setFilterBreed(e.detail.value)
                    console.log('Selected breed:', e.detail.value);
                  }}>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="all" id="breed-all" />
                      <Label htmlFor="breed-all">全部</Label>
                    </View>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="中华田园猫" id="breed-1" />
                      <Label htmlFor="breed-1">中华田园猫</Label>
                    </View>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="白猫" id="breed-2" />
                      <Label htmlFor="breed-2">白猫</Label>
                    </View>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="虎斑猫" id="breed-3" />
                      <Label htmlFor="breed-3">虎斑猫</Label>
                    </View>
                  </RadioGroup>
                </View>

                <View className="mb-6">
                  <Text className="mb-3 font-bold">性别</Text>
                  <RadioGroup value={filterGender} onChange={(e) => setFilterGender(e.detail.value)}>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="all" id="gender-all" />
                      <Label htmlFor="gender-all">全部</Label>
                    </View>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="公" id="gender-m" />
                      <Label htmlFor="gender-m">公猫</Label>
                    </View>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="母" id="gender-f" />
                      <Label htmlFor="gender-f">母猫</Label>
                    </View>
                  </RadioGroup>
                </View>

                <View className="mb-6">
                  <Text className="mb-3 font-bold">健康状态</Text>
                  <RadioGroup value={filterHealth} onChange={(e) => setFilterHealth(e.detail.value)}>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="all" id="health-all" />
                      <Label htmlFor="health-all">全部</Label>
                    </View>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="健康" id="health-good" />
                      <Label htmlFor="health-good">健康</Label>
                    </View>
                    <View className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="需治疗" id="health-treatment" />
                      <Label htmlFor="health-treatment">需治疗</Label>
                    </View>
                  </RadioGroup>
                </View>
              </ScrollView>
            </SheetContent>
          </Sheet>
        </View>
      </View>

      {/* Cat List - 瀑布流布局应用区域 */}
      <View className="px-2 py-4"> {/* 减小外边距，让卡片更贴近屏幕 */}
        <Text className="text-[#78716c] text-sm mb-4 mt-2 px-2">
          共找到 {filteredCats.length} 只猫咪
        </Text>

        {/* **核心修改区域**：使用 column-count 实现瀑布流 */}
        <View 
          className="w-full"
          style={{
            columnCount: 2, // 两列布局
            columnGap: '8px', // 对应原 gap-3，这里调整为更小的间隙，以实现 “紧贴” 的视觉效果
          }}
        >
          {filteredCats.map((cat) => (
            <View 
              key={cat.id} 
              onClick={() => handleCatClick(cat.id)}
              // 应用 break-inside: avoid 确保卡片内容不被分列
              style={{ breakInside: 'avoid', marginBottom: '8px' }} // 样式中明确设置卡片间的间距
              className="w-full cursor-pointer mb-2" // mb-2 保证卡片底部有微小间距
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-[#ffffff]">
                <View className="relative aspect-auto">
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    mode="widthFix"
                  />
                  <View className="absolute top-2 right-2">
                    <Badge className="bg-[#ff8c42] text-[#ffffff] text-xs px-2 py-0.5">
                      {cat.status}
                    </Badge>
                  </View>
                </View>

                <View className="p-3">
                  <View className='flex flex-col'>
                    <Text className="text-[oklch(0.145_0_0)] mb-1 font-bold">{cat.name}</Text>
                    <Text className="text-[#78716c] text-sm mb-2">
                      {cat.breed} · {cat.age}
                    </Text>
                  </View>
                  
                  <View className="flex items-center justify-between text-xs">
                    <View className="flex items-center gap-1 flex-row">
                      <FontAwesome family='solid' name='map-marker-alt' size={14} className="w-3 h-3" />
                      <Text className="text-[#78716c]">{cat.location}</Text>
                    </View>
                    <View className="flex items-center gap-1 flex-row text-[#ff8c42]">
                      <FontAwesome family="regular" name="heart" size={15} color="red" className="w-3 h-3 fill-primary"></FontAwesome>
                      <Text className="text-[#ff8c42]">{cat.likes}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}