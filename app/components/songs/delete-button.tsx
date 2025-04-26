import { ReactNode } from "react";
import ConfirmButton from "../confirm-button";

export function DeleteButton({
  id,
  children,
  isOverride,
  asChild = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  isOverride?: boolean;
  asChild?: boolean;
}) {
  return (
    <ConfirmButton
      variant="destructive"
      message={
        <>
          Czy na pewno chcesz usunąć{" "}
          {isOverride ? "własną wersję pieśni" : "pieśń"}?
          {isOverride && <div>Zostanie ona zastąpiona wersją oficjalną.</div>}
        </>
      }
      action={`/dashboard/songs/${id}/destroy`}
      actionButtonLabel="Usuń"
      asChild={asChild}
    >
      {children}
    </ConfirmButton>
  );
}
