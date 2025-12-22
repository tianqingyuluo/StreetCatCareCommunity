import { View, Text } from '@tarojs/components';
import { useLoad, useDidShow } from '@tarojs/taro';
// 保持你的自定义组件导入不变
import { Card } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Badge } from '@/ui/badge';
import { FontAwesome } from 'taro-icons'
import IconFont from '@/icons';
import { useUserStore } from '@/stores/userStore';

export default function ProfilePage() {
  // 使用 UserStore 获取用户数据和导航方法
  const { 
    currentUser,
    userStats,
    fetchCurrentUser,
    navigateToFavorites, 
    navigateToAdoptions, 
    navigateToFeedings, 
    navigateToMyPosts 
  } = useUserStore();
  
  // 用户基本信息（来自登录时的微信授权）
  // 注意：登录返回的user对象中nickname直接在user上，不在userInfo中
  const userName = (currentUser as any)?.nickname || currentUser?.userInfo?.nickname || '未登录';
  const userAvatar = (currentUser as any)?.avatarUrl || currentUser?.userInfo?.avatarUrl || '';
  const userLevel = 'LV1'; // TODO: 后端暂无等级字段
  
  // 统计数据（来自各API）
  const { favorites, feedings, adoptions, posts } = userStats;
  const contributions = favorites + feedings + adoptions + posts;
  
  // 页面加载时获取统计数据
  useLoad(() => {
    fetchCurrentUser();
  });

  // 页面显示时刷新数据（tab切换时触发）
  useDidShow(() => {
    fetchCurrentUser();
  });

  // 统计卡片数据
  const stats = [
    { label: '收藏', value: favorites, icon: 'heart', color: 'red' },
    { label: '投喂', value: feedings, icon: 'calendar', color: 'orange' },
    { label: '申请', value: adoptions, icon: 'file-alt', color: 'blue' },
    { label: '积分', value: contributions, icon: 'award', color: 'gold' },
  ];

  const menuItems = [
    {
      title: '我的收藏',
      icon: 'heart',
      badge: String(favorites),
      onClick: () => navigateToFavorites(),
    },
    {
      title: '领养申请记录',
      icon: 'file',
      badge: String(adoptions),
      onClick: () => navigateToAdoptions(),
    },
    {
      title: '投喂记录',
      icon: 'calendar',
      badge: String(feedings),
      onClick: () => navigateToFeedings(),
    },
    {
      title: '我的帖子',
      icon: 'rss',
      badge: String(posts),
      onClick: () => navigateToMyPosts(),
    },
  ];

  const achievements = [
    { title: '爱心新人', icon: '🌟', earned: true },
    { title: '投喂达人', icon: '🍖', earned: feedings >= 10 },
    { title: '领养天使', icon: '😇', earned: adoptions >= 1 },
    { title: '社区活跃', icon: '🎉', earned: contributions >= 50 },
  ];

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-20 rounded-3xl">
        <View className="flex items-center justify-between mb-6">
          <Text className="text-white text-2xl">我的</Text>
          <View className="text-white">
            <FontAwesome family='solid' name="cog" size={20} color='white' />
          </View>
        </View>

        {/* 用户profile */}
        <View className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-white/20">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{userName[0] || '用'}</AvatarFallback>
          </Avatar>
          
          <View className="flex-1">
            <View className="flex items-center gap-2 mb-1">
              <Text className="text-white text-xl">{userName}</Text>
              <Badge className="bg-white/20 text-white border-0 text-xs">
                {userLevel}
              </Badge>
            </View>
            <Text className="text-white/90 text-sm">已贡献 {contributions} 次爱心行动</Text>
          </View>
        </View>
      </View>

      {/* 状态卡片 */}
      <View className="px-4 -mt-12 mb-6">
        <Card className="p-4 bg-[#ffffff] shadow-lg">
          <View className="grid grid-cols-4 gap-4">
            {stats.map((stat) => {
              return (
                <View key={stat.label} className="text-center flex flex-col items-center">
                  <FontAwesome family='solid' name={stat.icon} size={30} color={stat.color}></FontAwesome>
                  {/* text-foreground -> text-[#252525] */}
                  <Text className="text-[#252525] text-xl mb-1">{stat.value}</Text>
                  {/* text-muted-foreground -> text-[#78716c] */}
                  <Text className="text-[#78716c] text-xs">{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </Card>
      </View>

      {/* 成就卡片 */}
      <View className="px-4 mb-6">
        <Text className="text-[#252525] mb-3 block">我的成就</Text>
        <Card className="p-4 bg-[#ffffff]">
          <View className="grid grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <View
                key={index}
                className={`text-center flex flex-col items-center ${!achievement.earned ? 'opacity-40' : ''}`}
              >
                <Text className="text-3xl">{achievement.icon}</Text>
                <Text className="text-xs text-[#252525]">{achievement.title}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* 菜单 */}
      <View className="px-4 mb-6">
        <Text className="text-[#252525] mb-3 block">我的服务</Text>
        <Card className="divide-y divide-[rgba(0,0,0,0.08)] bg-[#ffffff] gap-1">
          {menuItems.map((item, index) => {
            return (
              <View
                key={index}
                onClick={item.onClick}
                // hover:bg-secondary/50 -> hover:bg-[#fff5ed]/50
                className="w-full flex items-center justify-between p-4 hover:bg-[#fff5ed]/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <View className="flex items-center gap-3">
                  {/* bg-secondary -> bg-[#fff5ed] */}
                  <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center">
                    {/* text-primary -> text-[#ff8c42] */}
                    {/* <Text className="text-lg">{item.icon}</Text> */}
                    <IconFont name={item.icon} size={40} color="#ff8c42" />
                  </View>
                  <Text className="text-[#252525]">{item.title}</Text>
                </View>
                
                <View className="flex items-center gap-2">
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {/* ChevronRight -> Emoji */}
                  <IconFont name="chevron-right" size={30} color="#ff8c42" />
                </View>
              </View>
            );
          })}
        </Card>
      </View>

      {/* Settings */}
      <View className="px-4">
        <Card className="bg-[#ffffff]">
          <View 
            className="w-full flex items-center justify-between p-4 hover:bg-[#fff5ed]/50 transition-colors rounded-lg"
          >
            <View className="flex items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center">
                {/* Settings Icon -> Emoji */}
                <FontAwesome family='solid' name="cog" size={20} color='black' />
              </View>
              <Text className="text-[#252525]">设置</Text>
            </View>
            <IconFont name="chevron-right" size={30} color="#ff8c42" />
          </View>
        </Card>
      </View>
    </View>
  );
}