import * as React from "react";

import { cn } from "~/lib/utils";

type CardProps<T extends keyof JSX.IntrinsicElements = "div"> = {
  tagName?: T;
} & React.HTMLAttributes<
  T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement
>;

function CardInner<T extends keyof JSX.IntrinsicElements = "div">(
  { className, tagName, ...props }: CardProps<T>,
  ref: React.ForwardedRef<
    T extends keyof HTMLElementTagNameMap
      ? HTMLElementTagNameMap[T]
      : HTMLElement
  >,
) {
  const Tag = tagName || "div";
  return React.createElement(Tag, {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className,
    ),
    ...props,
  });
}

const CardComponent = React.forwardRef(CardInner);
CardComponent.displayName = "Card";

const Card = CardComponent as <T extends keyof JSX.IntrinsicElements = "div">(
  props: CardProps<T> & {
    ref?: React.ForwardedRef<
      T extends keyof HTMLElementTagNameMap
        ? HTMLElementTagNameMap[T]
        : HTMLElement
    >;
  },
) => React.ReactElement;

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
