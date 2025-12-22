import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { Card } from '@/ui/card';
import { ImageWithFallback } from '@/ui/image';
import { useFeedingStore } from '@/stores/feedingStore';

export default function FeedingRecordPage() {
  
  // 从 FeedingStore 获取投喂记录数据
  const { getFeedingsForUI, fetchFeedings, loading, error } = useFeedingStore();
  const records = getFeedingsForUI();
  
  // 页面加载时获取所有投喂记录
  useLoad(() => {
    fetchFeedings();
  });
  
  // 显示加载状态
  if (loading) {
    return (
      <View className="pb-20 bg-[#fafaf9] min-h-screen flex items-center justify-center">
        <Text className="text-[#78716c]">加载中...</Text>
      </View>
    );
  }
  
  // 显示错误状态
  if (error) {
    return (
      <View className="pb-20 bg-[#fafaf9] min-h-screen flex items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <View className="flex flex-row items-center justify-between mb-4">
          <View className="flex flex-row items-center gap-3">
            <Text className="text-[#ffffff] text-2xl font-medium">
              投喂记录
            </Text>
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
          <Text className="block text-[#78716c] text-sm">记录你的每一次爱心投喂</Text>
        </View>
      )}
    </View>
  );
}