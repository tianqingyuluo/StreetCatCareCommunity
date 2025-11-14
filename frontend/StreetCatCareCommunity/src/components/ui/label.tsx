import * as React from "react";
import { Label as TaroLabel } from "@tarojs/components";
import { cn } from "./utils";

// Label 组件的属性类型
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

function Label({ htmlFor, children, className, ...props }: LabelProps) {
  return (
    <TaroLabel
      for={htmlFor}
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        className
      )}
      {...props}
    >
      {children}
    </TaroLabel>
  );
}

export { Label };