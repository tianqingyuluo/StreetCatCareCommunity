// src/api/user.js（用户管理模块）
import request from '@/utils/request';

// 1. 用户管理
// 1.1 web端登录
export const loginWeb = (data:any) => {
  return request({
    url: '/auth/login-web', // 接口路径（对应文档中“用户管理 [web端登录]”）
    method: 'post',
    data // { phone: string, password: string }
  });
};

// 1.2 创建账号（管理员操作）
export const createAccount = (data:any) => {
  return request({
    url: '/admin/create-account', // 接口路径（对应文档中“用户管理 [创建账号]”）
    method: 'post',
    data // {realName: string, phone: string, role: enum<string> }
  });
};


