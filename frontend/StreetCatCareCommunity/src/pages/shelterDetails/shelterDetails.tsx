import Taro, { useLoad, useUnload } from '@tarojs/taro';
import { navigateTo } from '@tarojs/taro';
import { View, Text, Map } from '@tarojs/components';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Separator } from '@/ui/separator';
import { ImageWithFallback } from '@/ui/image';
import { FontAwesome } from 'taro-icons';
import { useShelterStore } from '@/stores/shelterStore';
import { useCatStore } from '@/stores/catStore';

export default function ShelterDetailPage() {
  const { 
    getSelectedShelterForUI, 
    currentTargetId, 
    fetchShelterDetail,
    clearCurrentTargetId,
    navigateToCats,
    loading,
    error
  } = useShelterStore();

  // 在页面加载时获取救助站详情
  useLoad(() => {
    if (currentTargetId) {
      fetchShelterDetail(currentTargetId);
    }
  });

  // 在页面卸载时清除导航状态
  useUnload(() => {
    clearCurrentTargetId();
  });

  const data = getSelectedShelterForUI();

  // 加载中状态
  if (loading) {
    return (
      <View className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <Text className="text-[#78716c]">加载中...</Text>
      </View>
    );
  }

  // 错误状态
  if (error) {
    return (
      <View className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <Text className="text-[#78716c]">加载失败: {error}</Text>
      </View>
    );
  }

  // 数据不存在
  if (!data) {
    return (
      <View className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <Text className="text-[#78716c]">救助站信息加载失败</Text>
      </View>
    );
  }

  const capacityRate = (data.currentCatNumber / data.capacity) * 100;
  const isFull = capacityRate >= 90;

  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: data.phone
    });
  };

  const handleCatClick = () => {
    // navigateTo({url: "/pages/cats/cats" });
    navigateToCats(currentTargetId!)
  };

  return (
    <View className="min-h-screen bg-[#fafaf9] pb-6">
      {/* Header Image */}
      <View className="relative h-56">
        <ImageWithFallback
          src={data.image}
          className="w-full h-full object-cover"
          mode='aspectFill'
        />
        <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button
        <TaroButton
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-[#030213] rounded-full w-10 h-10 flex items-center justify-center"
          onClick={handleBack}
        >
          <Text className="text-xl">←</Text>
        </TaroButton> */}
        
        {/* Status Badge */}
        <View className="absolute top-4 right-4">
          <Badge 
            className={`text-xs px-3 py-1 ${
              isFull 
                ? 'bg-[#fef3c7] text-[#92400e] border-[#fcd34d]' 
                : 'bg-[#dcfce7] text-[#15803d] border-[#86efac]'
            }`}
            variant="outline"
          >
            {data.status}
          </Badge>
        </View>
        
        {/* Title */}
        <View className="absolute bottom-4 left-4 right-4">
          <Text className="text-white text-2xl mb-1 block">{data.name}</Text>
          <View className="flex items-center gap-2 text-white/90 text-sm">
            <FontAwesome family='solid' name='map-marker-alt' color='white'></FontAwesome>
            <Text>{data.address}</Text>
          </View>
        </View>
      </View>

      <View className="px-4 mt-4 space-y-4">
        {/* Quick Actions */}
        <View className="grid grid-cols-2 gap-3">
          <Button
            className="w-full h-16 bg-gradient-to-br from-[#ff8c42] to-[#fb923c] hover:from-[#fb923c] hover:to-[#f97316] text-white rounded-2xl shadow-sm"
            onClick={() => handleCatClick()}
          >
            <View className="flex flex-col items-center gap-1.5">
              <FontAwesome family='solid' name='paw' ></FontAwesome>
              <Text>查看所有猫咪</Text>
            </View>
          </Button>
          
          <Button
            className="w-full h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-white rounded-2xl shadow-sm"
            onClick={handleCall}
          >
            <View className="flex flex-col items-center gap-1.5">
              <FontAwesome family='solid' name='phone-alt' ></FontAwesome>
              <Text>联系救助站</Text>
            </View>
          </Button>
        </View>

        {/* Capacity Info Card */}
        <Card className="p-4 bg-[#fff5ed]/50 border-0">
          <View className="flex items-center justify-between mb-3">
            <View className="flex items-center gap-2">
              <FontAwesome family='solid' name='cat' size={17}></FontAwesome>
              <Text className="text-[#030213]">收容情况</Text>
            </View>
            <Text className="text-[#ff8c42]">
              {data.currentCatNumber}/{data.capacity}
            </Text>
          </View>
          
          <View className="h-2.5 bg-white rounded-full overflow-hidden mb-2">
            <View 
              className={`h-full transition-all ${
                isFull ? 'bg-[#fbbf24]' : 'bg-[#ff8c42]'
              }`}
              style={{ width: `${capacityRate}%` }}
            />
          </View>
          
          <Text className="text-[#78716c] text-sm">
            {isFull ? '收容空间紧张，请考虑领养' : `还可收容 ${data.capacity - data.currentCatNumber} 只猫咪`}
          </Text>
        </Card>

        {/* Description */}
        <Card className="p-4">
          <Text className="text-[#030213] mb-3 flex items-center gap-2 block">
            <FontAwesome family='solid' name='building' size={17}></FontAwesome>
            <Text className='ml-2'>救助站简介</Text>
          </Text>
          <Text className="text-[#78716c] leading-relaxed">
            {data.description}
          </Text>
        </Card>

        {/* Contact Information */}
        <Card className="p-4">
          <Text className="text-[#030213] mb-4 flex items-center gap-2 block">
            <FontAwesome family='solid' name='phone-alt' size={17}></FontAwesome>
            <Text className='ml-2'>联系方式</Text>
          </Text>
          
          <View className="space-y-4">
            <View className="flex items-start gap-3">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center flex-shrink-0">
                <FontAwesome family='solid' name='user' color='orange'></FontAwesome>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-[#78716c] mb-0.5 block">联系人</Text>
                <Text className="text-[#030213]">{data.contactPerson}</Text>
              </View>
            </View>
            
            <Separator />
            
            <View className="flex items-start gap-3">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center flex-shrink-0">
                <FontAwesome family='solid' name='phone-alt' color='orange'></FontAwesome>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-[#78716c] mb-0.5 block">电话</Text>
                <Text 
                  onClick={handleCall}
                  className="text-[#ff8c42] hover:underline"
                >
                  {data.phone}
                </Text>
              </View>
            </View>
            
            <Separator />
            
            <View className="flex items-start gap-3">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center flex-shrink-0">
                <FontAwesome family='solid' name='envelope' color='orange'></FontAwesome>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-[#78716c] mb-0.5 block">邮箱</Text>
                <Text 
                  onClick={() => Taro.navigateTo({
                    url: `mailto:${data.email}`
                  })}
                  className="text-[#ff8c42] hover:underline break-all"
                >
                  {data.email}
                </Text>
              </View>
            </View>
            
            <Separator />
            
            <View className="flex items-start gap-3">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center flex-shrink-0">
                <FontAwesome family='solid' name='map-marker-alt' color='orange'></FontAwesome>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-[#78716c] mb-0.5 block">地址</Text>
                <Text className="text-[#030213]">{data.address}</Text>
                <Text className="text-sm text-[#78716c] mt-1 block">距离您 {data.distance}km</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* License Information */}
        <Card className="p-4">
          <Text className="text-[#030213] mb-4 flex items-center gap-2 block">
            <FontAwesome family='solid' name='file-alt' size={17}></FontAwesome>
            <Text className='ml-2'>资质信息</Text>
          </Text>
          
          <View className="space-y-3">
            <View className="flex items-center justify-between">
              <Text className="text-[#78716c] text-sm">许可证号</Text>
              <Text className="text-[#030213]">{data.licenseNumber}</Text>
            </View>
            
            <Separator />
            
            <View className="flex items-center justify-between">
              <Text className="text-[#78716c] text-sm">成立时间</Text>
              <Text className="text-[#030213]">
                {new Date(data.createdAt).toLocaleDateString('zh-CN')}
              </Text>
            </View>
            
            <Separator />
            
            <View className="flex items-center justify-between">
              <Text className="text-[#78716c] text-sm">最后更新</Text>
              <Text className="text-[#030213]">
                {new Date(data.updatedAt).toLocaleDateString('zh-CN')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Map Placeholder */}
        <Card className="p-4">
          <Text className="text-[#030213] mb-3 flex items-center gap-2 block">
            <FontAwesome family='solid' name='map' size={17}></FontAwesome>
            <Text className='ml-2'>位置地图</Text>
          </Text>
          <View className="h-48 bg-[#fff5ed] rounded-xl flex items-center justify-center">
            <View className="text-center">
              <FontAwesome family='solid' name='map-marker-alt' size={50}></FontAwesome>
              <Text className="text-[#78716c] text-sm block">
                经度: {data.location.lng}
              </Text>
              <Text className="text-[#78716c] text-sm block">
                纬度: {data.location.lat}
              </Text>
            </View>
          </View>
        </Card>
        {/* 测试： 微信地图 */}
        <Card className='p-4'>
          <Map
            className='w-full h-48'
            longitude={data.location.lng}
            latitude={data.location.lat}
            scale={15}
            onError={() => {console.log('error')}}
            markers={[
              {
                id: 1,
                longitude: data.location.lng,
                latitude: data.location.lat,
                title: data.name,
                iconPath: '../../assets/icons/map-pin.png',
              }
            ]}
          />
        </Card>
      </View>
    </View>
  );
}