import { useState } from "react";
import { Button } from "../ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "../ui/sheet";
import SlidesPreview from "./slides-preview";
import FontSizeSlider from "./font-size-slider";

export default function PreviewButton({
  lyricsRef,
}: {
  lyricsRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const [lyrics, setLyrics] = useState("");
  const [fontSize, setFontSize] = useState<number | undefined>(undefined);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setLyrics(lyricsRef.current?.value ?? "")}
        >
          Podgląd
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-[366px] duration-1000">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Podgląd slajdów</SheetTitle>
        </SheetHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <FontSizeSlider value={fontSize} onChange={setFontSize} />
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {lyrics && fontSize && (
            <SlidesPreview lyrics={lyrics} fontSize={fontSize} ratio="16:9" />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
