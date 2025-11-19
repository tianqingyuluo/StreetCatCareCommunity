// src/api/user.js（用户管理模块）
import request from '@/utils/request';
// 2.1 获取救护站列表
import { getShelterList as mockGetShelterList } from '../mock/shelter';
import { getShelterDetail as mockShelterDetail } from '../mock/shelter';

// 全局标志：是否使用 Mock 数据
const useMockData = false;
// 根据标志动态选择数据源
// 在 shelter.ts API 文件中
export const getShelterList = (params?: any) => {
  return request.get('/shelters', { params });
};

// 2.2 新建救护站
export const createShelter = (data: any) => {
  return request({
    url: '/shelters', 
    method: 'post',
    data 
  });
};

// 2.3 修改救护站信息
export const updateShelterInfo = (data: any) => {
  return request({
    url: `/shelters/${data.id}`, 
    method: 'put',
    data 
  });
};

// 2.4 删除救护站
export const deleteShelter = (id: any) => {
  return request({
    url: `/shelters/${id}`, 
    method: 'delete',
  });
};

// 2.5 获取单个救护站详细信息
export const getShelterDetail = (id: string) => {
  return useMockData ? mockShelterDetail(id) : request({
    url: `/shelters/${id}`, 
    method: 'get',
  });
}

