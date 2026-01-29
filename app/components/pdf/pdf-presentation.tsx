import { useEffect, useState, forwardRef } from "react";
import { cn } from "~/lib/utils";
import usePdfDocument from "~/hooks/use-pdf-document";
import Slide from "./slide";

type PdfPresentationProps = {
  src: string;
  page: number;
  backgroundColor: string;
} & React.HTMLAttributes<HTMLDivElement>;

type CanvasState = {
  activeCanvasIndex: number;
  firstCanvasPage: number;
  secondCanvasPage: number;
};

export default forwardRef<HTMLDivElement, PdfPresentationProps>(
  function PdfPresentation({ src, page, className, backgroundColor, ...rest }, ref) {
    const pdfDocument = usePdfDocument(src);

    const [
      { activeCanvasIndex, firstCanvasPage, secondCanvasPage },
      setCanvasState,
    ] = useState<CanvasState>({
      activeCanvasIndex: 0,
      firstCanvasPage: 0,
      secondCanvasPage: 0,
    });

    useEffect(() => {
      setCanvasState((prevState) => ({
        ...prevState,
        activeCanvasIndex: 1 - prevState.activeCanvasIndex,
        [prevState.activeCanvasIndex === 0
          ? "secondCanvasPage"
          : "firstCanvasPage"]: page,
      }));
    }, [page]);

    if (!pdfDocument) {
      return null;
    }

    const canvasClassName =
      "absolute object-contain w-full h-full transition-opacity duration-500";

    return (
      <div ref={ref} className={cn("w-screen h-screen", className)} {...rest}>
        {[firstCanvasPage, secondCanvasPage].map((pageNumber, index) => {
          const isActive = activeCanvasIndex === index;

          return (
            <Slide
              key={index}
              pdfDocument={pdfDocument}
              pageNumber={pageNumber}
              className={cn(
                canvasClassName,
                isActive ? "opacity-100" : "opacity-0",
              )}
              ariaHidden={!isActive}
              backgroundColor={backgroundColor}
            />
          );
        })}
      </div>
    );
  },
);
