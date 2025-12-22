import { View, Text } from '@tarojs/components'
import { redirectTo, navigateTo } from '@tarojs/taro'
import { Button } from '@/ui/button'
import { FontAwesome } from 'taro-icons'
import { useCatStore } from '@/stores/catStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useLoad } from '@tarojs/taro'
import { Card, ImageWithFallback, Badge } from '@/ui'

import './index.scss'


export default function Index () {
  const { loading, error, fetchCats, getCatsForUI, navigateToCatDetail } = useCatStore();
  const { fetchFavorites, isFavorited } = useFavoriteStore();
  const featuredCats = getCatsForUI().slice(0, 3); // 只显示前3只猫

  const handleCatClick = (catId: string) => {
    console.log('Clicked cat:', catId)
    // 跳转到详情页
    navigateToCatDetail(catId);
  }

  // 页面监听路由变化
  useLoad(() => {
    console.log('Page loaded.')
    fetchCats();
    fetchFavorites('cats'); // 获取收藏状态
  })

  return (
    <View className='pb-20 bg-[#fafaf9] min-h-screen'>
      {/* 头卡片 */}
      <View className='bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-24 rounded-3xl'>
        <View className="flex items-center justify-between mb-6">
          <View className="flex flex-col items-start justify-between">
            <Text className="text-white text-2xl mb-1">流浪猫关爱社区</Text>
            <Text className="text-white/90 text-sm">给每一只流浪猫一个温暖的家</Text>
          </View>
          <Button
              className="text-white border-0 bg-transparent hover:bg-white/40 active:bg-white/70 focus:ring-0 focus:ring-offset-0 mt-4 w-6 h-6"
            >
              <FontAwesome family='solid' name='search' color='white' size={17}></FontAwesome>
            </Button>
        </View>
      </View>
      {/* 展示附近的明星猫咪的列表，稍微overlap一些头卡片 */}
      <View className='-mt-16 px-4 mb-6'>
        <View className='flex items-center justify-between mb-3'>
          <View className='flex items-center gap-2'>
            <FontAwesome family='solid' name='chart-line' size={20}></FontAwesome>
            <Text className=' text-black font-sans'>明星小猫</Text>
          </View>
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
          <View className='space-y-3'>
            {
              featuredCats.map((cat) => (
                <Card
                  key={cat.id}
                  className='overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-[#ffffff]'
                  onClick={() => handleCatClick(cat.id)}>
                    <View className='flex gap-3 p-3'>
                      <View className='relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0'>
                        <ImageWithFallback src={cat.image} className='w-full h-full' mode="aspectFill" />
                        <View className='absolute top-2 right-2'>
                          <Badge className='bg-[#ff8c42] text-[#ffffff] text-xs px-2 py-0.5'>
                            {cat.status}
                          </Badge>
                        </View>
                      </View>
                      <View className="flex-1 flex flex-col justify-between py-1">
                        <View className='flex flex-col'>
                          <Text className="text-[oklch(0.145 0 0)] mb-1">{cat.name}</Text>
                          <Text className="text-[#78716c] text-sm mb-1.5">
                            {cat.breed} · {cat.age}
                          </Text>
                        </View>
                        
                        <View className="flex items-center justify-between">
                          <View className="flex items-center gap-1 text-[#78716c] text-xs">
                            <FontAwesome family='solid' name='map-marker-alt' size={14} className="w-3 h-3" />
                            <View>{cat.location}</View>
                          </View>
                          <View className="flex items-center gap-1 text-primary text-xs">
                            <FontAwesome 
                              family={isFavorited(cat.id) ? 'solid' : 'regular'} 
                              name='star' 
                              size={15} 
                              color={isFavorited(cat.id) ? '#fbbf24' : 'grey'} 
                              className="w-3 h-3 fill-primary" 
                            />
                            <View>{cat.likes}</View>
                          </View>
                        </View>
                      </View>
                    </View>
                </Card>
              ))

            }
          </View>
        )}
      </View>
      {/* 快捷按钮 */}
      <View className='px-4 mb-6'>
        <View className='grid grid-cols-2 gap-3'>
          <Button
            className='w-full h-20 bg-gradient-to-br from-orange-300 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-2xl shadow-sm'
            onClick={() => redirectTo({url: "/subpackages/catPages/pages/cats/cats"})}
          >
            <View className='flex flex-col items-center gap-2'>
              <FontAwesome family='solid' name='cat' color='black' className='w-6 h-6'></FontAwesome>
              <Text>投喂记录</Text>
            </View>
          </Button>

          <Button
            className='w-full h-20 bg-gradient-to-br from-orange-300 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-2xl shadow-sm'
            onClick={() => redirectTo({url: "/subpackages/catPages/pages/cats/cats"})}
          >
            <View className='flex flex-col items-center gap-2'>
              <FontAwesome family='solid' name='hand-holding-heart' color='black' className='w-6 h-6'></FontAwesome>
              <Text>领养申请</Text>
            </View>
          </Button>

        </View>
      </View>
    </View>
        
  )
}
