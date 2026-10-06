import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialog,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export default function AutoFormatInfo({
  open,
  onAccept,
  onClose,
}: {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Automatyczne formatowanie</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-2">
              Ta funkcja wykorzystuje generatywną sztuczną inteligencję
              do&nbsp;poprawienia podziału na&nbsp;zwrotki, interpunkcji,
              wielkich liter i oznaczenia powtarzających się fragmentów.
            </p>
            <p className="mb-2">
              Zawartość pola „Tekst” zostanie w tym celu przesłana do OpenAI.
            </p>
            <p className="mb-2">
              Przed zapisaniem zmienionej wersji upewnij się, że nie pojawiły
              się w&nbsp;niej błędy.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="button" onClick={onAccept}>
              Kontynuuj
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
