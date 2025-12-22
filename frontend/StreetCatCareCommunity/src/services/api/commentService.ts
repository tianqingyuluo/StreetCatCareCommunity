import { request } from '@/services/request';
import * as API from '@/types/api';

/**
 * 发布评论
 * Scope: 小程序端 /comments (POST)
 */
export const createComment = async (data: API.CreateCommentReq): Promise<API.CommentResp> => {
  const response = await request.post<API.CommentResp>('/comments', data);
  return response;
};

/**
 * 获取评论列表
 * Scope: 小程序端 /comments (GET)
 */
export const getComments = async (params: { targetType: API.TargetType; targetId: string }): Promise<API.Page<API.CommentResp>> => {
  const response = await request.get<API.Page<API.CommentResp>>('/comments',  params );
  return response;
};

/**
 * 批量删除评论
 * Scope: 小程序端 /comments/delete
 */
export const deleteComments = async (commentIds: string[]): Promise<void> => {
  await request.post('/comments/delete', commentIds);
};