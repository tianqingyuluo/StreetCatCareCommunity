// src/api/user.js（用户管理模块）
import request from '@/utils/request';

// 2. 救护站管理

// 2.1 获取救护站列表
export const getShelterList = () => {
  return request({
    url: '/shelters', // 接口路径（对应文档中“用户管理 [新建救护站]”）
    method: 'get',
  });
};

// 2.2 新建救护站
export const createShelter = (data) => {
  return request({
    url: '/shelters', // 接口路径（对应文档中“用户管理 [新建救护站]”）
    method: 'post',
    data 
/*{
    "name": "string",
    "contactPerson": "string",
    "phone": "string",
    "email": "string",
    "location": {
        "lat": 0,
        "lng": 0
    },
    "address": "string",
    "description": "string",
    "licenseNumber": "string",
    "staffId": "string"
}*/
  });
};

// 2.3 修改救护站信息
export const updateShelterInfo = (data) => {
  return request({
    url: `/shelters/${data.id}`, // 假设路径，需按实际文档调整
    method: 'put',
    data 
    /*
    {
    "name": "string",
    "contactPerson": "string",
    "phone": "string",
    "email": "string",
    "location": {
        "lat": 0,
        "lng": 0
    },
    "address": "string",
    "description": "string",
    "licenseNumber": "string",
    "staffId": "string"
}*/
  });
};

// 2.4 删除救护站
export const deleteShelter = (id) => {
  return request({
    url: `/shelters/${id}`, // 假设路径，需按实际文档调整
    method: 'delete',
  });
};