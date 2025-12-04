import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components'; // 引入 Taro 基础组件

// 保持你要求的自定义组件导入不变
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { Input } from '@/ui/input';
import { Card } from '@/ui/card';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { ImageWithFallback } from '@/ui/image';
import IconFont from '@/icons';

interface CreatePostPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function CreatePostPage({ onNavigate }: CreatePostPageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('讨论贴');
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    // 模拟添加图片
    const mockImages = [
      'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ];
    if (images.length < 9) {
      setImages([...images, mockImages[images.length % mockImages.length]]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (title.trim() && content.trim()) {
      // 替换 alert 为 Taro 的 Toast
      Taro.showToast({
        title: '帖子发布成功！',
        icon: 'success',
        duration: 2000
      });
      setTimeout(() => {
        onNavigate('community');
      }, 1500);
    } else {
      Taro.showToast({
        title: '请输入标题和内容',
        icon: 'none'
      });
    }
  };

  return (
    <View className="pb-20 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-3">
            <Text className="text-[#ffffff] text-2xl">发布帖子</Text>
          </View>
          
          <Button
            onClick={handlePublish}
            className="bg-[#ffffff] text-[#ff8c42] hover:bg-[#ffffff90] h-10 w-16 rounded-xl"
          >
            发布
          </Button>
        </View>
      </View>

      {/* Content */}
      <View className="px-4 py-6">
        {/* Post Type Selection */}
        <Card className="p-4 mb-4 bg-[#ffffff]">
          <Label className="text-[#252525] mb-2 block">帖子类型</Label>
          {/* 注意：Select 组件在小程序中可能需要替换为 Taro 的 Picker 组件，这里保持原样 */}
          <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择帖子类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DISCUSSION">讨论贴</SelectItem>
              <SelectItem value="EXPERIENCE">经验贴</SelectItem>
              <SelectItem value="HELP">求助帖</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Title Input */}
        <Card className="p-4 mb-4 bg-[#ffffff]">
          <Input
            placeholder="输入帖子标题..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 p-0 focus-visible:ring-0"
          />
        </Card>

        {/* Content Input */}
        <Card className="p-4 mb-4 bg-[#ffffff]">
          <Textarea
            placeholder="分享你和流浪猫的故事..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="border-0 p-0 resize-none focus-visible:ring-0"
          />
        </Card>

        {/* Images Grid */}
        {images.length > 0 && (
          <View className="grid grid-cols-3 gap-2 mb-4">
            {images.map((image, index) => (
              <View key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={image}
                  alt={`图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <View
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-[#00000099] rounded-full flex items-center justify-center text-[#ffffff]"
                >
                  <IconFont name='x' size={40}/>
                </View>
              </View>
            ))}
            
            {images.length < 9 && (
              <View
                onClick={handleAddImage}
                className="aspect-square rounded-lg border-2 border-dashed border-[#00000014] flex items-center justify-center bg-[#f5f5f44d] hover:bg-[#f5f5f480] transition-colors"
              >
                <IconFont name="image" size={60}/>
              </View>
            )}
          </View>
        )}

        {/* Add Image Button */}
        {images.length === 0 && (
          <Button
            variant="outline"
            onClick={handleAddImage}
            className="w-full h-32 border-dashed"
          >
            <View className="flex flex-col items-center gap-2">
              <IconFont name="image" size={90}/>
              <Text className="text-[#78716c]">添加图片</Text>
              <Text className="text-xs text-[#78716c]">最多9张</Text>
            </View>
          </Button>
        )}

        {/* Tips */}
        <Card className="p-4 bg-[#fff5ed80] mt-6">
          <Text className="text-[#252525] mb-2 block font-medium">发帖提示</Text>
          <View className="space-y-1">
            <Text className="text-sm text-[#78716c] block">• 分享真实的故事和照片</Text>
            <Text className="text-sm text-[#78716c] block">• 尊重他人，文明交流</Text>
            <Text className="text-sm text-[#78716c] block">• 提供准确的信息帮助猫咪找到家</Text>
          </View>
        </Card>
      </View>
    </View>
  );
}