export default defineAppConfig({
  pages: [
    'pages/login/login',
    'pages/index/index',
    'pages/shelters/shelters',
    'pages/shelterDetails/shelterDetails',
    'pages/cats/cats',
    'pages/catDetails/catDetails',
    'pages/community/community',
    'pages/postDetails/postDetails',
    'pages/user/user',
  ],
  tabBar: {
    selectedColor: "#ff8c42",
    list: [
      {   
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "assets/icons/home.png",
        "selectedIconPath": "assets/icons/home-active.png"
      },
      {
        "pagePath": "pages/shelters/shelters",
        "text": "救助站",
        "iconPath": "assets/icons/shelters.png",
        "selectedIconPath": "assets/icons/shelters-active.png"
      },
      {
        "pagePath": "pages/community/community",
        "text": "社区",
        "iconPath": "assets/icons/community.png",
        "selectedIconPath": "assets/icons/community-active.png"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的",
        "iconPath": "assets/icons/user.png",
        "selectedIconPath": "assets/icons/user-active.png"
      },
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
