export default defineAppConfig({
  pages: [
    'pages/login/login',
    'pages/index/index',
    'pages/cats/cats',
    'pages/community/community',
    'pages/user/user',
    'pages/catDetails/catDetails'
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
        "pagePath": "pages/cats/cats",
        "text": "猫咪",
        "iconPath": "assets/icons/cats.png",
        "selectedIconPath": "assets/icons/cats-active.png"
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
