import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ConfirmButton from "../confirm-button";

export function DeleteAccountCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuń konto</CardTitle>
        <CardDescription>
          Jeśli usuniesz konto, bezpowrotnie stracisz dostęp do swojego zespołu
          i wszystkich zapisanych w nim pieśni.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConfirmButton
          message="Czy na pewno chcesz usunąć swoje konto?"
          action="/dashboard/account/destroy"
          actionButtonLabel="Usuń konto"
        >
          Usuń konto
        </ConfirmButton>
      </CardContent>
    </Card>
  );
}
