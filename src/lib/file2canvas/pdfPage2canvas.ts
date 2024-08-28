import { PDFDocumentProxy } from "pdfjs-dist";

export const pdfPage2canvas = async (
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<OffscreenCanvas> => {
  const page = await pdf.getPage(pageNumber + 1);
  const viewport = page.getViewport({ scale: 1 });
  const canvas = new OffscreenCanvas(viewport.width, viewport.height);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas not found");
  }
  await page.render({
    canvasContext: context as unknown as CanvasRenderingContext2D,
    viewport: viewport,
  }).promise;
  return canvas;
};
