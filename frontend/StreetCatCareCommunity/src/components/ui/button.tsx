import * as React from 'react';
import { View } from '@tarojs/components';

import { cn } from './utils';

export function Button({ className, children, ...props }: React.ComponentProps<typeof View>) {
    return (
        <View className={
        cn("w-20 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/20 active:bg-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-colors duration-200 ease-in-out cursor-pointer"
        , className)}
        {...props}>
            {children}
        </View>
    )
}