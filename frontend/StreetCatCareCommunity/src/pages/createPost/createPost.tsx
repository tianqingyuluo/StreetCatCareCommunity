import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

// 保持你要求的自定义组件导入不变
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { Input } from '@/ui/input';
import { Card } from '@/ui/card';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { ImageWithFallback } from '@/ui/image';
import IconFont from '@/icons';
import { ROUTES } from '@/config/routes';
import { createPost } from '@/services/api/postService';
import { uploadImage } from '@/services/api/uploadService';
import { usePostStore } from '@/stores/postStore';
import * as API from '@/types/api';

// 从环境变量读取是否使用 Mock 图片
const USE_MOCK_IMAGES = process.env.TARO_APP_USE_MOCK_IMAGES === 'true';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<API.PostType>(API.PostType.DISCUSSION);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  const { fetchPosts } = usePostStore();

  const handleAddImage = async () => {
    if (images.length >= 9) {
      Taro.showToast({
        title: '最多只能添加9张图片',
        icon: 'none'
      });
      return;
    }

    // 如果开启了 Mock 模式，使用模拟图片
    if (USE_MOCK_IMAGES) {
      const mockImages = [
        'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1704947807029-c75381b64869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMGZsdWZmeXxlbnwxfHx8fDE3NjA1MTI4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ];
      setImages([...images, mockImages[images.length % mockImages.length]]);
      return;
    }

    // 真实的图片选择和上传
    try {
      const res = await Taro.chooseImage({
        count: 9 - images.length, // 最多选择剩余可添加的数量
        sizeType: ['compressed'], // 使用压缩图
        sourceType: ['album', 'camera'], // 可以从相册选择或拍照
      });

      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        setUploading(true);
        Taro.showLoading({ title: '上传中...' });

        // 逐个上传图片
        const uploadedUrls: string[] = [];
        for (const filePath of res.tempFilePaths) {
          try {
            const url = await uploadImage(filePath);
            uploadedUrls.push(url);
          } catch (error) {
            console.error('图片上传失败:', error);
            Taro.showToast({
              title: '部分图片上传失败',
              icon: 'none'
            });
          }
        }

        setImages([...images, ...uploadedUrls]);
        Taro.hideLoading();
        setUploading(false);
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      Taro.hideLoading();
      setUploading(false);
      Taro.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    // 验证输入
    if (!title.trim()) {
      Taro.showToast({
        title: '请输入标题',
        icon: 'none'
      });
      return;
    }

    if (!content.trim()) {
      Taro.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    try {
      setPublishing(true);
      Taro.showLoading({ title: '发布中...' });

      // 构建请求数据
      const postData: API.PostSaveReq = {
        title: title.trim(),
        content: content.trim(),
        postType: postType,
        images: images.length > 0 ? images : undefined,
      };

      // 调用 API 创建帖子
      await createPost(postData);

      Taro.hideLoading();
      Taro.showToast({
        title: '发布成功！',
        icon: 'success',
        duration: 2000
      });

      // 延迟跳转，让用户看到成功提示
      setTimeout(async () => {
        // 重新拉取帖子列表
        await fetchPosts();
        
        // 跳转回社区页面
        Taro.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('发布帖子失败:', error);
      Taro.hideLoading();
      setPublishing(false);
      Taro.showToast({
        title: '发布失败，请重试',
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
            disabled={publishing || uploading}
            className="bg-[#ffffff] text-[#ff8c42] hover:bg-[#ffffff90] h-10 w-16 rounded-xl"
          >
            {publishing ? '发布中' : '发布'}
          </Button>
        </View>
      </View>

      {/* Content */}
      <View className="px-4 py-6">
        {/* Post Type Selection */}
        <Card className="p-4 mb-4 bg-[#ffffff]">
          <Label className="text-[#252525] mb-2 block">帖子类型</Label>
          <Select value={postType} onValueChange={(value) => setPostType(value as API.PostType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择帖子类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={API.PostType.DISCUSSION}>讨论贴</SelectItem>
              <SelectItem value={API.PostType.EXPERIENCE}>经验贴</SelectItem>
              <SelectItem value={API.PostType.HELP}>求助帖</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Title Input */}
        <Card className="p-4 mb-4 bg-[#ffffff]">
          <Input
            placeholder="输入帖子标题..."
            value={title}
            onInput={(e) => setTitle(e.target.value)}
            className="border-0 p-0 focus-visible:ring-0"
            maxlength={100}
          />
        </Card>

        {/* Content Input */}
        <Card className="p-4 mb-4 bg-[#ffffff]">
          <Textarea
            placeholder="分享你和流浪猫的故事..."
            value={content}
            onInput={(e) => setContent(e.target.value)}
            rows={8}
            className="border-0 p-0 resize-none focus-visible:ring-0"
            maxlength={2000}
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
            disabled={uploading}
            className="w-full h-32 border-dashed"
          >
            <View className="flex flex-col items-center gap-2">
              <IconFont name="image" size={90}/>
              <Text className="text-[#78716c]">{uploading ? '上传中...' : '添加图片'}</Text>
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