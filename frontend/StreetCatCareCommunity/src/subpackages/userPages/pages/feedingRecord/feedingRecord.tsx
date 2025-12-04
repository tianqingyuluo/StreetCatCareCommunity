import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Textarea } from '@/ui/textarea';
import { ImageWithFallback } from '@/ui/image';
import { FontAwesome } from 'taro-icons';

interface FeedingRecordPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function FeedingRecordPage({ onNavigate }: FeedingRecordPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [records, setRecords] = useState([
    {
      id: 1,
      catName: '小橘',
      catImage: 'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      foodType: '猫粮',
      amount: '200g',
      location: '朝阳区公园',
      date: '2025-10-15',
      time: '08:30',
      notes: '小橘今天胃口很好',
    },
    {
      id: 2,
      catName: '小白',
      catImage: 'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      foodType: '罐头',
      amount: '1罐',
      location: '海淀区小区',
      date: '2025-10-14',
      time: '18:00',
      notes: '',
    },
    {
      id: 3,
      catName: '虎斑',
      catImage: 'https://images.unsplash.com/photo-1680178551733-66a544d08a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJieSUyMGNhdCUyMHNpdHRpbmd8ZW58MXx8fHwxNzYwNDczNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      foodType: '猫粮',
      amount: '150g',
      location: '西城区街道',
      date: '2025-10-13',
      time: '12:00',
      notes: '下雨天，猫咪躲在屋檐下',
    },
    {
      id: 4,
      catName: '小花',
      catImage: 'https://images.unsplash.com/photo-1669085899780-e4a41f42d3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJheSUyMGNhdCUyMGN1dGV8ZW58MXx8fHwxNzYwNTI3MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      foodType: '猫粮 + 水',
      amount: '100g',
      location: '东城区',
      date: '2025-10-12',
      time: '07:30',
      notes: '',
    },
  ]);

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <View className="flex flex-row items-center justify-between mb-4">
          <View className="flex flex-row items-center gap-3">
            <Text className="text-[#ffffff] text-2xl font-medium">投喂记录</Text>
          </View>

          {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-[#ffffff] text-[#ff8c42] hover:bg-white/90 rounded-full h-10 w-10 flex items-center justify-center"
              >
                {/* Emoji 替换 Plus */}
                {/* <Text className="text-xl font-bold">➕</Text> */}
                { /*<FontAwesome family='solid' name='plus'  size={20}/>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>添加投喂记录</DialogTitle>
              </DialogHeader>
              
              <View className="space-y-4 py-4">
                <View className="space-y-2">
                  <Label htmlFor="cat-select">选择猫咪</Label> */}
                  {/* 注意：在小程序中 Select 可能需要替换为 Picker */}
                  {/* <Select>
                    <SelectTrigger id="cat-select">
                      <SelectValue placeholder="请选择猫咪" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">小橘</SelectItem>
                      <SelectItem value="2">小白</SelectItem>
                      <SelectItem value="3">虎斑</SelectItem>
                      <SelectItem value="4">小花</SelectItem>
                    </SelectContent>
                  </Select>
                </View>

                <View className="space-y-2">
                  <Label htmlFor="food-type">食物类型</Label>
                  <Select>
                    <SelectTrigger id="food-type">
                      <SelectValue placeholder="请选择食物类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat-food">猫粮</SelectItem>
                      <SelectItem value="can">罐头</SelectItem>
                      <SelectItem value="snack">零食</SelectItem>
                      <SelectItem value="water">水</SelectItem>
                    </SelectContent>
                  </Select>
                </View>

                <View className="space-y-2">
                  <Label htmlFor="amount">投喂量</Label>
                  <Input id="amount" placeholder="例如：200g" />
                </View>

                <View className="space-y-2">
                  <Label htmlFor="location">位置</Label>
                  <Input id="location" placeholder="例如：朝阳区公园" />
                </View>

                <View className="space-y-2">
                  <Label htmlFor="notes">备注</Label>
                  <Textarea id="notes" placeholder="可选：记录猫咪的状态或其他信息" />
                </View>
              </View>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 bg-[#ff8c42] hover:bg-[#ff8c42]/90"
                >
                  保存
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </View>

        <Text className="text-[#ffffff]/90 text-sm">共 {records.length} 条投喂记录</Text>
      </View>

      {/* Records List */}
      <View className="px-4 py-4 space-y-3">
        {records.map((record) => (
          <Card key={record.id} className="p-4 bg-[#ffffff]">
            <View className="flex flex-row gap-3">
              {/* Cat Image */}
              <View className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={record.catImage}
                  alt={record.catName}
                  className="w-full h-full object-cover"
                />
              </View>

              {/* Record Info */}
              <View className="flex-1">
                <View className="flex flex-row items-start justify-between mb-2">
                  <Text className="text-[#262626] font-medium">{record.catName}</Text>
                  <Text className="text-[#78716c] text-xs">
                    {record.date} {record.time}
                  </Text>
                </View>

                <View className="space-y-1.5">
                  <View className="flex flex-row items-center gap-2 text-sm">
                    {/* Emoji 替换 Package */}
                    <Text className="text-[#ff8c42]">📦</Text>
                    <Text className="text-[#78716c]">
                      {record.foodType} · {record.amount}
                    </Text>
                  </View>

                  <View className="flex flex-row items-center gap-2 text-sm">
                    {/* Emoji 替换 MapPin */}
                    <Text className="text-[#ff8c42]">📍</Text>
                    <Text className="text-[#78716c]">{record.location}</Text>
                  </View>

                  {record.notes && (
                    <Text className="block text-sm text-[#78716c] pt-1 border-t border-[rgba(0,0,0,0.08)]">
                      {record.notes}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Empty State (when no records) */}
      {records.length === 0 && (
        <View className="px-4 py-16 flex flex-col items-center text-center">
          {/* Emoji 替换 Calendar */}
          <Text className="text-6xl mb-4 opacity-40">📅</Text>
          <Text className="block text-[#78716c] mb-2">还没有投喂记录</Text>
          <Text className="block text-[#78716c] text-sm mb-6">记录你的每一次爱心投喂</Text>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#ff8c42] hover:bg-[#ff8c42]/90 flex flex-row items-center gap-2"
          >
            {/* Emoji 替换 Plus */}
            <Text>➕</Text>
            <Text>添加投喂记录</Text>
          </Button>
        </View>
      )}
    </View>
  );
}