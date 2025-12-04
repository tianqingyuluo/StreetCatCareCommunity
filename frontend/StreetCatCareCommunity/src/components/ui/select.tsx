import * as React from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import IconFont from "../iconfont";
import { cn } from "./utils";

// --- Context ---
interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  registerLabel: (value: string, label: React.ReactNode) => void;
  getLabel: (value: string) => React.ReactNode;
}

const SelectContext = React.createContext<SelectContextValue>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  registerLabel: () => {},
  getLabel: () => null,
});

// --- Components ---
function Select({
  value: controlledValue,
  onValueChange,
  defaultValue,
  open: controlledOpen,
  onOpenChange,
  children,
  ...props
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({});

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
    setLabels((prev) => {
      if (prev[val] === label) return prev;
      return { ...prev, [val]: label };
    });
  }, []);

  const getLabel = React.useCallback((val: string) => labels[val] || val, [labels]);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen: handleOpenChange,
        registerLabel,
        getLabel,
      }}
    >
      <View className="relative w-full" {...props}>
        {children}
      </View>
    </SelectContext.Provider>
  );
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return <View className={cn("w-full", className)} {...props} />;
}

function SelectValue({
  className,
  placeholder,
  children,
  ...props
}: React.ComponentProps<typeof Text> & { placeholder?: string }) {
  const { value, getLabel } = React.useContext(SelectContext);
  const content = value ? getLabel(value) : (placeholder || children);

  return (
    <Text
      className={cn("pointer-events-none block truncate", className)}
      {...props}
    >
      {content}
    </Text>
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof View> & {
  size?: "sm" | "default";
}) {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <View
      onClick={() => setOpen(!open)}
      data-state={open ? "open" : "closed"}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md border border-[rgba(0,0,0,0.08)] bg-[#fafaf9] px-3 py-2 text-sm whitespace-nowrap shadow-sm ring-offset-[#fafaf9] transition-colors placeholder:text-[#78716c] focus:outline-none focus:ring-1 focus:ring-[#ff8c42] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        size === "default" && "h-9",
        size === "sm" && "h-8",
        className
      )}
      {...props}
    >
      {children}
      <IconFont name="chevron-down" size={30} />
    </View>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof View> & { position?: "popper" | "item-aligned" }) {
  const { open } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <View
      data-state={open ? "open" : "closed"}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-[rgba(0,0,0,0.08)] bg-[#ffffff] text-[#000000] shadow-md animate-in fade-in-0 zoom-in-95",
        position === "popper" && "top-[calc(100%+4px)] left-0 w-full",
        className
      )}
      {...props}
    >
      <ScrollView
        scrollY
        className="max-h-96 w-full"
      >
        <View className="p-1">{children}</View>
      </ScrollView>
    </View>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <View
      className={cn("px-2 py-1.5 text-xs font-semibold text-[#78716c]", className)}
      {...props}
    >
      <Text>{props.children}</Text>
    </View>
  );
}

function SelectItem({
  className,
  children,
  value: itemValue,
  ...props
}: React.ComponentProps<typeof View> & { value: string }) {
  const { value, onValueChange, setOpen, registerLabel } = React.useContext(SelectContext);
  const isSelected = value === itemValue;

  React.useEffect(() => {
    registerLabel(itemValue, children);
  }, [itemValue, children, registerLabel]);

  const handleTap = (e) => {
    e.stopPropagation();
    onValueChange(itemValue);
    setOpen(false);
  };

  return (
    <View
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-[#fef3c7] focus:text-[#92400e] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 active:bg-[#fef3c7]",
        isSelected && "bg-[#fef3c7]/50",
        className
      )}
      onClick={handleTap}
      data-state={isSelected ? "checked" : "unchecked"}
      {...props}
    >
      <Text className="flex-1">{children}</Text>
      
      {isSelected && (
        <View className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <IconFont name="check" size={25} />
        </View>
      )}
    </View>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn("-mx-1 my-1 h-px bg-[#f5f5f4]", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <IconFont name="chevron-up" />
    </View>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <IconFont name="chevron-up" />
    </View>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};