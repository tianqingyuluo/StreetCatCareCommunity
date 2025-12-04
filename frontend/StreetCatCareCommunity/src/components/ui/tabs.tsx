import * as React from "react";
import { View } from "@tarojs/components";
import { type ViewProps } from "@tarojs/components/types/View";
import { cn } from "./utils"; // 假设你的 utils 路径一致

// 1. 创建 Context 用于跨组件通信
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}
const TabsContext = React.createContext<TabsContextValue | null>(null);

// --- Tabs Root ---
interface TabsProps extends Omit<ViewProps, "className"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  // 处理受控和非受控模式
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? ""
  );
  
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <View className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

// --- Tabs List ---
function TabsList({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px]",
        className
      )}
      {...props}
    />
  );
}

// --- Tabs Trigger ---
interface TabsTriggerProps extends ViewProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

function TabsTrigger({
  className,
  value,
  disabled = false,
  children,
  onClick,
  ...props
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const isActive = context.value === value;

  // 处理点击事件
  const handleClick = (e: any) => {
    if (!disabled) {
      context.onValueChange(value);
      onClick?.(e);
    }
  };

  return (
    <View
      onClick={handleClick}
      className={cn(
        // 基础样式
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]",
        // 禁用样式
        disabled && "pointer-events-none opacity-50",
        // 激活状态样式 (替代原 data-[state=active] 选择器)
        isActive
          ? "bg-card text-[#ff8c42] shadow-sm dark:border-input dark:bg-input/30 dark:text-foreground"
          : "text-muted-foreground hover:text-foreground", // 非激活状态
        // SVG 图标样式适配
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

// --- Tabs Content ---
interface TabsContentProps extends ViewProps {
  value: string;
  children?: React.ReactNode;
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  // 如果不是当前选中的 tab，不渲染内容
  if (context.value !== value) {
    return null;
  }

  return (
    <View
      className={cn("flex-1 outline-none mt-2", className)}
      {...props}
    >
      {children}
    </View>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };