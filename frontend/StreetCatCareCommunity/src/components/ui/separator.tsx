import { View } from '@tarojs/components';
import * as React from 'react';

import { cn } from './utils';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  [key: string]: any; // 兼容其他传递给 View 的属性
}

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps) {
  // Taro 中使用 className 而不是 class
  return (
    <View
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };