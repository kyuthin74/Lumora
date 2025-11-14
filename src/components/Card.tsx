
import * as React from "react";
import { View, Text } from "react-native";
function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

type ViewProps = React.ComponentProps<typeof View> & { className?: string };
type TextProps = React.ComponentProps<typeof Text> & { className?: string };

function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        // grid-related classes swapped for flex, but visual layout stays similar
        "flex flex-col items-start gap-1.5 px-6 pt-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn("leading-none text-base font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("self-start", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex items-center px-6 pb-6 pt-6", className)}
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
