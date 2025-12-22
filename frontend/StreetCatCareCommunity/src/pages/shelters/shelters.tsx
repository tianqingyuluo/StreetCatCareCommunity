import { useState } from 'react';
import { useLoad } from '@tarojs/taro';
import { View, Text, Input, Image, } from '@tarojs/components';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { ImageWithFallback } from '@/ui/image';
import { FontAwesome } from 'taro-icons';
import { useShelterStore } from '@/stores/shelterStore';

export default function ShelterListPage() {
  const { loading, error, fetchShelters, getSheltersForUI, navigateToShelterDetail } = useShelterStore();
  const shelters = getSheltersForUI();
  const [searchQuery, setSearchQuery] = useState('');

  useLoad(() => {
    fetchShelters();
  });

  const filteredShelters = shelters.filter(shelter => 
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShelterClick = (shelterId: string) => {
    navigateToShelterDetail(shelterId);
  }

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Header with gradient - 微信小程序建议使用线性渐变背景图或自定义组件实现渐变 */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <Text className="text-[#ffffff] text-2xl">救助站列表</Text>
        
        {/* Search Bar */}
        <View className="relative">
          <Input
            placeholder="搜索救助站名称或地址..."
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.detail.value)}
            className="pl-4 mt-4 bg-[#ffffff] border-0 rounded-xl h-11"
          />
        </View>
      </View>

      {/* Shelter List */}
      <View className="px-4 py-4">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-[#78716c] text-sm">共找到 {filteredShelters.length} 个救助站</Text>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#ff8c42] hover:bg-[#fff5ed]"
            onClick={() => {
              // 距离排序逻辑
              const sortedShelters = [...filteredShelters].sort((a, b) => a.distance - b.distance);
              // 这里可以更新显示排序后的结果
              console.log('按距离排序', sortedShelters);
            }}
          >
            <FontAwesome family='solid' name='map' color='orange' size={16} />
            <Text className='ml-1'>距离最近</Text>
          </Button>
        </View>
        
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
          <View className="space-y-3">
            {filteredShelters.map((shelter) => {
            const capacityRate = (shelter.currentCatNumber / shelter.capacity) * 100;
            const isFull = capacityRate >= 90;
            
            return (
              <Card
                key={shelter.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-[#ffffff]"
                onClick={() => handleShelterClick(shelter.id)}
              >
                <View className="flex gap-3 p-4">
                  <View className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={shelter.image}
                      alt={shelter.name}
                      className="w-full h-full object-cover"
                      mode='aspectFill'
                    />
                  </View>
                  
                  <View className="flex-1 flex flex-col justify-between">
                    <View>
                      <View className="flex items-start justify-between mb-1">
                        <Text className="text-[oklch(0.145_0_0)] flex-1 pr-2">{shelter.name}</Text>
                        <Badge 
                          className={`text-xs px-2 py-0.5 flex-shrink-0 ${
                            isFull 
                              ? 'bg-[#fef3c7] text-[#92400e] border-[#fcd34d]' 
                              : 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
                          }`}
                          variant="outline"
                        >
                          {shelter.status}
                        </Badge>
                      </View>
                      
                      <View className="flex items-center gap-1 text-[#78716c] text-sm mb-2">
                        <FontAwesome family='solid' name='map-marker-alt' size={16} />
                        <Text className="line-clamp-1">{shelter.address}</Text>
                      </View>
                    </View>
                    
                    <View className="flex items-center justify-between">
                      <View className="flex items-center gap-3 text-xs">
                        <View className="flex items-center gap-1 text-[#78716c]">
                          <FontAwesome family='solid' name='location-arrow' size={16} />
                          <Text>{shelter.distance}km</Text>
                        </View>
                        <View className="flex items-center gap-1 text-[#ff8c42]">
                          <FontAwesome family='solid' name='paw' size={16} color='orange' />
                          <Text>{shelter.currentCatNumber}/{shelter.capacity}</Text>
                        </View>
                      </View>
                      <FontAwesome family='solid' name='greater-than' size={11}/>
                    </View>
                  </View>
                </View>
                
                {/* Capacity Bar */}
                <View className="px-4 pb-4">
                  <View className="h-1.5 bg-[#fff5ed] rounded-full overflow-hidden">
                    <View 
                      className={`h-full transition-all ${
                        isFull ? 'bg-[#fbbf24]' : 'bg-[#ff8c42]'
                      }`}
                      style={{ width: `${capacityRate}%` }}
                    />
                  </View>
                </View>
              </Card>
            );
          })}
          </View>
        )}
      </View>
    </View>
  );
}