import { request } from '@/services/request';
import * as API from '@/types/api';

/**
 * 标准化收藏响应数据
 * 将后端返回的字段名转换为前端期望的格式
 * @param response - 后端返回的原始响应数据
 * @returns 标准化后的响应数据
 */
function normalizeFavoriteResponse(response: any): API.Page<API.FavoriteResp> {
  // 处理空响应
  if (!response) {
    return { total: 0, records: [] };
  }

  // 处理缺少 records 字段
  if (!response.records) {
    return { ...response, records: [] };
  }

  // 标准化每条记录
  const normalizedRecords = response.records.map((record: any) => {
    try {
      // 标准化 targetType: "Cat" -> "CAT", "Post" -> "POST"
      const normalizedTargetType = record.targetType?.toUpperCase() || record.targetType;
      
      // 标准化嵌套对象字段名: Cat -> cat, Post -> post
      const normalizedRecord: any = {
        ...record,
        targetType: normalizedTargetType,
        cat: record.cat || record.Cat,
        post: record.post || record.Post,
      };

      // 清理大写字段，避免数据冗余
      delete normalizedRecord.Cat;
      delete normalizedRecord.Post;

      return normalizedRecord;
    } catch (error) {
      console.warn('标准化收藏记录失败:', record, error);
      return null;
    }
  }).filter(Boolean); // 过滤掉失败的记录

  return {
    ...response,
    records: normalizedRecords,
  };
}

/**
 * 添加收藏
 * Scope: 小程序端 /favorites (PATCH)
 */
export const addFavorite = async (data: API.FavoriteReq): Promise<void> => {
  await request.patch('/favorites', data);
};

/**
 * 取消收藏
 * Scope: 小程序端 /favorites (DELETE)
 * 注意：根据 openapi.json，参数在 body 中。
 */
export const removeFavorite = async (data: API.FavoriteReq): Promise<void> => {
  await request.delete('/favorites', { data });
};

/**
 * 获取我的收藏
 * Scope: 小程序端 /favorites/{targetType}
 * Truth: 后端实际路径为 /favorites/cats, /favorites/posts, /favorites/all
 * 这里根据 targetType 动态构建路径以适配后端真实路由
 */
export const getFavorites = async (targetType: 'cats' | 'posts' | 'all'): Promise<API.Page<API.FavoriteResp>> => {
  try {
    // 将前端参数映射到后端路径
    const pathMap = {
      cats: 'CAT',
      posts: 'POST',
      all: 'ALL',
    };

    const path = pathMap[targetType];
    const response = await request.get<API.Page<API.FavoriteResp>>(`/favorites/${path}`);
    
    // 标准化响应数据
    return normalizeFavoriteResponse(response);
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    throw new Error('获取收藏列表失败，请稍后重试');
  }
};