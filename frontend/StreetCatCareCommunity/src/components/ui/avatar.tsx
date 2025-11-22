import * as React from "react";
import { View, Image } from "@tarojs/components";
import { cn } from "./utils";

// 创建上下文来处理图片加载错误状态
const AvatarContext = React.createContext<{
  hasError: boolean;
  setHasError: (value: boolean) => void;
}>({
  hasError: false,
  setHasError: () => {},
});

function Avatar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <AvatarContext.Provider value={{ hasError, setHasError }}>
      <View
        className={cn(
          // size-10 -> w-10 h-10
          "relative flex w-10 h-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
}

function AvatarImage({
  className,
  src,
  ...props
}: React.ComponentProps<typeof Image>) {
  const { hasError, setHasError } = React.useContext(AvatarContext);

  return (
    <Image
      src={src}
      mode="aspectFill"
      onError={() => setHasError(true)}
      className={cn(
        "aspect-square w-full h-full absolute inset-0 z-10", // 绝对定位覆盖在 Fallback 上
        hasError ? "hidden" : "block", // 出错时隐藏
        className
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  // Fallback 始终渲染，位于 Image 下方
  // 当 Image 加载成功时被遮挡，加载失败时 Image 隐藏从而显示 Fallback
  return (
    <View
      className={cn(
        // bg-muted -> bg-[#f5f5f4]
        "bg-[#f5f5f4] flex w-full h-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };