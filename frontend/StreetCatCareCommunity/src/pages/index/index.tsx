import { View, Text, Image, Button, Icon } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { FontAwesome } from 'taro-icons'

import Taro from '@tarojs/taro'
import './index.scss'

import cover from '../../../public/cover.jpg'

export default function Index () {
  const [code, setCode] = useState('')
  useLoad(() => {
    console.log('Page loaded.')
  })
  const login = () => Taro.login({
    success: function (res) {
      setCode(res.code || '')
      console.log('登录成功！' + res.code)
    }
  })
  

  return (
    <Image src={cover} className='absolute inset-0 w-full h-full object-cover'>
      <Button onClick={login} className='fixed inset-0 m-auto w-40 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 rounded-full text-white font-medium transition-all duration-150 shadow-lg flex items-center justify-center'>
        <FontAwesome family='brands' name='weixin' color="white"></FontAwesome><Text className='pl-2'>微信登录</Text>
        </Button>
    </Image>
  )
}
