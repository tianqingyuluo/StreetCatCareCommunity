import { request } from '@/services/request';
import * as API from '@/types/api';

/**
 * 分页/筛选猫咪
 * Scope: 小程序端 /cats (GET)
 */
export const getCats = async (params?: API.CatListReq): Promise<API.Page<API.CatResp>> => {
  const response = await request.get<API.Page<API.CatResp>>('/cats',  params );
  console.log(response);
  return response;
};

/**
 * 获取猫咪详情
 * Scope: 小程序端 /cats/{id} (GET)
 */
export const getCatDetail = async (id: string): Promise<API.CatResp> => {
  const response = await request.get<API.CatResp>(`/cats/${id}`);
  return response;
};

/**
 * 新增猫咪
 * Scope: 小程序端 /cats (POST)
 * 注意：Body 类型在 openapi.json 中引用了 CatSaveReq，但在 paths 中定义为 string。
 * 这里使用 types/api.ts 中的 CatSaveReq 接口，因为它是更准确的结构化数据。
 */
export const createCat = async (data: any): Promise<API.CatResp> => {
  // data 类型应为 CatSaveReq，但在 types/api.ts 中未显式导出 CatSaveReq 接口作为入参类型
  // 建议在 types/api.ts 补充 CatSaveReq 定义，此处暂用 any 或根据 CatResp 推断
  const response = await request.post<API.CatResp>('/cats', data);
  return response;
};

/**
 * 修改猫咪信息
 * Scope: 小程序端 /cats/{id} (PUT)
 */
export const updateCat = async (id: string, data: any): Promise<API.CatResp> => {
  const response = await request.put<API.CatResp>(`/cats/${id}`, data);
  return response;
};

/**
 * 删除猫咪
 * Scope: 小程序端 /cats/{id} (DELETE)
 */
export const deleteCat = async (id: string): Promise<void> => {
  await request.delete(`/cats/${id}`);
};

/**
 * 修改猫咪状态
 * Scope: 小程序端 /cats/{id}/status (PATCH)
 */
export const updateCatStatus = async (id: string, status: API.CatStatus): Promise<void> => {
  await request.patch(`/cats/${id}/status`, { status }); // 假设 body 结构为 { status: string }
};