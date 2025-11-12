import { PropsWithChildren } from 'react'
import { useLaunch, getCurrentInstance } from '@tarojs/taro'
import { useNavigationStore } from './stores/navigationStore'

import './app.scss'
import 'taro-icons/scss/FontAwesome.scss'

const HIDE_BOTTOM_NAV_ROUTES = [
  'pages/login/login',
]

function App({ children }: PropsWithChildren<any>) {
  const { activeTab, showBottomNav, changeTab, setShowBottomNav } = useNavigationStore()

  useLaunch(() => {
    console.log('App launched.')
  })

  // 页面监听路由变化
  useLaunch( () => {
    const instance = getCurrentInstance()
    if (instance?.router) {
      const currentRoute = instance.router.path
      const shouldShowNav = !HIDE_BOTTOM_NAV_ROUTES.includes(currentRoute)
      setShowBottomNav(shouldShowNav)
      console.log('Current route:', currentRoute, 'Show bottom nav:', shouldShowNav)
    }
  })

  return (
    <>
      {children}
    </>

  )


  // children 是将要会渲染的页面
  // return children
}
  


export default App
