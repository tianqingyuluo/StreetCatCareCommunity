import * as React from "react";
import { View } from "@tarojs/components";
import { Check } from "lucide-react-taro"; // 推荐使用 lucide-react-taro
import { cn } from "./utils";
import IconFont from "@/icons";

interface CheckboxProps {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  ...props
}: CheckboxProps) {
  // 1. 处理受控与非受控模式
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  // 2. 点击处理
  const handleClick = (e: any) => {
    if (disabled) return;
    
    // 阻止事件冒泡，防止触发父级点击（例如在 Label 中使用时）
    e.stopPropagation();

    const newChecked = !isChecked;
    
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    
    onCheckedChange?.(newChecked);
  };

  return (
    <View
      // 模拟 button 行为
      role="checkbox"
      aria-checked={isChecked}
      onClick={handleClick}
      className={cn(
        // --- 基础样式 ---
        "flex items-center justify-center border shrink-0 rounded-[4px] size-4 shadow-xs transition-shadow outline-none",
        
        // --- 未选中状态 (对应 bg-input-background) ---
        !isChecked && "bg-input-background dark:bg-input/30 border-input",

        // --- 选中状态 (对应 data-[state=checked]) ---
        isChecked && "bg-primary text-primary-foreground border-primary",

        // --- 禁用状态 ---
        disabled && "cursor-not-allowed opacity-50",

        // --- 错误状态 (可选，如果需要支持 aria-invalid) ---
        // "aria-invalid:ring-destructive/20 ...", 

        className
      )}
      {...props}
    >
      {/* 只有选中时才渲染图标 */}
      {isChecked && (
        <View className="flex items-center justify-center text-current">
          {/* <Check className="size-3.5" strokeWidth={3} />  */}
          <IconFont name="check" size={25} />
          {/* strokeWidth={3} 让小图标在移动端看起来更清晰 */}
        </View>
      )}
    </View>
  );
}

export { Checkbox };