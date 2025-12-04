import React, { createContext, useContext } from "react";
import { View, Text } from "@tarojs/components";
import { cn } from "./utils"; 

// 创建 Context 来管理开关状态
const AlertDialogContext = createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

const AlertDialog = ({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <AlertDialogContext.Provider
      value={{ open: !!open, onOpenChange: onOpenChange || (() => {}) }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
};

const AlertDialogTrigger = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const { onOpenChange } = useContext(AlertDialogContext);
  
  return (
    <View
      onClick={(e) => {
        e.stopPropagation();
        onOpenChange(true);
      }}
      {...props}
    >
      {children}
    </View>
  );
};

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const AlertDialogOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  const { open, onOpenChange } = useContext(AlertDialogContext);
  
  if (!open) return null;

  return (
    <View
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-200",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
};

const AlertDialogContent = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => {
  const { open } = useContext(AlertDialogContext);

  if (!open) return null;

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <View
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[rgba(0,0,0,0.08)] bg-[#ffffff] p-6 shadow-lg duration-200 rounded-2xl w-[90%]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      />
    </AlertDialogPortal>
  );
};

const AlertDialogHeader = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);

const AlertDialogFooter = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
      className
    )}
    {...props}
  />
);

const AlertDialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => (
  <Text
    className={cn("text-lg font-semibold text-[#262626]", className)}
    {...props}
  />
);

const AlertDialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => (
  <Text
    className={cn("text-sm text-[#78716c]", className)}
    {...props}
  />
);

// 基础按钮样式，用于替代 buttonVariants
const baseButtonClass = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-10 px-4 py-2";

const AlertDialogAction = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof View> & { onClick?: () => void }) => {
  const { onOpenChange } = useContext(AlertDialogContext);
  
  return (
    <View
      // 这里直接写死 Primary 按钮样式：bg-[#ff8c42] text-white
      className={cn(baseButtonClass, "bg-[#ff8c42] text-white hover:opacity-90", className)}
      onClick={(e) => {
        if (onClick) onClick();
        onOpenChange(false);
      }}
      {...props}
    />
  );
};

const AlertDialogCancel = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof View> & { onClick?: () => void }) => {
  const { onOpenChange } = useContext(AlertDialogContext);

  return (
    <View
      // 这里直接写死 Outline 按钮样式
      className={cn(baseButtonClass, "border border-[rgba(0,0,0,0.08)] bg-[#ffffff] hover:bg-[#f5f5f4] text-black mt-2 sm:mt-0", className)}
      onClick={(e) => {
        if (onClick) onClick();
        onOpenChange(false);
      }}
      {...props}
    />
  );
};

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};