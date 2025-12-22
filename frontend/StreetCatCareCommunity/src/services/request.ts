// import axios from 'axios-miniprogram';
// import Taro from '@tarojs/taro';

// export const request = axios.create({
//   baseURL: 'http://localhost:8080/api/v1',
//   timeout: 10000,
// });

// // 请求拦截器：自动注入 Token
// request.interceptors.request.use((config) => {
//   const token = Taro.getStorageSync('token'); // 假设你登录后存到了这里
//   if (token) {
//     config.headers = {
//       ...config.headers,
//       'Authorization': `Bearer ${token}`
//     };
//   }
//   return config;
// });

// // 响应拦截器：统一处理错误
// request.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       Taro.reLaunch({ url: '/pages/login/login' });
//     }
//     return Promise.reject(err);
//   }
// );

import axios, { AxiosRequestConfig } from 'axios-miniprogram';
import Taro from '@tarojs/taro';

// 环境变量控制 Mock
const USE_MOCK = process.env.NODE_ENV === 'development';
const BASE_URL = process.env.TARO_APP_API || 'http://192.168.2.105:8080/api/v1';

export const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  
});

// 扩展 Axios 配置以支持 mockData
declare module 'axios-miniprogram' {
  interface AxiosRequestConfig {
    mockData?: any;
    skipMock?: boolean; // 某些接口强制不走 Mock
  }
}

request.interceptors.request.use((config) => {
  // 1. 注入 Token
  const token = Taro.getStorageSync('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // 2. Mock 拦截逻辑
  if (USE_MOCK && config.mockData && !config.skipMock) {
    console.log(`[Mock] Intercepted: ${config.url}`, config.mockData);
    
    // 使用 adapter 模拟响应
    config.adapter = async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        data: config.mockData, // 直接返回 Mock 数据，假设后端不包一层 code/msg，或者在这里包一层
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config,
        request: {}
      };
    };
  }

  return config;
});

request.interceptors.response.use(
  (response) => {
    // 假设后端直接返回数据对象，或者根据实际情况解包
    // 如果后端是 { code: 0, data: ... } 格式，在这里解包
    // 根据 openapi.json，很多接口直接返回对象，这里暂不统一解包，视具体接口而定
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      Taro.reLaunch({ url: '/pages/login/login' });
    }
    const msg = error.response?.data?.message || '网络请求失败';
    Taro.showToast({ title: msg, icon: 'none' });
    return Promise.reject(error);
  }
);