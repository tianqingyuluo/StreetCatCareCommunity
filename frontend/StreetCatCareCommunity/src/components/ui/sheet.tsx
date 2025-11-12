"use client";

import React from "react";
import { View, Text } from "@tarojs/components";
import { cn } from "./utils";

type Side = "top" | "right" | "bottom" | "left";

type SheetContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  side: Side;
  closeOnOverlayClick: boolean;
  transitionMs: number;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetCtx() {
  const ctx = React.useContext(SheetContext);
  if (!ctx) {
    throw new Error("Sheet components must be used inside <Sheet>.");
  }
  return ctx;
}

type SheetProps = {
  children?: React.ReactNode;
  open?: boolean; // 受控
  defaultOpen?: boolean; // 非受控
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  closeOnOverlayClick?: boolean;
  transitionMs?: number; // 过渡时长，默认 300ms
};

export function Sheet({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  side = "right",
  closeOnOverlayClick = true,
  transitionMs = 300,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  );
  const isControlled = typeof openProp === "boolean";
  const open = isControlled ? (openProp as boolean) : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const ctx: SheetContextValue = {
    open,
    setOpen,
    side,
    closeOnOverlayClick,
    transitionMs,
  };

  return (
    <SheetContext.Provider value={ctx}>
      <View data-slot="sheet">{children}</View>
    </SheetContext.Provider>
  );
}

type SlotProps = {
  className?: string;
  children?: React.ReactNode;
};

// 触发器：点击打开
export function SheetTrigger({ className, children }: SlotProps) {
  const { setOpen } = useSheetCtx();
  return (
    <View
      data-slot="sheet-trigger"
      className={className}
      onClick={() => setOpen(true)}
    >
      {children}
    </View>
  );
}

// 关闭按钮：点击关闭
export function SheetClose({ className, children }: SlotProps) {
  const { setOpen } = useSheetCtx();
  return (
    <View
      data-slot="sheet-close"
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
    >
      {children ?? <Text>×</Text>}
    </View>
  );
}

type SheetContentProps = SlotProps & {
  side?: Side; // 可覆盖外层设置
  overlayClassName?: string;
  contentClassName?: string;
  // 是否渲染关闭按钮（右上角 ×）
  showClose?: boolean;
};

// 过渡状态处理：打开时挂载，关闭时延迟卸载以完成动画
function usePresence(open: boolean, ms: number) {
  const [mounted, setMounted] = React.useState(open);
  const [visible, setVisible] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      // 等下一帧再置为可见，确保有过渡
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), ms);
      return () => clearTimeout(t);
    }
  }, [open, ms]);

  return { mounted, visible };
}

export function SheetContent({
  className,
  children,
  side: sideOverride,
  overlayClassName,
  contentClassName,
  showClose = true,
}: SheetContentProps) {
  const {
    open,
    setOpen,
    side: sideCtx,
    closeOnOverlayClick,
    transitionMs,
  } = useSheetCtx();

  const side = sideOverride ?? sideCtx;
  const { mounted, visible } = usePresence(open, transitionMs);

  if (!mounted) return null;

  // 基础样式
  const basePanel =
    "fixed z-[500] bg-background flex flex-col shadow-lg transition-transform ease-in-out";
  const baseOverlay =
    "fixed inset-0 z-[400] bg-black/50 transition-opacity ease-in-out";

  // 方向 & 尺寸
  const sideClass =
    side === "right"
      ? "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm"
      : side === "left"
      ? "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm"
      : side === "top"
      ? "inset-x-0 top-0 w-full"
      : "inset-x-0 bottom-0 w-full";

  // 入/出场的 transform
  const transformClass =
    side === "right"
      ? visible
        ? "translate-x-0"
        : "translate-x-full"
      : side === "left"
      ? visible
        ? "translate-x-0"
        : "-translate-x-full"
      : side === "top"
      ? visible
        ? "translate-y-0"
        : "-translate-y-full"
      : visible
      ? "translate-y-0"
      : "translate-y-full";

  // 边框
  const borderClass =
    side === "right"
      ? "border-l"
      : side === "left"
      ? "border-r"
      : side === "top"
      ? "border-b"
      : "border-t";

  return (
    <View data-slot="sheet-portal">
      {/* Overlay */}
      <View
        data-slot="sheet-overlay"
        catchMove
        className={cn(
          baseOverlay,
          visible ? "opacity-100" : "opacity-0",
          // 过渡时长
          `[transition-duration:${transitionMs}ms]`,
          overlayClassName,
        )}
        onClick={() => {
          if (closeOnOverlayClick) setOpen(false);
        }}
      />

      {/* Panel */}
      <View
        data-slot="sheet-content"
        catchMove
        className={cn(
          basePanel,
          sideClass,
          borderClass,
          `[transition-duration:${transitionMs}ms]`,
          transformClass,
          // 高度：左右滑出用全高；上下滑出内容自适应
          side === "left" || side === "right" ? "h-full" : "h-auto",
          className,
          contentClassName,
        )}
        // 防止点 panel 触发 overlay 的关闭
        onClick={(e) => e.stopPropagation()}
      >
        {showClose && (
          <View className="absolute right-3 top-3 z-[510] rounded-xs opacity-70 transition-opacity hover:opacity-100">
            <SheetClose className="px-2 py-1">
              <Text className="text-base">×</Text>
            </SheetClose>
          </View>
        )}
        {children}
      </View>
    </View>
  );
}

export function SheetHeader({ className, children }: SlotProps) {
  return (
    <View data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4", className)}>
      {children}
    </View>
  );
}

export function SheetFooter({ className, children }: SlotProps) {
  return (
    <View data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)}>
      {children}
    </View>
  );
}

export function SheetTitle({ className, children }: SlotProps) {
  return (
    <Text
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold text-base", className)}
    >
      {children}
    </Text>
  );
}

export function SheetDescription({ className, children }: SlotProps) {
  return (
    <Text
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
    >
      {children}
    </Text>
  );
}