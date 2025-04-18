import { useState, useEffect } from "react";
import { PDFDocumentProxy, getDocument } from "~/components/pdf/pdf.client";

export default function usePdfDocument(src: string) {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);

  useEffect(() => {
    getDocument(src).promise.then(setPdfDocument);
  }, [src]);

  return pdfDocument;
}
