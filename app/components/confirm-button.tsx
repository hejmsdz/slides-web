import Form from "~/components/form";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialog,
} from "./ui/alert-dialog";
import { Button, ButtonProps, buttonVariants } from "./ui/button";
import { cn } from "~/lib/utils";

type ConfirmButtonProps = {
  children: React.ReactNode;
  message: React.ReactNode;
  actionButtonLabel: React.ReactNode;
  variant?: ButtonProps["variant"];
  className?: ButtonProps["className"];
  action: string;
  asChild?: boolean;
};

export default function ConfirmButton({
  children,
  message,
  actionButtonLabel,
  variant = "ghost",
  className,
  action,
  asChild = false,
}: ConfirmButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {asChild ? (
          children
        ) : (
          <Button variant={variant} className={className}>
            {children}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Potwierdź</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <Form method="post" action={action} className="flex">
            <AlertDialogAction asChild>
              <Button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "destructive" }),
                  "flex-1",
                )}
              >
                {actionButtonLabel}
              </Button>
            </AlertDialogAction>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
