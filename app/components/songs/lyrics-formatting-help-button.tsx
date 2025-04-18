import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "../ui/sheet";

import { HelpCircleIcon } from "lucide-react";
// import { TooltipContent, TooltipTrigger, Tooltip } from "../ui/tooltip";

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

        <ul className="list-disc list-inside">
          {/* <li>Zwrotki pieśni rozdzielamy pustą linią.</li>
          <li>Aby stworzyć powtarzany refren, wstaw na początku [ref]</li>
          <li>Aby wstawić refren, wpisz %ref</li>
          <li>
            Możesz definiować dowolne powtarzające się fragmenty, wstawiając
            inne słowo zamiast ref
          </li>
          <li>Żeby pominać zwrotkę, wstaw na jej początku dwa ukośniki: //</li> */}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
