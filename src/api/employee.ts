// src/api/user.js（用户管理模块）
import request from '@/utils/request';

// 3. 员工管理
// 3.1 建立员工档案
export const createEmployee = (data) => {
  return request({
    url: '/staffs', // 接口路径（对应文档中“用户管理 [建立员工档案]”）
    method: 'post',
    data 
    /*{
    "userId": 0,
    "shelterId": 0,
    "realName": "string",
    "phone": "string",
    "email": "string",
    "hiredAt": "2025-10-16"
}*/
  });
};

// 3.2 当前员工信息
export const getCurrentEmployee = () => {
  return request({
    url: `/staffs/${staffId}`, // 接口路径（对应文档中“用户管理 [当前员工信息]”）`, // 接口路径（对应文档中“用户管理 [当前员工信息]”）
    method: 'get',
  });
};

// 3.3 变更在职状态
export const updateEmployeeStatus = (data) => {
  return request({
    url: `/staffs/${data.staffId}/status`, // 接口路径（对应文档中“用户管理 [变更在职状态]”）
    method: 'put',
    data 
    /*{
    {
    "hireStatus": "ONBOARD"
}
}*/
  });
};

// 3.4 移除员工
export const removeEmployee = (staffId) => {
  return request({
    url: `/staffs/${staffId}`, // 接口路径（对应文档中“用户管理 [移除员工]”）
    method: 'delete',
  });
};

// 3.5 获取员工列表
export const getStaffList = (params) => {
  return request({
    url: '/staffs', // 接口路径（对应文档中“用户管理 [获取员工列表]”）
    method: 'get',
    params,
  });
};
