import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Checkbox } from '@/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Badge } from '@/ui/badge';
import { ImageWithFallback } from '@/ui/image';

interface AdoptionApplicationPageProps {
  data?: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function AdoptionApplicationPage({ data, onNavigate }: AdoptionApplicationPageProps) {
  const [currentView, setCurrentView] = useState(data ? 'form' : 'list');
  
  const selectedCat = data || null;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    address: '',
    experience: '',
    reason: '',
  });

  const applications = [
    {
      id: 1,
      catName: '小橘',
      catImage: 'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'PENDING',
      date: '2025-11-25',
      applicationContent: {
        name: '张三',
        age: 28,
        phone: '13800138000',
        address: '北京市朝阳区XX路XX号',
        experience: '有2年养猫经验',
        reason: '我有稳定的工作和住所，能够给小橘提供良好的生活环境...',
      },
      reviewNotes: null,
    },
    {
      id: 2,
      catName: '小白',
      catImage: 'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'APPROVED',
      date: '2025-11-20',
      applicationContent: {
        name: '李四',
        age: 32,
        phone: '13900139000',
        address: '上海市浦东新区XX路XX号',
        experience: '有5年养猫经验',
        reason: '家里有养猫经验，希望能给小白一个温暖的家...',
      },
      reviewNotes: '申请通过，申请人条件优秀',
      contractUrl: 'https://example.com/contract.pdf',
    },
    {
      id: 3,
      catName: '虎斑',
      catImage: 'https://images.unsplash.com/photo-1680178551733-66a544d08a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJieSUyMGNhdCUyMHNpdHRpbmd8ZW58MXx8fHwxNzYwNDczNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'UNDER_REVIEW',
      date: '2025-11-22',
      applicationContent: {
        name: '王五',
        age: 25,
        phone: '13700137000',
        address: '广州市天河区XX路XX号',
        experience: '无养猫经验，但做了充分准备',
        reason: '喜欢虎斑，愿意学习如何照顾它...',
      },
      reviewNotes: null,
    },
    {
      id: 4,
      catName: '小花',
      catImage: 'https://images.unsplash.com/photo-1609854892516-6078bb3b5442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBhZG9yYWJsZXxlbnwxfHx8fDE3NjA1MjczNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'INTERVIEW',
      date: '2025-11-18',
      applicationContent: {
        name: '赵六',
        age: 30,
        phone: '13600136000',
        address: '深圳市南山区XX路XX号',
        experience: '有养宠物经验',
        reason: '想给小花一个家...',
      },
      reviewNotes: '初审通过，等待面试',
    },
    {
      id: 5,
      catName: '小黑',
      catImage: 'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'REJECTED',
      date: '2025-11-15',
      applicationContent: {
        name: '孙七',
        age: 22,
        phone: '13500135000',
        address: '杭州市西湖区XX路XX号',
        experience: '无',
        reason: '想养猫',
      },
      reviewNotes: '经验不足，居住环境不适合养猫',
    },
  ];

  const getStatusInfo = (status: string) => {
    // 使用 Emoji 替换图标
    const statusMap: Record<string, { label: string; icon: string; className: string }> = {
      'PENDING': { label: '待审核', icon: '🕒', className: 'bg-gray-100 text-gray-700' },
      'UNDER_REVIEW': { label: '审核中', icon: '📄', className: 'bg-blue-100 text-blue-700' },
      'INTERVIEW': { label: '待面试', icon: '👥', className: 'bg-purple-100 text-purple-700' },
      'HOME_VISIT': { label: '待家访', icon: '🏠', className: 'bg-indigo-100 text-indigo-700' },
      'APPROVED': { label: '已通过', icon: '✅', className: 'bg-green-100 text-green-700' },
      'REJECTED': { label: '未通过', icon: '❌', className: 'bg-red-100 text-red-700' },
    };
    return statusMap[status] || statusMap['PENDING'];
  };

  const handleCopyContract = (url: string) => {
    Taro.setClipboardData({
      data: url,
      success: () => {
        Taro.showToast({
          title: '链接已复制',
          icon: 'success',
        });
      },
    });
  };

  if (currentView === 'form') {
    return (
      <View className="pb-20 bg-[#fafaf9] min-h-screen">
        {/* Header */}
        <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
          <View className="flex flex-row items-center gap-3 mb-4">
            <Text className="text-[#ffffff] text-2xl font-medium">领养申请</Text>
          </View>
        </View>

        {/* Selected Cat Info */}
        {selectedCat && (
          <View className="px-4 -mt-3 mb-6">
            <Card className="p-3 bg-[#ffffff] flex flex-row items-center gap-3">
              <View className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={selectedCat.image}
                  alt={selectedCat.name}
                  className="w-full h-full object-cover"
                />
              </View>
              <View>
                <Text className="block text-[#262626] mb-1 font-medium">{selectedCat.name}</Text>
                <Text className="block text-[#78716c] text-sm">
                  {selectedCat.breed} · {selectedCat.age}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Application Form */}
        <View className="px-4 space-y-6">
          <View className="space-y-2">
            <Label htmlFor="name">姓名 *</Label>
            <Input 
              id="name" 
              placeholder="请输入您的真实姓名" 
              value={formData.name}
              onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
            />
          </View>

          <View className="space-y-2">
            <Label htmlFor="age">年龄 *</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="请输入您的年龄" 
              value={formData.age}
              onInput={(e) => setFormData({ ...formData, age: e.detail.value })}
            />
          </View>

          <View className="space-y-2">
            <Label htmlFor="phone">联系电话 *</Label>
            <Input 
              id="phone" 
              type="number" 
              placeholder="请输入您的联系电话" 
              value={formData.phone}
              onInput={(e) => setFormData({ ...formData, phone: e.detail.value })}
            />
          </View>

          <View className="space-y-2">
            <Label htmlFor="address">居住地址 *</Label>
            <Input 
              id="address" 
              placeholder="请输入您的居住地址" 
              value={formData.address}
              onInput={(e) => setFormData({ ...formData, address: e.detail.value })}
            />
          </View>

          <View className="space-y-2">
            <Label htmlFor="experience">养宠经验 *</Label>
            <Textarea
              id="experience"
              placeholder="请描述您的养宠经验，如果没有经验请说明您为领养做的准备..."
              // rows={3} Taro Textarea 高度通常用 style 或 class 控制
              className="h-24"
              value={formData.experience}
              onInput={(e) => setFormData({ ...formData, experience: e.detail.value })}
            />
          </View>

          <View className="space-y-2">
            <Label htmlFor="reason">领养理由 *</Label>
            <Textarea
              id="reason"
              placeholder="请简要说明您的领养理由和如何照顾猫咪..."
              className="h-32"
              value={formData.reason}
              onInput={(e) => setFormData({ ...formData, reason: e.detail.value })}
            />
          </View>

          <View className="flex flex-row items-start space-x-2">
            <Checkbox id="agree" />
            <Label htmlFor="agree" className="leading-relaxed flex-1">
              我已阅读并同意《领养协议》，承诺善待猫咪，定期带猫咪体检，不遗弃不虐待。
            </Label>
          </View>

          <View className="flex flex-row gap-3 pb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => selectedCat ? onNavigate('catDetail', selectedCat) : setCurrentView('list')}
            >
              取消
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-[#ff8c42] to-[#f59e0b] hover:from-[#ff8c42]/90 hover:to-[#f59e0b]/90"
              onClick={() => {
                Taro.showToast({
                  title: '申请已提交！我们会尽快审核您的申请。',
                  icon: 'none',
                  duration: 2000
                });
                setTimeout(() => setCurrentView('list'), 1500);
              }}
            >
              提交申请
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // 提取列表渲染逻辑
  const renderApplicationList = (filteredApps: typeof applications) => (
    <View className="space-y-3 mt-0">
      {filteredApps.map((app) => {
        const statusInfo = getStatusInfo(app.status);
        
        return (
          <Card key={app.id} className="p-4 bg-[#ffffff]">
            <View className="flex flex-row gap-3 mb-3">
              <View className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={app.catImage}
                  alt={app.catName}
                  className="w-full h-full object-cover"
                />
              </View>

              <View className="flex-1">
                <View className="flex flex-row items-start justify-between mb-2">
                  <Text className="text-[#262626] font-medium">{app.catName}</Text>
                  <Badge className={statusInfo.className}>
                    <Text className="mr-1">{statusInfo.icon}</Text>
                    <Text>{statusInfo.label}</Text>
                  </Badge>
                </View>

                <View className="space-y-1 text-sm text-[#78716c]">
                  <Text className="block">申请人：{app.applicationContent.name}</Text>
                  <Text className="block">联系电话：{app.applicationContent.phone}</Text>
                  <Text className="block">申请时间：{app.date}</Text>
                </View>
              </View>
            </View>

            {/* Review Notes */}
            {app.reviewNotes && (
              <View className="mt-3 p-3 bg-[#fff5ed]/50 rounded-lg">
                <Text className="text-sm text-[#78716c]">
                  <Text className="text-[#262626] font-medium">审核意见：</Text>
                  {app.reviewNotes}
                </Text>
              </View>
            )}

            {/* Contract Link */}
            {app.contractUrl && app.status === 'APPROVED' && (
              <View className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex flex-row items-center justify-center"
                  onClick={() => handleCopyContract(app.contractUrl!)}
                >
                  {/* Emoji 替换 FileText */}
                  <Text className="mr-2">📄</Text>
                  <Text>复制领养合同链接</Text>
                </Button>
              </View>
            )}
          </Card>
        );
      })}
    </View>
  );

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <View className="flex flex-row items-center gap-3 mb-4">
          <Text className="text-[#ffffff] text-2xl font-medium">领养申请记录</Text>
        </View>
        <Text className="text-[#ffffff]/90 text-sm">共 {applications.length} 条申请记录</Text>
      </View>

      {/* Tabs */}
      <View className="px-4 py-4">
        <Tabs defaultValue="all">
          <TabsList className="w-full bg-[#ffffff] rounded-xl shadow-sm mb-4 grid grid-cols-3">
            <TabsTrigger value="all" className="rounded-lg">全部</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg">进行中</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg">已完成</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderApplicationList(applications)}
          </TabsContent>

          <TabsContent value="pending">
            {renderApplicationList(applications.filter(app => ['PENDING', 'UNDER_REVIEW', 'INTERVIEW', 'HOME_VISIT'].includes(app.status)))}
          </TabsContent>

          <TabsContent value="completed">
            {renderApplicationList(applications.filter(app => ['APPROVED', 'REJECTED'].includes(app.status)))}
          </TabsContent>
        </Tabs>
      </View>
    </View>
  );
}