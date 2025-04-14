import { useEffect, useState, useMemo } from "react";
import {
  getDocument,
  type PDFDocumentProxy,
} from "~/components/pdf/pdf.client";
import { cn } from "~/lib/utils";
import { formatLyrics } from "./typesetting";
import Slide from "~/components/pdf/slide";

export default function SlidesPreview({
  lyrics,
  fontSize,
  ratio,
}: {
  lyrics: string;
  fontSize: number;
  ratio: string;
}) {
  const [pdfDocument, setPdfDocument] = useState<
    PDFDocumentProxy | undefined
  >();

  const formattedLyrics = useMemo(() => formatLyrics(lyrics), [lyrics]);

  useEffect(() => {
    if (!formattedLyrics) {
      return;
    }

    (async () => {
      const { url } = await fetch("https://slajdy.swro.ch/v2/deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: "pdf",
          date: new Date().toISOString().slice(0, 10),
          ratio,
          fontSize,
          items: [
            {
              type: "TEXT",
              contents: formattedLyrics,
            },
          ],
        }),
      }).then((res) => res.json());
      const pdfDoc = await getDocument(url).promise;
      setPdfDocument(pdfDoc);
    })();

    return () => {
      if (pdfDocument) {
        pdfDocument.destroy().then(() => {
          setPdfDocument(undefined);
        });
      }
    };
  }, [formattedLyrics, fontSize, ratio]);

  return (
    <div className={cn("flex gap-1 flex-col items-center")}>
      {pdfDocument
        ? new Array(pdfDocument.numPages - 2)
            .fill(null)
            .map((_, i) => (
              <Slide
                key={i}
                pdfDocument={pdfDocument}
                pageNumber={i + 2}
                renderWidth={300}
              />
            ))
        : null}
    </div>
  );
}
