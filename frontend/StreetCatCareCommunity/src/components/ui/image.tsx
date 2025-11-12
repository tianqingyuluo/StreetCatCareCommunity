import { useState } from 'react'
import { View, Image } from '@tarojs/components'
import type { ImageProps } from '@tarojs/components'

const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: ImageProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  // 从 props 中剔除不存在的 alt 属性
  const { src, style, className, ...rest } = props

  return didError ? (
    <View
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <View className="flex items-center justify-center w-full h-full">
        {/* 小程序 Image 无需 alt，错误图标本身已表达含义 */}
        <Image 
          src={ERROR_IMG_SRC} 
          {...rest} 
          data-original-url={src} 
        />
      </View>
    </View>
  ) : (
    <Image 
      src={src} 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError} 
    />
  )
}