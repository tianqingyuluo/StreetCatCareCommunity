import { switchTab } from "@tarojs/taro";

export const tabRoutes = {
    home: '/pages/index/index', // 首页
    cats: '/pages/cats/cats', // 领养页面
    community: '/pages/community/community', // 社区页面
    user: '/pages/user/user', // 个人页面
}

export const navigateToTab = (tab: string) => {
    const url = tabRoutes[tab as keyof typeof tabRoutes];
    if (url) {
        switchTab({ url });
    }
}