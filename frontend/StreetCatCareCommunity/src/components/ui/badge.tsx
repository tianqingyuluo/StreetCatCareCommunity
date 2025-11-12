import * as React from "react";
import { View, Text } from "@tarojs/components";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 gap-1 transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-white",
        outline: "text-foreground border border-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps
  extends React.ComponentProps<typeof View>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  children,
  ...props
}: BadgeProps) {
  return (
    <View
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </View>
  );
}

export { Badge, badgeVariants };