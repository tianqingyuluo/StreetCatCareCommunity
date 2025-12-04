// import React, { useState } from 'react';
// import { View, Text } from '@tarojs/components';
// // 保持原有自定义组件导入
// import { Card } from '@/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
// import { Button } from '@/ui/button';
// import { Badge } from '@/ui/badge';
// import { Textarea } from '@/ui/textarea';
// import { ImageWithFallback } from '@/ui/image';

// interface Comment {
//   id: number;
//   author: {
//     name: string;
//     avatar: string;
//   };
//   content: string;
//   time: string;
//   likes: number;
//   liked: boolean;
//   photos: string[];
//   replies: Reply[];
//   showReplies: boolean;
// }

// interface Reply {
//   id: number;
//   author: {
//     name: string;
//     avatar: string;
//   };
//   content: string;
//   time: string;
//   likes: number;
//   liked: boolean;
//   photos: string[];
//   replyTo?: string;
// }

// interface PostDetailPageProps {
//   data: any;
//   onNavigate: (page: string, data?: any) => void;
//   onImageClick?: (images: string[], index: number) => void;
// }

// export default function PostDetailPage({ data, onNavigate, onImageClick }: PostDetailPageProps) {
//   const [post, setPost] = useState(data || {
//     id: 1,
//     title: '小橘吃罐头啦',
//     author: {
//       name: '爱猫人士小李',
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
//     },
//     content: '今天在小区又遇到了小橘，给它喂了罐头，吃得可香了！希望它能早日找到温暖的家🏠',
//     images: [
//       'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
//     ],
//     time: '2小时前',
//     likes: 45,
//     comments: 12,
//     liked: false,
//     postType: 'DISCUSSION',
//   });

//   const [comments, setComments] = useState<Comment[]>([
//     {
//       id: 1,
//       author: {
//         name: '猫咪志愿者',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
//       },
//       content: '小橘真的超级可爱！我也经常看到它，希望能有人领养它。',
//       time: '1小时前',
//       likes: 23,
//       liked: false,
//       photos: [],
//       showReplies: false,
//       replies: [
//         {
//           id: 101,
//           author: {
//             name: '爱猫人士小李',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
//           },
//           content: '是的！小橘很亲人，希望能早日找到好人家。',
//           time: '50分钟前',
//           likes: 5,
//           liked: false,
//           photos: [],
//         },
//         {
//           id: 102,
//           author: {
//             name: '热心市民',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
//           },
//           content: '我也想领养，请问怎么申请呢？',
//           time: '45分钟前',
//           likes: 3,
//           liked: false,
//           photos: [],
//           replyTo: '爱猫人士小李',
//         },
//       ],
//     },
//     {
//       id: 2,
//       author: {
//         name: '铲屎官小王',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
//       },
//       content: '看着好心疼，冬天快到了，希望它能有个温暖的家。',
//       time: '30分钟前',
//       likes: 15,
//       liked: false,
//       photos: [],
//       showReplies: false,
//       replies: [],
//     },
//   ]);

//   const [newComment, setNewComment] = useState('');
//   const [replyingTo, setReplyingTo] = useState<{ commentId: number; userName?: string } | null>(null);

//   const getPostTypeLabel = (type: string) => {
//     const typeMap: Record<string, { label: string; color: string }> = {
//       'DISCUSSION': { label: '讨论贴', color: 'bg-[#3b82f6]' }, // blue-500
//       'EXPERIENCE': { label: '经验贴', color: 'bg-[#22c55e]' }, // green-500
//       'HELP': { label: '求助帖', color: 'bg-[#f59e0b]' },       // amber-500
//     };
//     return typeMap[type] || typeMap['DISCUSSION'];
//   };

//   const handleLikePost = () => {
//     setPost({
//       ...post,
//       liked: !post.liked,
//       likes: post.liked ? post.likes - 1 : post.likes + 1,
//     });
//   };

//   const handleLikeComment = (commentId: number) => {
//     setComments(comments.map(comment => {
//       if (comment.id === commentId) {
//         return {
//           ...comment,
//           liked: !comment.liked,
//           likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
//         };
//       }
//       return comment;
//     }));
//   };

//   const handleLikeReply = (commentId: number, replyId: number) => {
//     setComments(comments.map(comment => {
//       if (comment.id === commentId) {
//         return {
//           ...comment,
//           replies: comment.replies.map(reply => {
//             if (reply.id === replyId) {
//               return {
//                 ...reply,
//                 liked: !reply.liked,
//                 likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
//               };
//             }
//             return reply;
//           }),
//         };
//       }
//       return comment;
//     }));
//   };

//   const handleToggleReplies = (commentId: number) => {
//     setComments(comments.map(comment => {
//       if (comment.id === commentId) {
//         return {
//           ...comment,
//           showReplies: !comment.showReplies,
//         };
//       }
//       return comment;
//     }));
//   };

//   const handleSubmitComment = () => {
//     if (!newComment.trim()) return;

//     if (replyingTo) {
//       // 添加回复到对应的评论
//       setComments(comments.map(comment => {
//         if (comment.id === replyingTo.commentId) {
//           const newReply: Reply = {
//             id: Date.now(),
//             author: {
//               name: '当前用户',
//               avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
//             },
//             content: newComment,
//             time: '刚刚',
//             likes: 0,
//             liked: false,
//             photos: [],
//             replyTo: replyingTo.userName,
//           };
//           return {
//             ...comment,
//             replies: [...comment.replies, newReply],
//             showReplies: true,
//           };
//         }
//         return comment;
//       }));
//       setReplyingTo(null);
//     } else {
//       // 添加新评论
//       const newCommentObj: Comment = {
//         id: Date.now(),
//         author: {
//           name: '当前用户',
//           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
//         },
//         content: newComment,
//         time: '刚刚',
//         likes: 0,
//         liked: false,
//         photos: [],
//         replies: [],
//         showReplies: false,
//       };
//       setComments([newCommentObj, ...comments]);
//     }
    
//     setNewComment('');
//   };

//   const handleImageClick = (images: string[], index: number) => {
//     if (onImageClick) {
//       onImageClick(images, index);
//     }
//   };

//   return (
//     <View className="pb-32 bg-[#fafaf9] min-h-screen">
//       {/* Header */}
//       <View className="bg-gradient-to-br from-[#ff8c42] to-[#f59e0b] px-4 pt-8 pb-6 rounded-b-3xl">
//         <View className="flex flex-row items-center gap-3">
//           <Button
//             size="icon"
//             variant="ghost"
//             className="text-[#ffffff] hover:bg-white/20 rounded-full flex items-center justify-center"
//             onClick={() => onNavigate('community')}
//           >
//             {/* Emoji 替换 ArrowLeft */}
//             <Text className="text-xl">⬅️</Text>
//           </Button>
//           <Text className="text-[#ffffff] text-2xl font-medium">帖子详情</Text>
//         </View>
//       </View>

//       {/* Post Content */}
//       <View className="px-4 py-6">
//         <Card className="p-4 mb-6 bg-[#ffffff]">
//           {/* Author Info */}
//           <View className="flex flex-row items-center gap-3 mb-4">
//             <Avatar>
//               <AvatarImage src={post.author.avatar} />
//               <AvatarFallback>{post.author.name[0]}</AvatarFallback>
//             </Avatar>
//             <View className="flex-1">
//               <Text className="block text-[#262626]">{post.author.name}</Text>
//               <Text className="block text-[#78716c] text-xs">{post.time}</Text>
//             </View>
//             <Badge className={`${getPostTypeLabel(post.postType).color} text-[#ffffff]`}>
//               {getPostTypeLabel(post.postType).label}
//             </Badge>
//           </View>

//           {/* Title */}
//           <Text className="block text-[#262626] text-xl font-bold mb-3">{post.title}</Text>

//           {/* Content */}
//           <Text className="block text-[#262626] mb-4 leading-relaxed">{post.content}</Text>

//           {/* Images */}
//           {post.images.length > 0 && (
//             <View className={`grid gap-2 mb-4 ${
//               post.images.length === 1 ? 'grid-cols-1' : 
//               post.images.length === 2 ? 'grid-cols-2' : 
//               'grid-cols-3'
//             }`}>
//               {post.images.map((image: string, index: number) => (
//                 <View
//                   key={index}
//                   className={`relative rounded-lg overflow-hidden ${
//                     post.images.length === 1 ? 'aspect-video' : 'aspect-square'
//                   }`}
//                   onClick={() => handleImageClick(post.images, index)}
//                 >
//                   <ImageWithFallback
//                     src={image}
//                     alt={`图片 ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* Actions */}
//           <View className="flex flex-row items-center gap-6 pt-4 border-t border-[rgba(0,0,0,0.08)]">
//             <View
//               onClick={handleLikePost}
//               className="flex flex-row items-center gap-1.5 text-[#78716c] hover:text-[#ff8c42] transition-colors"
//             >
//               {/* Emoji 替换 Heart */}
//               <Text className={`text-lg ${post.liked ? 'text-[#ff8c42]' : ''}`}>
//                 {post.liked ? '❤️' : '🤍'}
//               </Text>
//               <Text className="text-sm">{post.likes}</Text>
//             </View>
            
//             <View className="flex flex-row items-center gap-1.5 text-[#78716c] hover:text-[#ff8c42] transition-colors">
//               {/* Emoji 替换 MessageCircle */}
//               <Text className="text-lg">💬</Text>
//               <Text className="text-sm">{comments.length}</Text>
//             </View>
            
//             <View className="flex flex-row items-center gap-1.5 text-[#78716c] hover:text-[#ff8c42] transition-colors ml-auto">
//               {/* Emoji 替换 Share2 */}
//               <Text className="text-lg">🔗</Text>
//             </View>
//           </View>
//         </Card>

//         {/* Comments Section */}
//         <View className="mb-6">
//           <Text className="block text-[#262626] mb-4 font-medium">评论 ({comments.length})</Text>
          
//           <View className="space-y-4">
//             {comments.map((comment) => (
//               <Card key={comment.id} className="p-4 bg-[#ffffff]">
//                 {/* Comment */}
//                 <View className="flex flex-row gap-3">
//                   <Avatar className="flex-shrink-0">
//                     <AvatarImage src={comment.author.avatar} />
//                     <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
//                   </Avatar>
                  
//                   <View className="flex-1">
//                     <View className="flex flex-row items-center gap-2 mb-1">
//                       <Text className="text-[#262626] font-medium">{comment.author.name}</Text>
//                       <Text className="text-[#78716c] text-xs">{comment.time}</Text>
//                     </View>
                    
//                     <Text className="block text-[#262626] mb-2 leading-relaxed">{comment.content}</Text>
                    
//                     {/* Comment Images */}
//                     {comment.photos.length > 0 && (
//                       <View className="grid grid-cols-3 gap-2 mb-2">
//                         {comment.photos.map((photo, index) => (
//                           <View
//                             key={index}
//                             className="relative aspect-square rounded-lg overflow-hidden"
//                             onClick={() => handleImageClick(comment.photos, index)}
//                           >
//                             <ImageWithFallback
//                               src={photo}
//                               alt={`评论图片 ${index + 1}`}
//                               className="w-full h-full object-cover"
//                             />
//                           </View>
//                         ))}
//                       </View>
//                     )}
                    
//                     <View className="flex flex-row items-center gap-4 mt-2">
//                       <View
//                         onClick={() => handleLikeComment(comment.id)}
//                         className="flex flex-row items-center gap-1 text-[#78716c] hover:text-[#ff8c42] transition-colors text-sm"
//                       >
//                         <Text className={`text-base ${comment.liked ? 'text-[#ff8c42]' : ''}`}>
//                           {comment.liked ? '❤️' : '🤍'}
//                         </Text>
//                         <Text>{comment.likes}</Text>
//                       </View>
                      
//                       <View
//                         onClick={() => setReplyingTo({ commentId: comment.id })}
//                         className="text-[#78716c] hover:text-[#ff8c42] transition-colors text-sm"
//                       >
//                         <Text>回复</Text>
//                       </View>
                      
//                       {comment.replies.length > 0 && (
//                         <View
//                           onClick={() => handleToggleReplies(comment.id)}
//                           className="flex flex-row items-center gap-1 text-[#ff8c42] text-sm"
//                         >
//                           {comment.showReplies ? (
//                             <>
//                               {/* Emoji 替换 ChevronUp */}
//                               <Text>🔼</Text>
//                               <Text>收起回复</Text>
//                             </>
//                           ) : (
//                             <>
//                               {/* Emoji 替换 ChevronDown */}
//                               <Text>🔽</Text>
//                               <Text>{comment.replies.length} 条回复</Text>
//                             </>
//                           )}
//                         </View>
//                       )}
//                     </View>
                    
//                     {/* Replies */}
//                     {comment.showReplies && comment.replies.length > 0 && (
//                       <View className="mt-4 pl-4 border-l-2 border-[rgba(0,0,0,0.08)] space-y-3">
//                         {comment.replies.map((reply) => (
//                           <View key={reply.id} className="flex flex-row gap-3">
//                             <Avatar className="w-8 h-8 flex-shrink-0">
//                               <AvatarImage src={reply.author.avatar} />
//                               <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
//                             </Avatar>
                            
//                             <View className="flex-1">
//                               <View className="flex flex-row items-center gap-2 mb-1 flex-wrap">
//                                 <Text className="text-[#262626] text-sm font-medium">{reply.author.name}</Text>
//                                 {reply.replyTo && (
//                                   <>
//                                     <Text className="text-[#78716c] text-xs">回复</Text>
//                                     <Text className="text-[#ff8c42] text-sm">@{reply.replyTo}</Text>
//                                   </>
//                                 )}
//                                 <Text className="text-[#78716c] text-xs">{reply.time}</Text>
//                               </View>
                              
//                               <Text className="block text-[#262626] text-sm mb-2 leading-relaxed">{reply.content}</Text>
                              
//                               {/* Reply Images */}
//                               {reply.photos.length > 0 && (
//                                 <View className="grid grid-cols-3 gap-2 mb-2">
//                                   {reply.photos.map((photo, index) => (
//                                     <View
//                                       key={index}
//                                       className="relative aspect-square rounded-lg overflow-hidden"
//                                       onClick={() => handleImageClick(reply.photos, index)}
//                                     >
//                                       <ImageWithFallback
//                                         src={photo}
//                                         alt={`回复图片 ${index + 1}`}
//                                         className="w-full h-full object-cover"
//                                       />
//                                     </View>
//                                   ))}
//                                 </View>
//                               )}
                              
//                               <View className="flex flex-row items-center gap-4 mt-1">
//                                 <View
//                                   onClick={() => handleLikeReply(comment.id, reply.id)}
//                                   className="flex flex-row items-center gap-1 text-[#78716c] hover:text-[#ff8c42] transition-colors text-xs"
//                                 >
//                                   <Text className={`text-sm ${reply.liked ? 'text-[#ff8c42]' : ''}`}>
//                                     {reply.liked ? '❤️' : '🤍'}
//                                   </Text>
//                                   <Text>{reply.likes}</Text>
//                                 </View>
                                
//                                 <View
//                                   onClick={() => setReplyingTo({ commentId: comment.id, userName: reply.author.name })}
//                                   className="text-[#78716c] hover:text-[#ff8c42] transition-colors text-xs"
//                                 >
//                                   <Text>回复</Text>
//                                 </View>
//                               </View>
//                             </View>
//                           </View>
//                         ))}
//                       </View>
//                     )}
//                   </View>
//                 </View>
//               </Card>
//             ))}
//           </View>
//         </View>
//       </View>

//       {/* Comment Input - Fixed at bottom */}
//       <View className="fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t border-[rgba(0,0,0,0.08)] p-4 pb-6 z-50">
//         {replyingTo && (
//           <View className="flex flex-row items-center justify-between mb-2 px-2">
//             <Text className="text-sm text-[#78716c]">
//               {replyingTo.userName ? `回复 @${replyingTo.userName}` : '回复评论'}
//             </Text>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setReplyingTo(null)}
//               className="h-6 text-xs"
//             >
//               取消
//             </Button>
//           </View>
//         )}
//         <View className="flex flex-row gap-2 max-w-lg mx-auto">
//           <Textarea
//             placeholder={replyingTo ? '写下你的回复...' : '写下你的评论...'}
//             value={newComment}
//             // 注意：Taro 中 Input/Textarea 事件通常是 onInput，值在 e.detail.value
//             // 这里假设你的自定义 Textarea 组件已经处理好了，或者你可以直接使用 onInput
//             onInput={(e) => setNewComment(e.detail.value)}
//             className="resize-none flex-1"
//           />
//           <Button
//             size="icon"
//             onClick={handleSubmitComment}
//             disabled={!newComment.trim()}
//             className="flex-shrink-0 bg-gradient-to-r from-[#ff8c42] to-[#f59e0b] hover:from-[#ff8c42]/90 hover:to-[#f59e0b]/90 flex items-center justify-center"
//           >
//             {/* Emoji 替换 Send */}
//             <Text className="text-lg">📤</Text>
//           </Button>
//         </View>
//       </View>
//     </View>
//   );
// }

import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
// 保持自定义组件导入
import { Card } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Textarea } from '@/ui/textarea';
import { ImageWithFallback } from '@/ui/image';
import { FontAwesome } from 'taro-icons';
import IconFont from '@/icons';

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
  replies: Reply[];
  showReplies: boolean;
}

interface Reply {
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
  replyTo?: string;
}

interface PostDetailPageProps {
  data: any;
  onNavigate: (page: string, data?: any) => void;
  onImageClick?: (images: string[], index: number) => void;
}

export default function PostDetailPage({ data, onNavigate, onImageClick }: PostDetailPageProps) {
  const [post, setPost] = useState(data || {
    id: 1,
    title: '小橘吃罐头啦',
    author: {
      name: '爱猫人士小李',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    content: '今天在小区又遇到了小橘，给它喂了罐头，吃得可香了！希望它能早日找到温暖的家🏠',
    images: [
      'https://images.unsplash.com/photo-1620921787827-f53dcfb164b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1MTU2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    time: '2小时前',
    likes: 45,
    comments: 12,
    liked: false,
    postType: 'DISCUSSION',
    isPinned: false,
    isFeatured: false,
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: {
        name: '猫咪志愿者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      },
      content: '小橘真的超级可爱！我也经常看到它，希望能有人领养它。',
      time: '1小时前',
      likes: 23,
      liked: false,
      photos: [],
      showReplies: false,
      replies: [
        {
          id: 101,
          author: {
            name: '爱猫人士小李',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
          },
          content: '是的！小橘很亲人，希望能早日找到好人家。',
          time: '50分钟前',
          likes: 5,
          liked: false,
          photos: [],
        },
        {
          id: 102,
          author: {
            name: '热心市民',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
          },
          content: '我也想领养，请问怎么申请呢？',
          time: '45分钟前',
          likes: 3,
          liked: false,
          photos: [],
          replyTo: '爱猫人士小李',
        },
      ],
    },
    {
      id: 2,
      author: {
        name: '铲屎官小王',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
      },
      content: '看着好心疼，冬天快到了，希望它能有个温暖的家。',
      time: '30分钟前',
      likes: 15,
      liked: false,
      photos: [],
      showReplies: false,
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: number; userName?: string } | null>(null);

  const getPostTypeLabel = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      'DISCUSSION': { label: '讨论贴', color: 'bg-[#3b82f6]' },
      'EXPERIENCE': { label: '经验贴', color: 'bg-[#22c55e]' },
      'HELP': { label: '求助帖', color: 'bg-[#f59e0b]' },
    };
    return typeMap[type] || typeMap['DISCUSSION'];
  };

  const handleLikePost = () => {
    setPost({
      ...post,
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
    });
  };

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

  const handleLikeReply = (commentId: number, replyId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                liked: !reply.liked,
                likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
              };
            }
            return reply;
          }),
        };
      }
      return comment;
    }));
  };

  const handleToggleReplies = (commentId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          showReplies: !comment.showReplies,
        };
      }
      return comment;
    }));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    if (replyingTo) {
      setComments(comments.map(comment => {
        if (comment.id === replyingTo.commentId) {
          const newReply: Reply = {
            id: Date.now(),
            author: {
              name: '当前用户',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
            },
            content: newComment,
            time: '刚刚',
            likes: 0,
            liked: false,
            photos: [],
            replyTo: replyingTo.userName,
          };
          return {
            ...comment,
            replies: [...comment.replies, newReply],
            showReplies: true,
          };
        }
        return comment;
      }));
      setReplyingTo(null);
    } else {
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
        photos: [],
        replies: [],
        showReplies: false,
      };
      setComments([newCommentObj, ...comments]);
    }
    
    setNewComment('');
  };

  const handleImageClick = (images: string[], index: number) => {
    if (onImageClick) {
      onImageClick(images, index);
    } else {
      Taro.previewImage({
        current: images[index],
        urls: images
      });
    }
  };

  return (
    <View className="bg-[#fafaf9] min-h-screen flex flex-col">
      <ScrollView scrollY className="flex-1 pb-32">
        {/* Header */}
        <View className="bg-gradient-to-br from-orange-600 to-orange-300 px-4 pt-8 pb-6 rounded-3xl">
          <View className="flex flex-row items-center gap-3">
            <Text className="text-[#ffffff] text-2xl">帖子详情</Text>
          </View>
        </View>

        {/* Post Content */}
        <View className="px-4 py-6">
          <Card className="p-4 mb-6 bg-[#ffffff]">
            {/* Author Info */}
            <View className="flex flex-row items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <View className="flex-1">
                <Text className="text-[#292524] block">{post.author.name}</Text>
                <Text className="text-[#78716c] text-xs block">{post.time}</Text>
              </View>
              
              {/* 详情页右上角状态标签 */}
              <View className="flex flex-row gap-2">
                {post.isPinned && (
                  <View className="flex flex-row items-center gap-1 bg-[#fef2f2] px-2 py-1 rounded-full border border-[#fef2f2]">
                    <Text className="text-[#ef4444] text-xs font-medium">📌 置顶</Text>
                  </View>
                )}
                {post.isFeatured && (
                  <View className="flex flex-row items-center gap-1 bg-[#fffbeb] px-2 py-1 rounded-full border border-[#fffbeb]">
                    <Text className="text-[#f59e0b] text-xs font-medium">🏆 精华</Text>
                  </View>
                )}
                <Badge className={`${getPostTypeLabel(post.postType).color} text-[#ffffff]`}>
                  {getPostTypeLabel(post.postType).label}
                </Badge>
              </View>
            </View>

            {/* Title */}
            <Text className="text-[#292524] text-xl mb-3 font-bold block">{post.title}</Text>

            {/* Content */}
            <Text className="text-[#292524] mb-4 leading-relaxed block">{post.content}</Text>

            {/* Images */}
            {post.images.length > 0 && (
              <View className={`grid gap-2 mb-4 ${
                post.images.length === 1 ? 'grid-cols-1' : 
                post.images.length === 2 ? 'grid-cols-2' : 
                'grid-cols-3'
              }`}>
                {post.images.map((image: string, index: number) => (
                  <View
                    key={index}
                    className={`relative rounded-lg overflow-hidden ${
                      post.images.length === 1 ? 'aspect-video' : 'aspect-square'
                    }`}
                    onClick={() => handleImageClick(post.images, index)}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            <View className="flex flex-row items-center gap-6 pt-4 border-t border-[rgba(0,0,0,0.08)]">
              <View
                onClick={handleLikePost}
                className="flex flex-row items-center gap-1.5"
              >
                {/* <Text className={`text-lg ${post.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                  ❤️
                </Text> */}
                <FontAwesome family={post.liked ? 'solid': 'regular'} name='heart' size={16} color={post.liked ? 'orange' : 'black'} />
                <Text className={`text-sm ${post.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                  {post.likes}
                </Text>
              </View>
              
              <View className="flex flex-row items-center gap-1.5">
                {/* <Text className="text-lg text-[#78716c]">💬</Text> */}
                <FontAwesome family='regular' name='comment' size={16} />
                <Text className="text-sm text-[#78716c]">{comments.length}</Text>
              </View>
              
              <View className="flex flex-row items-center gap-1.5 ml-auto">
                {/* <Text className="text-lg text-[#78716c]">🔗</Text> */}
                <IconFont name='share' size={30} color='black' />
              </View>
            </View>
          </Card>

          {/* Comments Section */}
          <View className="mb-6">
            <Text className="text-[#292524] mb-4 block font-medium">评论 ({comments.length})</Text>
            
            <View className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-4 bg-[#ffffff]">
                  {/* Comment */}
                  <View className="flex flex-row gap-3">
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <View className="flex-1">
                      <View className="flex flex-row items-center gap-2 mb-1">
                        <Text className="text-[#292524]">{comment.author.name}</Text>
                        <Text className="text-[#78716c] text-xs">{comment.time}</Text>
                      </View>
                      
                      <Text className="text-[#292524] mb-2 leading-relaxed block">{comment.content}</Text>
                      
                      {/* Comment Images */}
                      {comment.photos.length > 0 && (
                        <View className="grid grid-cols-3 gap-2 mb-2">
                          {comment.photos.map((photo, index) => (
                            <View
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden"
                              onClick={() => handleImageClick(comment.photos, index)}
                            >
                              <ImageWithFallback
                                src={photo}
                                alt={`评论图片 ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </View>
                          ))}
                        </View>
                      )}
                      
                      <View className="flex flex-row items-center gap-4 mt-2">
                        <View
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex flex-row items-center gap-1"
                        >
                          {/* <Text className={`text-sm ${comment.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                            ❤️
                          </Text> */}
                          <FontAwesome family={post.liked ? 'solid': 'regular'} name='heart' size={16} color={post.liked ? 'orange' : 'black'} />
                          <Text className={`text-sm ${comment.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                            {comment.likes}
                          </Text>
                        </View>
                        
                        <View
                          onClick={() => setReplyingTo({ commentId: comment.id })}
                        >
                          <Text className="text-[#78716c] text-sm">回复</Text>
                        </View>
                        
                        {comment.replies.length > 0 && (
                          <View
                            onClick={() => handleToggleReplies(comment.id)}
                            className="flex flex-row items-center gap-1"
                          >
                            {comment.showReplies ? (
                              <>
                                {/* <Text className="text-[#ff8c42] text-sm">🔼</Text> */}
                                <IconFont name='chevron-up' size={30} color='#ff8c42' />
                                <Text className="text-[#ff8c42] text-sm">收起回复</Text>
                              </>
                            ) : (
                              <>
                                {/* <Text className="text-[#ff8c42] text-sm">🔽</Text> */}
                                <IconFont name='chevron-down' size={30} color='#ff8c42' />
                                <Text className="text-[#ff8c42] text-sm">{comment.replies.length} 条回复</Text>
                              </>
                            )}
                          </View>
                        )}
                      </View>
                      
                      {/* Replies */}
                      {comment.showReplies && comment.replies.length > 0 && (
                        <View className="mt-4 pl-4 border-l-2 border-[rgba(0,0,0,0.08)] space-y-3">
                          {comment.replies.map((reply) => (
                            <View key={reply.id} className="flex flex-row gap-3">
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage src={reply.author.avatar} />
                                <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                              </Avatar>
                              
                              <View className="flex-1">
                                <View className="flex flex-row items-center gap-2 mb-1 flex-wrap">
                                  <Text className="text-[#292524] text-sm">{reply.author.name}</Text>
                                  {reply.replyTo && (
                                    <>
                                      <Text className="text-[#78716c] text-xs">回复</Text>
                                      <Text className="text-[#ff8c42] text-sm">@{reply.replyTo}</Text>
                                    </>
                                  )}
                                  <Text className="text-[#78716c] text-xs">{reply.time}</Text>
                                </View>
                                
                                <Text className="text-[#292524] text-sm mb-2 leading-relaxed block">{reply.content}</Text>
                                
                                {/* Reply Images */}
                                {reply.photos.length > 0 && (
                                  <View className="grid grid-cols-3 gap-2 mb-2">
                                    {reply.photos.map((photo, index) => (
                                      <View
                                        key={index}
                                        className="relative aspect-square rounded-lg overflow-hidden"
                                        onClick={() => handleImageClick(reply.photos, index)}
                                      >
                                        <ImageWithFallback
                                          src={photo}
                                          alt={`回复图片 ${index + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </View>
                                    ))}
                                  </View>
                                )}
                                
                                <View className="flex flex-row items-center gap-4 mt-1">
                                  <View
                                    onClick={() => handleLikeReply(comment.id, reply.id)}
                                    className="flex flex-row items-center gap-1"
                                  >
                                    {/* <Text className={`text-xs ${reply.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                                      ❤️
                                    </Text> */}
                                    <FontAwesome family={post.liked ? 'solid': 'regular'} name='heart' size={16} color={post.liked ? 'orange' : 'black'} />
                                    <Text className={`text-xs ${reply.liked ? 'text-[#ff8c42]' : 'text-[#78716c]'}`}>
                                      {reply.likes}
                                    </Text>
                                  </View>
                                  
                                  <View
                                    onClick={() => setReplyingTo({ commentId: comment.id, userName: reply.author.name })}
                                  >
                                    <Text className="text-[#78716c] text-xs">回复</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Comment Input - Fixed at bottom */}
      <View className="fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t border-[rgba(0,0,0,0.08)] p-4 pb-6 z-50">
        {replyingTo && (
          <View className="flex flex-row items-center justify-between mb-2 px-2">
            <Text className="text-sm text-[#78716c]">
              {replyingTo.userName ? `回复 @${replyingTo.userName}` : '回复评论'}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="h-6 text-xs"
            >
              取消
            </Button>
          </View>
        )}
        <View className="flex flex-row gap-2 max-w-lg mx-auto">
          <Textarea
            placeholder={replyingTo ? '写下你的回复...' : '写下你的评论...'}
            value={newComment}
            onInput={(e) => setNewComment(e.detail.value)}
            // 注意：Taro Textarea 属性可能需要根据你的自定义组件调整
            autoHeight
            className="flex-1 bg-[#fafaf9] rounded-lg p-2"
          />
          <Button
            size="icon"
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="flex-shrink-0 bg-gradient-to-r from-[#ff8c42] to-[#f59e0b] hover:from-[#ff8c42]/90 hover:to-[#f59e0b]/90 flex items-center justify-center w-10 h-10 rounded-full"
          >
            {/* <Text className="text-[#ffffff]">📤</Text> */}
            <FontAwesome family='solid' name='paper-plane' size={20}/>
          </Button>
        </View>
      </View>
    </View>
  );
}