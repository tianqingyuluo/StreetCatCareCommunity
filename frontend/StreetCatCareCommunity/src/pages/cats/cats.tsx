import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useLoad, useUnload } from '@tarojs/taro';
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
import { useFavoriteStore } from '@/stores/favoriteStore';

export default function CatListPage() {
  const { 
    loading, 
    error, 
    fetchCats, 
    fetchCatsByShelter,
    getCatsForUI, 
    navigateToCatDetail,
    filterShelterId,
    clearFilterShelterId
  } = useCatStore();
  const { fetchFavorites, isFavorited } = useFavoriteStore();
  const cats = getCatsForUI();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBreed, setFilterBreed] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterHealth, setFilterHealth] = useState('all');

  useLoad(() => {
    // 如果有救助站筛选条件，则获取该救助站的猫咪
    if (filterShelterId) {
      fetchCatsByShelter(filterShelterId);
    } else {
      fetchCats();
    }
    // 获取收藏状态
    fetchFavorites('cats');
  });

  // 页面卸载时清除筛选条件
  useUnload(() => {
    clearFilterShelterId();
  });

  const filteredCats = cats.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBreed = filterBreed === 'all' || cat.breed === filterBreed;
    const matchesGender = filterGender === 'all' || cat.gender === filterGender;
    const matchesHealth = filterHealth === 'all' || cat.health === filterHealth;

    return matchesSearch && matchesBreed && matchesGender && matchesHealth;
  });

  const handleCatClick = (catId: string) => {
    navigateToCatDetail(catId);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <ScrollView className="pb-20 bg-[#fafaf9] min-h-screen" scrollY>
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <Text className="text-[#ffffff] text-2xl mb-5">猫咪列表</Text>

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

      <View className="px-2 py-4">
        <Text className="text-[#78716c] text-sm mb-4 mt-2 px-2">
          共找到 {filteredCats.length} 只猫咪
        </Text>

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

        {!loading && !error && (
          <View 
            className="w-full"
            style={{
              columnCount: 2,
              columnGap: '8px',
            }}
          >
            {filteredCats.map((cat) => (
              <View 
                key={cat.id} 
                onClick={() => handleCatClick(cat.id)}
                style={{ breakInside: 'avoid', marginBottom: '8px' }}
                className="w-full cursor-pointer mb-2"
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
                        <FontAwesome 
                          family={isFavorited(cat.id) ? 'solid' : 'regular'} 
                          name="star" 
                          size={15} 
                          color={isFavorited(cat.id) ? '#fbbf24' : 'grey'} 
                          className="w-3 h-3 fill-primary"
                        />
                        <Text className="text-[#ff8c42]">{cat.likes}</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
