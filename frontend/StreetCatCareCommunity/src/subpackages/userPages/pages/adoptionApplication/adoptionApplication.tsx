import React, { useState } from 'react';
import Taro, { useDidShow, useUnload, useLoad } from '@tarojs/taro';
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
import { useCatStore } from '@/stores/catStore';
import { useAdoptionStore } from '@/stores/adoptionStore';

export default function AdoptionApplicationPage() {
  const { getSelectedCatForUI, navigateToCatDetail, clearCurrentTargetId, currentTargetId } = useCatStore();
  const { getAdoptionsForUI, getPendingAdoptionsForUI, getCompletedAdoptionsForUI, fetchAdoptions, submitAdoption, loading } = useAdoptionStore();
  
  const selectedCat = getSelectedCatForUI();
  const applications = getAdoptionsForUI();
  
  const [currentView, setCurrentView] = useState<'form' | 'list'>('list');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 页面加载时获取领养申请数据和判断显示模式
  useLoad(() => {
    fetchAdoptions();
    
    // 从URL参数中获取showForm参数
    const params = Taro.getCurrentInstance().router?.params;
    if (params?.showForm === 'true' && selectedCat) {
      setCurrentView('form');
    } else {
      setCurrentView('list');
    }
  });
  
  // 页面显示时更新视图状态
  useDidShow(() => {
    // 从URL参数中获取showForm参数
    const params = Taro.getCurrentInstance().router?.params;
    const cat = getSelectedCatForUI();
    
    if (params?.showForm === 'true' && cat) {
      setCurrentView('form');
    } else {
      setCurrentView('list');
    }
  });
  
  // 页面卸载时清理导航状态
  useUnload(() => {
    clearCurrentTargetId();
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    address: '',
    experience: '',
    reason: '',
  });

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
            <Checkbox 
              checked={agreed}
              onCheckedChange={setAgreed}
            />
            <Label htmlFor="agree" className="leading-relaxed flex-1">
              我已阅读并同意《领养协议》，承诺善待猫咪，定期带猫咪体检，不遗弃不虐待。
            </Label>
          </View>

          <View className="flex flex-row gap-3 pb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (selectedCat && currentTargetId) {
                  navigateToCatDetail(currentTargetId);
                } else {
                  setCurrentView('list');
                }
              }}
            >
              取消
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-[#ff8c42] to-[#f59e0b] hover:from-[#ff8c42]/90 hover:to-[#f59e0b]/90"
              disabled={submitting}
              onClick={async () => {
                if (!selectedCat) {
                  Taro.showToast({
                    title: '请先选择要领养的猫咪',
                    icon: 'none',
                  });
                  return;
                }

                if (!formData.name || !formData.age || !formData.phone || !formData.address || !formData.experience || !formData.reason) {
                  Taro.showToast({
                    title: '请填写所有必填项',
                    icon: 'none',
                  });
                  return;
                }

                if (!agreed) {
                  Taro.showToast({
                    title: '请先阅读并同意领养协议',
                    icon: 'none',
                  });
                  return;
                }

                setSubmitting(true);
                try {
                  await submitAdoption({
                    catId: selectedCat.id,
                    name: formData.name,
                    age: parseInt(formData.age),
                    phone: formData.phone,
                    address: formData.address,
                    experience: formData.experience,
                    reason: formData.reason,
                  });

                  Taro.showToast({
                    title: '申请已提交！我们会尽快审核您的申请。',
                    icon: 'success',
                    duration: 2000
                  });

                  setFormData({
                    name: '',
                    age: '',
                    phone: '',
                    address: '',
                    experience: '',
                    reason: '',
                  });
                  setAgreed(false);

                  setTimeout(() => setCurrentView('list'), 1500);
                } catch (error) {
                  Taro.showToast({
                    title: '提交失败，请重试',
                    icon: 'none',
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? '提交中...' : '提交申请'}
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // 提取列表渲染逻辑
  const renderApplicationList = (filteredApps: typeof applications) => {
    if (loading) {
      return (
        <View className="flex items-center justify-center py-12">
          <Text className="text-[#78716c]">加载中...</Text>
        </View>
      );
    }

    if (filteredApps.length === 0) {
      return (
        <View className="flex items-center justify-center py-12">
          <Text className="text-[#78716c]">暂无申请记录</Text>
        </View>
      );
    }

    return (
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
                    mode='aspectFill'
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
  };

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
            {renderApplicationList(getPendingAdoptionsForUI())}
          </TabsContent>

          <TabsContent value="completed">
            {renderApplicationList(getCompletedAdoptionsForUI())}
          </TabsContent>
        </Tabs>
      </View>
    </View>
  );
}