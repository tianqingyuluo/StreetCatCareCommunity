import { View, Text } from '@tarojs/components'
import { redirectTo } from '@tarojs/taro'
import { Button } from '@/ui/button'
import { FontAwesome } from 'taro-icons'
import { useNavigationStore } from '@/stores/navigationStore'
import { useLoad, getCurrentInstance } from '@tarojs/taro'
import { tabRoutes } from '@/utils/navRouteMap'
import { Card, ImageWithFallback, Badge } from '@/ui'

import './index.scss'


export default function Index () {

  const { activeTab, showBottomNav, changeTab, setShowBottomNav } = useNavigationStore()

  // 页面监听路由变化
  useLoad(() => {
    console.log('Page loaded.')
    const instance = getCurrentInstance()
    if (instance?.router) {
      const currentRoute = instance.router.path
      const shouldShowNav = Object.values(tabRoutes).includes(currentRoute)
      setShowBottomNav(shouldShowNav)
      console.log('Current route:', currentRoute, 'Show bottom nav:', shouldShowNav)
    }
  })

  // 假数据
  const featuredCats = [
    {
      id: 1,
      name: '小橘',
      image: 'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      breed: '中华田园猫',
      age: '2岁',
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
      status: '待领养',
      location: '西城区',
      likes: 412,
    },
  ];

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
              // variant="ghost"
              // size="icon"
              className="text-white border-0 bg-transparent hover:bg-white/40 active:bg-white/70 focus:ring-0 focus:ring-offset-0 mt-4 w-6 h-6"
              // onClick={() => onNavigate('cats')}
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

        <View className='space-y-3'>
          {
            featuredCats.map((cat) => (
              <Card
                key={cat.id}
                className='overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-[#ffffff]'
                onClick={() => redirectTo({url: "/pages/catDetial"})}>
                  <View className='flex gap-3 p-3'>
                    <View className='relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0'>
                      <ImageWithFallback src={cat.image} className='w-full h-full object-cover'/>
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
                          <FontAwesome family='solid' name='map-marker-alt' className="w-3 h-3" />
                          <View>{cat.location}</View>
                        </View>
                        <View className="flex items-center gap-1 text-primary text-xs">
                          <FontAwesome family='regular' name='heart' className="w-3 h-3 fill-primary" />
                          <View>{cat.likes}</View>
                        </View>
                      </View>
                    </View>
                  </View>
              </Card>
            ))

          }
          {/* <Card 
            key="修猫" 
            className='overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-[#ffffff]'
            onClick={() => redirectTo({url: "/pages/catDetial"})}
          >
            <View className='flex gap-3 p-3'>
              <View className='relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0'>
                <ImageWithFallback src='https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080' className='w-full h-full object-cover'/>
              </View>
            </View>
          </Card> */}
        </View>
      </View>
      {/* 快捷按钮 */}
      <View className='px-4 mb-6'>
        <View className='grid grid-cols-2 gap-3'>
          <Button
            className='w-full h-20 bg-gradient-to-br from-orange-300 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-2xl shadow-sm'
            onClick={() => redirectTo({url: "/pages/cats"})}
          >
            <View className='flex flex-col items-center gap-2'>
              <FontAwesome family='solid' name='cat' color='black' className='w-6 h-6'></FontAwesome>
              <Text>投喂记录</Text>
            </View>
          </Button>

          <Button
            className='w-full h-20 bg-gradient-to-br from-orange-300 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-2xl shadow-sm'
            onClick={() => redirectTo({url: "/pages/cats"})}
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
