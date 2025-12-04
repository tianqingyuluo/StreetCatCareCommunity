import React, { useState } from 'react';
import { View, Text, Textarea, Picker, ScrollView } from '@tarojs/components';
import IconFont from '@/icons';
import { Card } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { ImageWithFallback } from '@/ui/image';

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  photos: string[];
}

interface CatCommentsPageProps {
  data?: any;
  onNavigate: (page: string, data?: any) => void;
  onImageClick?: (images: string[], index: number) => void;
}

export default function CatCommentsPage({ data, onNavigate, onImageClick }: CatCommentsPageProps) {
  const cat = data?.cat || { id: 1, name: '小橘' };
  
  const [comments, setComments] = useState<Comment[]>(data?.comments || [
    {
      id: 1,
      author: {
        name: '猫咪爱好者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
      },
      content: '小橘真的太可爱了！每次看到它都让人心情变好，希望它能早日找到温暖的家。',
      time: '3天前',
      likes: 156,
      liked: false,
      photos: [],
    },
    {
      id: 2,
      author: {
        name: '志愿者小张',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
      },
      content: '已经投喂了好几次，小橘很亲人，适合家庭领养。',
      time: '5天前',
      likes: 89,
      liked: false,
      photos: [],
    },
    {
      id: 3,
      author: {
        name: '铲屎官新手',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
      },
      content: '看着真的好心疼，希望能有好心人领养它！',
      time: '1周前',
      likes: 67,
      liked: false,
      photos: [],
    },
    {
      id: 4,
      author: {
        name: '爱心人士',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13',
      },
      content: '今天给小橘送了猫粮和水，它吃得很开心。',
      time: '2周前',
      likes: 45,
      liked: false,
      photos: [
        'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    {
      id: 5,
      author: {
        name: '猫咪救助者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=14',
      },
      content: '小橘性格温顺，很适合有小孩的家庭领养。',
      time: '3周前',
      likes: 38,
      liked: false,
      photos: [],
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [commentPhotos, setCommentPhotos] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'time' | 'likes'>('time');

  // Picker 选项
  const sortOptions = [
    { label: '按时间排序', value: 'time' },
    { label: '按点赞排序', value: 'likes' }
  ];

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));
  };

  const handleAddPhoto = () => {
    if (commentPhotos.length < 3) {
      const mockImages = [
        'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ];
      setCommentPhotos([...commentPhotos, mockImages[0]]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setCommentPhotos(commentPhotos.filter((_, i) => i !== index));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      author: {
        name: '当前用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      },
      content: newComment,
      time: '刚刚',
      likes: 0,
      liked: false,
      photos: commentPhotos,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    setCommentPhotos([]);
  };

  const handleImageClick = (images: string[], index: number) => {
    if (onImageClick) {
      onImageClick(images, index);
    }
  };

  const getSortedComments = () => {
    const sorted = [...comments];
    if (sortBy === 'likes') {
      return sorted.sort((a, b) => b.likes - a.likes);
    } else {
      // 按时间排序 - ID越大越新
      return sorted.sort((a, b) => b.id - a.id);
    }
  };

  return (
    <View className="pb-32 bg-[#fafaf9] min-h-screen">
      {/* Header */}
      <View className="bg-gradient-to-br from-[#ff8c42] to-amber-500 px-4 pt-8 pb-6 rounded-b-3xl">
        <View className="flex flex-row items-center gap-3 mb-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => onNavigate('catDetail', cat)}
          >
            <IconFont name="arrow-left" size={20} color="#ffffff" />
          </Button>
          <Text className="text-white text-2xl font-medium">{cat.name} 的评论</Text>
        </View>
        
        {/* Sort Selector using Taro Picker */}
        <View className="flex flex-row items-center gap-2">
          <IconFont name="arrow-up-down" size={16} color="rgba(255,255,255,0.8)" />
          <Picker 
            mode="selector" 
            range={sortOptions} 
            rangeKey="label"
            onChange={(e) => setSortBy(sortOptions[e.detail.value].value as 'time' | 'likes')}
          >
            <View className="w-[140px] bg-white/20 border border-white/30 h-9 rounded-lg flex flex-row items-center px-3">
              <Text className="text-white text-sm">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </Text>
            </View>
          </Picker>
        </View>
      </View>

      {/* Comments List */}
      <ScrollView scrollY className="px-4 py-6">
        <View className="space-y-4">
          {getSortedComments().map((comment) => (
            <Card key={comment.id} className="p-4 bg-[#ffffff]">
              <View className="flex flex-row gap-3">
                <Avatar className="flex-shrink-0">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                
                <View className="flex-1">
                  <View className="flex flex-row items-center justify-between mb-1">
                    <Text className="text-[#252525] font-medium">{comment.author.name}</Text>
                    <Text className="text-[#78716c] text-xs">{comment.time}</Text>
                  </View>
                  
                  <Text className="text-[#252525] leading-relaxed mb-2 block">{comment.content}</Text>
                  
                  {/* Comment Photos */}
                  {comment.photos && comment.photos.length > 0 && (
                    <View className="grid grid-cols-3 gap-2 mb-3">
                      {comment.photos.map((photo, index) => (
                        <View
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden active:opacity-80"
                          onClick={() => handleImageClick(comment.photos, index)}
                        >
                          <ImageWithFallback
                            src={photo}
                            alt={`评论图片 ${index + 1}`}
                            className="w-full h-full object-cover"
                            mode='aspectFill'
                          />
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <View
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex flex-row items-center gap-1 active:opacity-60 transition-opacity"
                  >
                    <IconFont 
                      name="thumbs-up" 
                      size={16} 
                      color={comment.liked ? '#ff8c42' : '#78716c'} 
                    />
                    <Text className={`text-sm ${comment.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                      {comment.likes}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Comment Input - Fixed at bottom */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.08)] p-4 pb-6 z-10">
        {/* Photo Preview */}
        {commentPhotos.length > 0 && (
          <View className="flex flex-row gap-2 mb-2">
            {commentPhotos.map((photo, index) => (
              <View key={index} className="relative w-16 h-16 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={photo}
                  alt={`图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <View
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center active:bg-black/80"
                >
                  <Text className="text-white text-xs">×</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        <View className="flex flex-row gap-2 max-w-lg mx-auto items-end">
          <Button
            size="icon"
            variant="outline"
            onClick={handleAddPhoto}
            disabled={commentPhotos.length >= 3}
            className="flex-shrink-0"
          >
            <IconFont name="image" size={16} color="#78716c" />
          </Button>
          
          <Textarea
            placeholder="写下你的评论..."
            value={newComment}
            onInput={(e) => setNewComment(e.detail.value)}
            autoHeight
            className="flex-1 min-h-[40px] max-h-[100px] bg-[#fafaf9] rounded-md p-2 text-sm"
            showConfirmBar={false}
          />
          
          <Button
            size="icon"
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="flex-shrink-0 bg-gradient-to-r from-[#ff8c42] to-amber-500"
          >
            <IconFont name="send" size={16} color="#ffffff" />
          </Button>
        </View>
      </View>
    </View>
  );
}