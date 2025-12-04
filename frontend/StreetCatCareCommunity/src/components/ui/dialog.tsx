// import * as React from "react";
// import { View, Text, RootPortal } from "@tarojs/components";
// import { cn } from "./utils";
// import IconFont from "@/icons";

// // --- Context ---
// interface DialogContextValue {
//   open: boolean;
//   setOpen: (open: boolean) => void;
// }

// const DialogContext = React.createContext<DialogContextValue | null>(null);

// // --- Dialog Root ---
// interface DialogProps {
//   open?: boolean;
//   defaultOpen?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   children: React.ReactNode;
// }

// function Dialog({
//   open: controlledOpen,
//   defaultOpen = false,
//   onOpenChange,
//   children,
// }: DialogProps) {
//   const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

//   const isControlled = controlledOpen !== undefined;
//   const open = isControlled ? controlledOpen : uncontrolledOpen;

//   const setOpen = React.useCallback(
//     (newOpen: boolean) => {
//       if (!isControlled) {
//         setUncontrolledOpen(newOpen);
//       }
//       onOpenChange?.(newOpen);
//     },
//     [isControlled, onOpenChange]
//   );

//   return (
//     <DialogContext.Provider value={{ open, setOpen }}>
//       {children}
//     </DialogContext.Provider>
//   );
// }

// // --- Dialog Trigger ---
// function DialogTrigger({
//   className,
//   children,
//   asChild, // Taro 中通常忽略 asChild，直接渲染 View
//   ...props
// }: React.ComponentProps<typeof View> & { asChild?: boolean }) {
//   const context = React.useContext(DialogContext);

//   return (
//     <View
//       className={className}
//       onClick={(e) => {
//         e.stopPropagation();
//         context?.setOpen(true);
//         props.onClick?.(e);
//       }}
//       {...props}
//     >
//       {children}
//     </View>
//   );
// }

// // --- Dialog Portal ---
// // 使用 Taro 的 RootPortal 将内容渲染到页面根节点
// function DialogPortal({ children }: { children: React.ReactNode }) {
//   const context = React.useContext(DialogContext);

//   // 如果未打开，直接不渲染 Portal 内容
//   if (!context?.open) return null;

//   return <RootPortal>{children}</RootPortal>;
// }

// // --- Dialog Overlay ---
// function DialogOverlay({ className, ...props }: React.ComponentProps<typeof View>) {
//   const context = React.useContext(DialogContext);

//   return (
//     <View
//       // 点击遮罩关闭
//       onClick={() => context?.setOpen(false)}
//       className={cn(
//         "fixed inset-0 z-50 bg-black/80 transition-opacity duration-200",
//         // 简单的进场动画类名模拟
//         "animate-in fade-in-0",
//         className
//       )}
//       // 阻止触摸穿透 (简单处理)
//       catchMove
//       {...props}
//     />
//   );
// }

// // --- Dialog Content ---
// function DialogContent({
//   className,
//   children,
//   ...props
// }: React.ComponentProps<typeof View>) {
//   const context = React.useContext(DialogContext);

//   return (
//     <DialogPortal>
//       <DialogOverlay />
//       <View
//         className={cn(
//           // 定位与基础样式
//           "fixed left-[50%] top-[50%] z-50 grid w-[90%] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg",
//           // 动画样式
//           "animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]",
//           className
//         )}
//         // 阻止点击内容区域时触发 Overlay 的关闭事件
//         onClick={(e) => e.stopPropagation()}
//         {...props}
//       >
//         {children}
        
//         {/* 右上角关闭按钮 */}
//         <View
//           onClick={() => context?.setOpen(false)}
//           className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
//         >
//           <IconFont name="x" size={25} />
//           <Text className="sr-only">Close</Text>
//         </View>
//       </View>
//     </DialogPortal>
//   );
// }

// // --- Dialog Header ---
// function DialogHeader({ className, ...props }: React.ComponentProps<typeof View>) {
//   return (
//     <View
//       className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
//       {...props}
//     />
//   );
// }

// // --- Dialog Footer ---
// function DialogFooter({ className, ...props }: React.ComponentProps<typeof View>) {
//   return (
//     <View
//       className={cn(
//         "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// // --- Dialog Title ---
// function DialogTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
//   return (
//     <Text
//       className={cn("text-lg font-semibold leading-none tracking-tight", className)}
//       {...props}
//     />
//   );
// }

// // --- Dialog Description ---
// function DialogDescription({
//   className,
//   ...props
// }: React.ComponentProps<typeof Text>) {
//   return (
//     <Text
//       className={cn("text-sm text-muted-foreground", className)}
//       {...props}
//     />
//   );
// }

// // --- Dialog Close (自定义关闭按钮) ---
// function DialogClose({
//   className,
//   children,
//   ...props
// }: React.ComponentProps<typeof View>) {
//   const context = React.useContext(DialogContext);
  
//   return (
//     <View
//       onClick={(e) => {
//         context?.setOpen(false);
//         props.onClick?.(e);
//       }}
//       className={className}
//       {...props}
//     >
//       {children}
//     </View>
//   );
// }

// export {
//   Dialog,
//   DialogPortal,
//   DialogOverlay,
//   DialogTrigger,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
//   DialogDescription,
// };

import * as React from "react";
import { View, Text, RootPortal } from "@tarojs/components";
import { cn } from "./utils";
import IconFont from "@/icons";

// --- Context ---
interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

// --- Dialog Root ---
interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

// --- Dialog Trigger ---
function DialogTrigger({
  className,
  children,
  asChild,
  ...props
}: React.ComponentProps<typeof View> & { asChild?: boolean }) {
  const context = React.useContext(DialogContext);

  return (
    <View
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        context?.setOpen(true);
        props.onClick?.(e);
      }}
      {...props}
    >
      {children}
    </View>
  );
}

// --- Dialog Portal ---
function DialogPortal({ children }: { children: React.ReactNode }) {
  const context = React.useContext(DialogContext);

  if (!context?.open) return null;

  return <RootPortal>{children}</RootPortal>;
}

// --- Dialog Overlay ---
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof View>) {
  const context = React.useContext(DialogContext);

  return (
    <View
      onClick={() => context?.setOpen(false)}
      className={cn(
        // bg-black/80 是 Tailwind 原生支持的，不需要替换变量，如果需要完全自定义可改为 bg-[rgba(0,0,0,0.8)]
        "fixed inset-0 z-50 bg-black/80 transition-opacity duration-200",
        "animate-in fade-in-0",
        className
      )}
      catchMove
      {...props}
    />
  );
}

// --- Dialog Content ---
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  const context = React.useContext(DialogContext);

  return (
    <DialogPortal>
      <DialogOverlay />
      <View
        className={cn(
          // 替换了 border 和 bg-background
          // border 保持原有边框宽度，border-[rgba...] 设置颜色，bg-[#fafaf9] 设置背景
          "fixed left-[50%] top-[50%] z-50 grid w-[90%] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[rgba(0,0,0,0.08)] bg-[#fafaf9] p-6 shadow-lg duration-200 rounded-lg",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        
        {/* 右上角关闭按钮 */}
        <View
          onClick={() => context?.setOpen(false)}
          // 替换了 data-[state=open]:bg-accent 和 data-[state=open]:text-muted-foreground
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-[#fef3c7] data-[state=open]:text-[#78716c]"
        >
          <IconFont name="x" size={25} />
          <Text className="sr-only">Close</Text>
        </View>
      </View>
    </DialogPortal>
  );
}

// --- Dialog Header ---
function DialogHeader({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
}

// --- Dialog Footer ---
function DialogFooter({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

// --- Dialog Title ---
function DialogTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

// --- Dialog Description ---
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      // 替换了 text-muted-foreground
      className={cn("text-sm text-[#78716c]", className)}
      {...props}
    />
  );
}

// --- Dialog Close ---
function DialogClose({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  const context = React.useContext(DialogContext);
  
  return (
    <View
      onClick={(e) => {
        context?.setOpen(false);
        props.onClick?.(e);
      }}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};