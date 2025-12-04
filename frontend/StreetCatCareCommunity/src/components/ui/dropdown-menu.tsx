import React, { useState, useContext, createContext } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/icons"; // 按照要求引入图标组件
import { cn } from "./utils";

// 1. 创建 Context 管理开关状态
const DropdownMenuContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

// 2. Root 组件
const DropdownMenu = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <View className="relative inline-block" {...props}>
        {children}
      </View>
    </DropdownMenuContext.Provider>
  );
};

// 3. Trigger 组件
const DropdownMenuTrigger = ({
  children,
  asChild,
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
}) => {
  const { setOpen } = useContext(DropdownMenuContext);

  return (
    <View
      onClick={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
      {...props}
    >
      {children}
    </View>
  );
};

// Portal 在小程序中不需要，直接返回 children 即可（通过 CSS fixed 定位）
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// 4. Content 组件 (核心修改：改为 Fixed 遮罩 + 弹窗)
const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  children,
  ...props
}: {
  className?: string;
  sideOffset?: number;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const { open, setOpen } = useContext(DropdownMenuContext);

  if (!open) return null;

  return (
    <View className="z-50">
      {/* 遮罩层 - 点击关闭 */}
      <View
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
      />
      
      {/* 菜单内容 - 这里为了适配移动端体验，模拟为居中弹窗或底部弹窗 */}
      {/* 如果需要严格跟随按钮位置，需要使用 Taro.createSelectorQuery，实现较复杂。 */}
      {/* 这里采用居中显示，类似 AlertDialog，保证功能可用性 */}
      <View
        className={cn(
          "fixed left-[50%] top-[50%] z-50 min-w-[8rem] w-[200px] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-md border border-[rgba(0,0,0,0.08)] bg-[#ffffff] p-1 shadow-md text-[#262626]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </View>
    </View>
  );
};

// Group 组件
const DropdownMenuGroup = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return <View {...props}>{children}</View>;
};

// 5. Item 组件
const DropdownMenuItem = ({
  className,
  inset,
  variant = "default",
  children,
  onClick,
  ...props
}: {
  className?: string;
  inset?: boolean;
  variant?: "default" | "destructive";
  children: React.ReactNode;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const { setOpen } = useContext(DropdownMenuContext);

  return (
    <View
      className={cn(
        "relative flex items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors active:bg-[#f5f5f4]", // active:bg 替代 focus:bg
        inset && "pl-8",
        variant === "destructive" 
          ? "text-[#d4183d] active:bg-[#d4183d]/10" 
          : "text-[#262626]",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
        setOpen(false); // 点击后关闭菜单
      }}
      {...props}
    >
      {children}
    </View>
  );
};

// CheckboxItem 组件
const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  [key: string]: any;
}) => {
  const { setOpen } = useContext(DropdownMenuContext);

  return (
    <View
      className={cn(
        "relative flex items-center gap-2 rounded-sm py-2 pr-2 pl-8 text-sm transition-colors active:bg-[#f5f5f4] text-[#262626]",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (onCheckedChange) onCheckedChange(!checked);
        // Checkbox 通常点击不关闭菜单，如果需要关闭请取消注释
        // setOpen(false); 
      }}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && (
          <IconFont name='check' size={16} color='#262626' />
        )}
      </View>
      {children}
    </View>
  );
};

// RadioGroup 组件
const DropdownMenuRadioGroup = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return <View {...props}>{children}</View>;
};

// RadioItem 组件
const DropdownMenuRadioItem = ({
  className,
  children,
  checked, // RadioItem 通常由父级 RadioGroup 控制，这里简化处理
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  checked?: boolean;
  [key: string]: any;
}) => {
  return (
    <View
      className={cn(
        "relative flex items-center gap-2 rounded-sm py-2 pr-2 pl-8 text-sm transition-colors active:bg-[#f5f5f4] text-[#262626]",
        className
      )}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && (
          <IconFont name='circle' size={8} color='#262626' />
        )}
      </View>
      {children}
    </View>
  );
};

// Label 组件
const DropdownMenuLabel = ({
  className,
  inset,
  children,
  ...props
}: {
  className?: string;
  inset?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return (
    <Text
      className={cn(
        "px-2 py-1.5 text-sm font-semibold text-[#262626] block",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </Text>
  );
};

// Separator 组件
const DropdownMenuSeparator = ({
  className,
  ...props
}: {
  className?: string;
  [key: string]: any;
}) => {
  return (
    <View
      className={cn("bg-[rgba(0,0,0,0.08)] -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
};

// Shortcut 组件
const DropdownMenuShortcut = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return (
    <Text
      className={cn(
        "ml-auto text-xs tracking-widest text-[#78716c]",
        className
      )}
      {...props}
    >
      {children}
    </Text>
  );
};

// Sub Menu 相关组件 (Taro 中多级菜单交互较复杂，这里做简化处理，仅渲染内容)
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: {
  className?: string;
  inset?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return (
    <View
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-2 text-sm outline-hidden select-none active:bg-[#f5f5f4]",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <View className="ml-auto">
        <IconFont name='chevron-right' size={16} color='#78716c' />
      </View>
    </View>
  );
};

const DropdownMenuSubContent = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  // 简化处理：在小程序中不建议做复杂的嵌套悬浮菜单，这里仅作为占位
  return <View className={className} {...props}>{children}</View>;
};

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};