import { memo, useEffect, useRef, useState } from "react";
import { type PDFDocumentProxy } from "./pdf.client";

type SlideProps = {
  pdfDocument: PDFDocumentProxy;
  pageNumber: number;
  renderWidth?: number;
  className?: string;
  ariaHidden?: boolean;
  backgroundColor: string;
};

const Slide = memo(
  ({
    pdfDocument,
    pageNumber,
    renderWidth,
    className,
    ariaHidden,
    backgroundColor = '#000000',
  }: SlideProps) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const isRenderingRef = useRef<boolean>(false);
    const [textContent, setTextContent] = useState<string>("");

    useEffect(() => {
      (async () => {
        if (isRenderingRef.current) {
          return;
        }

        isRenderingRef.current = true;

        try {
          const canvas = ref.current;
          const ctx = canvas?.getContext("2d");

          if (!canvas || !ctx) {
            return;
          }

          const page = await pdfDocument.getPage(pageNumber);
          const [, , width] = page.view;
          const scale =
            ((renderWidth ?? window.innerWidth) / width) *
            window.devicePixelRatio;
          const viewport = page.getViewport({ scale });

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: ctx,
            viewport,
          }).promise;

          setTextContent(
            (await page.getTextContent()).items
              .filter((item) => "str" in item)
              .map((item) => item.str)
              .join(" "),
          );
        } finally {
          isRenderingRef.current = false;
        }
      })();
    }, [pageNumber, pdfDocument, renderWidth]);

    return (
      <canvas
        className={className}
        style={{ width: renderWidth, backgroundColor }}
        ref={ref}
        role="img"
        aria-label={textContent}
        aria-hidden={ariaHidden}
      />
    );
  },
);

Slide.displayName = "Slide";

export default Slide;
