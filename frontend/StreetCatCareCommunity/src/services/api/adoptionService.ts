import { request } from '@/services/request';
import * as API from '@/types/api';

/**
 * 提交领养申请
 * Scope: 小程序端 /adoptions (POST)
 */
export const createAdoption = async (data: API.AdoptionReq): Promise<API.AdoptionResp> => {
  const response = await request.post<API.AdoptionResp>('/adoptions', data);
  return response;
};

/**
 * 获取领养申请列表
 * Scope: 小程序端 /adoptions (GET)
 */
export const getAdoptions = async (params?: API.AdoptionListReq): Promise<API.AdoptionResp[]> => {
  const response = await request.get<API.AdoptionResp[]>('/adoptions', { params });
  return response;
};

/**
 * 获取领养详情
 * Scope: 小程序端 /adoptions/{id} (GET)
 */
export const getAdoptionDetail = async (id: string): Promise<API.AdoptionResp> => {
  const response = await request.get<API.AdoptionResp>(`/adoptions/${id}`);
  return response;
};

/**
 * 更新领养状态
 * Scope: 小程序端 /adoptions/{id}/status (PATCH)
 */
export const updateAdoptionStatus = async (id: string, data: { status: API.AdoptionStatus; reviewNote?: string; reviewDate?: string }): Promise<string> => {
  const response = await request.patch<string>(`/adoptions/${id}/status`, data);
  return response;
};