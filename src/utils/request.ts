// request.js
import axios from 'axios';
import { ElMessage } from 'element-plus';
export const baseURL = '/api/v1';
const instance = axios.create({baseURL});
import router from "../router/index.js";
import { useUserStore } from "@/store/userStore";

// 添加响应拦截器
instance.interceptors.response.use(
    result => {
        return Promise.resolve(result.data);
    },
    error => {
        // 处理错误情况
        let message = '未知错误';
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = error.response.data ||'认证失败';
                    router.push('/login');
                    break;
                case 403:
                    message = error.response.data||'拒绝访问';
                    break;
                case 404:
                    message = error.response.data||'请求地址错误';
                    break;
                case 500:
                    message = error.response.data|| '服务器故障' ;
                    break;
                default:
                    message = error.response.data||'网络错误';
            }
        } else {
            message = '网络连接异常';
        }
        ElMessage.error(message);
        return Promise.reject(error);
    }
);


// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    if (token && tokenExpiresAt) {
      const now = Date.now();
      if (now < parseInt(tokenExpiresAt)) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Token 已过期，可以在这里处理刷新 token 或提示用户重新登录
        ElMessage.warning('登录已过期，请重新登录！');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiresAt');
        window.location.href = '/login'; // 跳转到登录页面
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;