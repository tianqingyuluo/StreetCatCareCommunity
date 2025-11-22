import { Text, Image, Button } from '@tarojs/components'
import { useLoad, reLaunch, getCurrentInstance } from '@tarojs/taro'
import { useState } from 'react'
import { FontAwesome } from 'taro-icons'
import { useNavigationStore } from '@/stores/navigationStore'
import { tabRoutes } from '@/utils/navRouteMap'
import { login as apiLogin } from '@/api/loginService'
import { loginRequest, loginResponse } from '@/apiTypes/apiTypes'

import Taro from '@tarojs/taro'
import './login.scss'

import cover from '../../../public/cover.jpg'

export default function Index () {
  const [code, setCode] = useState('')
  const { activeTab, showBottomNav, changeTab, setShowBottomNav } = useNavigationStore()

  // 页面监听路由变化
  useLoad(() => {
    console.log('Page loaded.')
    const instance = getCurrentInstance()
    if (instance?.router) {
      const currentRoute = instance.router.path
      const shouldShowNav = Object.values(tabRoutes).includes(currentRoute)
      setShowBottomNav(shouldShowNav)
      console.log('Current route:', currentRoute, 'Show bottom nav:', shouldShowNav)
    }
  })

  const login = () => Taro.login({
    success: function (res) {
      setCode(res.code || '')
      
      const loginData: loginRequest = {
        code: res.code || ''
      }
      apiLogin(loginData).then((res: loginResponse) => {
        console.log(res)
      })
      
      console.log('登录成功！' + res.code)
      reLaunch({ url: '/pages/index/index' })
    }
  })
  

  return (
    <Image src={cover} className='absolute inset-0 w-full h-full object-cover'>
      <Button onClick={login} className='fixed inset-0 m-auto w-44 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 rounded-full text-white font-medium transition-all duration-150 shadow-lg flex items-center justify-center'>
        <FontAwesome family='brands' name='weixin' color="white"></FontAwesome><Text className='pl-2 font-sans'>微信登录</Text>
        </Button>
    </Image>

  )
}
