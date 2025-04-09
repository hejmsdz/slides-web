import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Form } from "@remix-run/react";

export function DeleteButton({
  id,
  children,
  className,
  isOverride,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  isOverride?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={className}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Potwierdź</AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              Czy na pewno chcesz usunąć{" "}
              {isOverride ? "własną wersję pieśni" : "pieśń"}?
            </p>
            {isOverride && <p>Zostanie ona zastąpiona wersją oficjalną.</p>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <Form method="post" action={`/dashboard/songs/${id}/destroy`}>
            <AlertDialogAction type="submit">Usuń</AlertDialogAction>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
