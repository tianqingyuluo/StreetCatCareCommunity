import { useState } from 'react';
import { navigateTo } from '@tarojs/taro';
import { View, Text, Input, Image, } from '@tarojs/components';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { ImageWithFallback } from '@/ui/image';
import { FontAwesome } from 'taro-icons';

interface ShelterListPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function ShelterListPage({ onNavigate }: ShelterListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const shelters = [
    {
      id: '1',
      name: '朝阳区流浪猫救助中心',
      contactPerson: '张女士',
      phone: '010-12345678',
      email: 'chaoyang@shelter.com',
      location: {
        lat: 39.9219,
        lng: 116.4434
      },
      address: '北京市朝阳区建国路88号',
      description: '专业的流浪猫救助机构，提供医疗救治、绝育手术和领养服务。我们致力于改善流浪猫生存环境，让每一只猫咪都能找到温暖的家。',
      licenseNumber: 'BJ-CY-2023-001',
      managerId: 'mgr001',
      capacity: 50,
      currentCatNumber: 32,
      createdAt: '2023-01-15T08:00:00.000Z',
      updatedAt: '2025-11-15T10:30:00.000Z',
      distance: 1.2,
      status: '营业中',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBzaGVsdGVyJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYwNTI3NDEyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      name: '海淀区宠物救助站',
      contactPerson: '李先生',
      phone: '010-87654321',
      email: 'haidian@shelter.com',
      location: {
        lat: 39.9590,
        lng: 116.2987
      },
      address: '北京市海淀区中关村大街123号',
      description: '海淀区最大的综合性动物救助站，拥有现代化的医疗设施和专业的护理团队。',
      licenseNumber: 'BJ-HD-2023-002',
      managerId: 'mgr002',
      capacity: 80,
      currentCatNumber: 58,
      createdAt: '2023-03-20T09:00:00.000Z',
      updatedAt: '2025-11-15T11:00:00.000Z',
      distance: 3.5,
      status: '营业中',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBzaGVsdGVyJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYwNTI3NDEyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '3',
      name: '东城区爱心动物之家',
      contactPerson: '王女士',
      phone: '010-23456789',
      email: 'dongcheng@shelter.com',
      location: {
        lat: 39.9289,
        lng: 116.4163
      },
      address: '北京市东城区王府井大街56号',
      description: '温馨的小型救助站，注重每只猫咪的个性化照顾，提供家庭式寄养环境。',
      licenseNumber: 'BJ-DC-2023-003',
      managerId: 'mgr003',
      capacity: 30,
      currentCatNumber: 18,
      createdAt: '2023-05-10T10:00:00.000Z',
      updatedAt: '2025-11-15T09:45:00.000Z',
      distance: 2.1,
      status: '营业中',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBzaGVsdGVyJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYwNTI3NDEyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '4',
      name: '西城区流浪动物保护中心',
      contactPerson: '赵先生',
      phone: '010-34567890',
      email: 'xicheng@shelter.com',
      location: {
        lat: 39.9144,
        lng: 116.3664
      },
      address: '北京市西城区西单北大街78号',
      description: '政府支持的公益性救助机构，免费提供绝育和基础医疗服务。',
      licenseNumber: 'BJ-XC-2023-004',
      managerId: 'mgr004',
      capacity: 60,
      currentCatNumber: 45,
      createdAt: '2023-02-28T08:30:00.000Z',
      updatedAt: '2025-11-15T12:00:00.000Z',
      distance: 4.8,
      status: '营业中',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBzaGVsdGVyJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYwNTI3NDEyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '5',
      name: '丰台区猫咪之家救助站',
      contactPerson: '刘女士',
      phone: '010-45678901',
      email: 'fengtai@shelter.com',
      location: {
        lat: 39.8586,
        lng: 116.2865
      },
      address: '北京市丰台区丽泽路99号',
      description: '专注于流浪猫救助的爱心机构，志愿者团队活跃，经常组织领养活动。',
      licenseNumber: 'BJ-FT-2023-005',
      managerId: 'mgr005',
      capacity: 40,
      currentCatNumber: 25,
      createdAt: '2023-06-15T09:30:00.000Z',
      updatedAt: '2025-11-15T10:15:00.000Z',
      distance: 6.2,
      status: '营业中',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBzaGVsdGVyJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYwNTI3NDEyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const filteredShelters = shelters.filter(shelter => 
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShelterClick = () => {
    navigateTo({url: '/pages/shelterDetails/shelterDetails'});
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
        
        <View className="space-y-3">
          {filteredShelters.map((shelter) => {
            const capacityRate = (shelter.currentCatNumber / shelter.capacity) * 100;
            const isFull = capacityRate >= 90;
            
            return (
              <Card
                key={shelter.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-[#ffffff]"
                onClick={() => handleShelterClick()}
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
      </View>
    </View>
  );
}