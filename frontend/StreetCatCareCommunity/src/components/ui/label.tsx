// src/components/Label/index.tsx
import * as React from "react";
import { Label as TaroLabel } from "@tarojs/components";
import { cn } from "./utils";

// Label 组件的属性类型
// 我们模拟一个类似 Radix UI Label 的接口
type LabelProps = {
  /**
   * 与 label 关联的表单元素的 ID
   */
  htmlFor?: string;
  /**
   * 子内容
   */
  children: React.ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 其他传递给底层 Text 组件的属性
   */
  [key: string]: any;
};

/**
 * 一个简单的 Label 组件，用于关联表单元素。
 * 在小程序中，主要通过 `htmlFor` 属性与表单组件的 `id` 关联。
 */
function Label({ htmlFor, children, className, ...props }: LabelProps) {
  return (
    <TaroLabel
      // 在小程序中，for 属性通常写作 htmlFor
      for={htmlFor}
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        // Radix UI 的 group-data-* 和 peer-* 是 CSS 选择器，在 Taro 中需要手动实现或简化
        // 这里我们移除了这些依赖，如果需要，可以通过父组件的状态来控制
        className
      )}
      {...props}
    >
      {children}
    </TaroLabel>
  );
}

export { Label };