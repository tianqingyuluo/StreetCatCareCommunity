// src/components/RadioGroup/index.tsx
import * as React from "react";
import { Radio, RadioGroup as TaroRadioGroup } from "@tarojs/components";
import { cn } from "./utils"; // 确保你的 cn 工具函数路径正确

// 创建一个Context来传递RadioGroup的value
const RadioGroupContext = React.createContext<{
  value?: string;
  onChange?: (e: any) => void;
}>({});

// RadioGroup 组件属性类型，基于 Taro 的 RadioGroupProps
type RadioGroupProps = React.ComponentProps<typeof TaroRadioGroup> & {
  className?: string;
  value?: string;
  onChange?: (e: any) => void;
};

// RadioGroupItem 组件属性类型，基于 Taro 的 RadioProps
type RadioGroupItemProps = React.ComponentProps<typeof Radio> & {
  className?: string;
  value: string | number;
};

/**
 * 自定义 RadioGroup 容器组件
 * @param props 组件属性
 * @returns Taro RadioGroup 组件
 */
function RadioGroup({ className, children, value, onChange, ...props }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onChange }}>
      <TaroRadioGroup
        className={cn("flex flex-col gap-3", className)} // 使用 flex 布局模拟 grid gap
        onChange={onChange}
        {...props}
      >
        {children}
      </TaroRadioGroup>
    </RadioGroupContext.Provider>
  );
}

/**
 * 自定义 Radio 选项组件
 * @param props 组件属性
 * @returns Taro Radio 组件
 */
function RadioGroupItem({ className, value, children, ...props }: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const isChecked = context.value === String(value);
  
  return (
    <Radio
      value={String(value)}
      checked={isChecked}
      className={cn(
        "flex items-center gap-2", // 使 radio 和文字垂直居中并留有间隙
        className,
      )}
      {...props}
    >
      {children}
    </Radio>
  );
}

export { RadioGroup, RadioGroupItem };
