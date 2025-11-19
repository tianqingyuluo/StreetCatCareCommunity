// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'; // 引入 Vue Router 类型

// 1. 定义路由元信息类型（可选，若路由有自定义 meta 字段需加）
interface RouteMeta {
  title: string; 
  requiresAuth?: boolean; 
}

// 2. 扩展 RouteRecordRaw 类型，添加自定义 meta 类型
declare module 'vue-router' {
  interface RouteMeta {
    meta?: RouteMeta;
  }
}

// 3. 定义路由数组（类型为 RouteRecordRaw[]）
const routes: RouteRecordRaw[] = [
  // 1. 默认跳转登录页
  {
    path: '/',
    redirect: '/login'
  },
  // 2. 登录页（无需登录）
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'), // 登录
    meta: { title: '登录', requiresAuth: false }
  },
  // 3. 菜单首页（需登录）
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/menu/Home.vue'),
    meta: { title: '菜单首页', requiresAuth: false } // 需要登录
  },
  // 4. 员工列表页（需登录）
  {
    path: '/staff-list',
    name: 'StaffList',
    component: () => import('@/views/staff/StaffList.vue'),
    meta: { title: '员工列表', requiresAuth: false } // 需要登录
  },
  // 5. 创建员工账号页（需登录）
  {
    path: '/create-account',
    name: 'StaffCreate',
    component: () => import('@/views/user/createWebAccount.vue'),
    meta: { title: '创建员工账号', requiresAuth: false } // 需要登录
  },
  // 3. 救护站列表页（需登录）
  {
    path: '/shelter-list',
    name: 'ShelterList',
    component: () => import('@/views/shelter/ShelterList.vue'),
    meta: { title: '救护站列表', requiresAuth: false } // 需要登录
  },
  // 3.1 救护站详情页（需登录）
  {
    path: '/shelters/:id',
    name: 'ShelterDetail',
    component: () => import('@/views/shelter/DetailInfo.vue'),
    meta: { title: '救护站详情', requiresAuth: false } // 需要登录
  },

  // 4. 猫咪列表页（需登录）
  {
    path: '/cat-list',
    name: 'CatList',
    component: () => import('@/views/cat/CatList.vue'),
    meta: { title: '猫咪列表', requiresAuth: false }
  }
];

// 4. 创建路由实例（指定历史模式和路由数组）
const router = createRouter({
  history: createWebHistory((import.meta.env.BASE_URL as string) || '/'),
  routes
});

// 5. 路由守卫（示例：登录拦截）
router.beforeEach((to, from, next) => {
  document.title = (to.meta?.title as string) || '流浪猫关爱社区';
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;