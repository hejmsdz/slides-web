import { cn } from "~/lib/utils";

export default function FormItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col w-full gap-1.5 mb-4", className)}>
      {children}
    </div>
  );
}
