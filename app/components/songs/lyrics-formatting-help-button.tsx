import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "../ui/sheet";
import { HelpCircleIcon } from "lucide-react";

export default function LyricsFormattingHelpButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type="button" className="rounded-full">
          <HelpCircleIcon className="w-4 h-4" />
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-[366px] duration-1000">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Instrukcja formatowania tekstu</SheetTitle>
        </SheetHeader>

        <ul className="list-disc list-inside flex flex-col gap-3">
          <li>
            Zwrotki pieśni rozdzielamy pustą linią. Każdy blok tekstu po pustej
            linii zostanie wyświetlony jako kolejny slajd.
          </li>
          <li>
            Aby stworzyć powtarzany refren, wstaw na początku bloku tekstu [ref]
          </li>
          <li>Aby wstawić później slajd z refrenem, wpisz %ref</li>
          <li>
            Możesz definiować dowolne powtarzające się fragmenty, wstawiając
            zamiast ref inne słowo, na przykład [1], [przedrefren], [bridge].
            Do&nbsp;każdego fragmentu możesz się później odwołać ze&nbsp;znakiem
            procenta, czyli np. %1, %przedrefren, %bridge.
          </li>
          <li>Żeby pominać zwrotkę, dopisz na jej początku dwa ukośniki: //</li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}
