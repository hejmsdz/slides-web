import { memo, useEffect, useRef } from "react";
import { type PDFDocumentProxy } from "./pdf.client";

type SlideProps = {
  pdfDocument: PDFDocumentProxy;
  pageNumber: number;
  renderWidth: number;
  className?: string;
};

const Slide = memo(
  ({ pdfDocument, pageNumber, renderWidth, className }: SlideProps) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const isRenderingRef = useRef<boolean>(false);

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
          const scale = (renderWidth / width) * window.devicePixelRatio;
          const viewport = page.getViewport({ scale });

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: ctx,
            viewport,
          }).promise;
        } finally {
          isRenderingRef.current = false;
        }
      })();
    }, [pageNumber, pdfDocument, renderWidth]);

    return (
      <canvas className={className} style={{ width: renderWidth }} ref={ref} />
    );
  },
);

Slide.displayName = "Slide";

export default Slide;
