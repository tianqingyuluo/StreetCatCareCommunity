import * as React from "react";
import { Textarea as TaroTextarea } from "@tarojs/components";
import type { TextareaProps } from "@tarojs/components/types/Textarea";
import { cn } from "./utils";

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <TaroTextarea
      // 设置最大长度为 -1 (无限制)，否则小程序默认为 140 字符
      maxlength={-1}
      // 高度自适应
      autoHeight
      placeholderClass="text-muted-foreground"
      className={cn(
        "flex min-h-16 w-full rounded-md border border-input bg-input-background px-3 py-2 text-base",
        "text-foreground ring-offset-background transition-[color,box-shadow]",
        "focus:border-ring focus:ring-ring/50 focus:outline-none focus:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "dark:bg-input/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };