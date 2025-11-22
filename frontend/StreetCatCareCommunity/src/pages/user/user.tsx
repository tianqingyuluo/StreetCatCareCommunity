import React from 'react';
import { View, Text, Image } from '@tarojs/components';
// 保持你的自定义组件导入不变
import { Card } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Badge } from '@/ui/badge';
import { FontAwesome } from 'taro-icons'

interface ProfilePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const user = {
    name: '爱心志愿者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    level: 'LV5',
    contributions: 128,
  };

  // 图标替换为 Emoji
  const stats = [
    { label: '收藏', value: 12, icon: 'heart', color: 'red' },
    { label: '投喂', value: 45, icon: 'calendar', color: 'orange' },
    { label: '申请', value: 3, icon: 'file-alt', color: 'blue' },
    { label: '积分', value: 880, icon: 'award', color: 'gold' },
  ];

  const menuItems = [
    {
      title: '我的收藏',
      icon: '❤️',
      badge: '12',
      onClick: () => onNavigate('favorites'),
    },
    {
      title: '领养申请记录',
      icon: '📄',
      badge: '3',
      onClick: () => onNavigate('adoption'),
    },
    {
      title: '投喂记录',
      icon: '📅',
      badge: '45',
      onClick: () => onNavigate('feeding'),
    },
    {
      title: '我的帖子',
      icon: '👥',
      badge: '8',
      onClick: () => onNavigate('myPosts'),
    },
  ];

  const achievements = [
    { title: '爱心新人', icon: '🌟', earned: true },
    { title: '投喂达人', icon: '🍖', earned: true },
    { title: '领养天使', icon: '😇', earned: true },
    { title: '社区活跃', icon: '🎉', earned: false },
  ];

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      <View className="bg-gradient-to-br from-[#ff8c42] to-amber-500 px-4 pt-8 pb-20 rounded-3xl">
        <View className="flex items-center justify-between mb-6">
          <Text className="text-white text-2xl">我的</Text>
          <View className="text-white">
            <FontAwesome family='solid' name="cog" size={20} color='white' />
          </View>
        </View>

        {/* 用户profile */}
        <View className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-white/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          
          <View className="flex-1">
            <View className="flex items-center gap-2 mb-1">
              <Text className="text-white text-xl">{user.name}</Text>
              <Badge className="bg-white/20 text-white border-0 text-xs">
                {user.level}
              </Badge>
            </View>
            <Text className="text-white/90 text-sm">已贡献 {user.contributions} 次爱心行动</Text>
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
                <Text className="text-3xl mb-1">{achievement.icon}</Text>
                <Text className="text-xs text-[#252525]">{achievement.title}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* 菜单 */}
      <View className="px-4 mb-6">
        <Text className="text-[#252525] mb-3 block">我的服务</Text>
        <Card className="divide-y divide-[rgba(0,0,0,0.08)] bg-[#ffffff]">
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
                    <Text className="text-lg">{item.icon}</Text>
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
                  <Text className="text-[#78716c]">➡️</Text>
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
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#fff5ed]/50 transition-colors rounded-lg"
          >
            <View className="flex items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#fff5ed] flex items-center justify-center">
                {/* Settings Icon -> Emoji */}
                <Text className="text-lg">⚙️</Text>
              </View>
              <Text className="text-[#252525]">设置</Text>
            </View>
            <Text className="text-[#78716c]">➡️</Text>
          </View>
        </Card>
      </View>
    </View>
  );
}