import request from '@/utils/request';

// 0. 菜单首页（需登录）
export const getHome = () => {
  return request({
    url: '/menu/home', // 接口路径（对应文档中“菜单管理 [菜单首页]”）
    method: 'get',
  });
};
