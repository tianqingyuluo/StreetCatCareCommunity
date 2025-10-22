import * as React from "react";
import { View, Text } from "@tarojs/components";

import { cn } from "./utils";

function Card({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "flex flex-col items-start gap-1.5 px-6 pt-6 pb-4",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-sm text-gray-500 mt-1", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "flex justify-end items-center gap-2 px-6 pt-2",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      className={cn("flex items-center px-6 pb-6 pt-4 border-t border-gray-100", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
