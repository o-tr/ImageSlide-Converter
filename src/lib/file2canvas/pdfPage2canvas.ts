import {PDFDocumentProxy} from "pdfjs-dist";

export const pdfPage2canvas = (pdf: PDFDocumentProxy, pageNumber: number) => {
  return pdf.getPage(pageNumber + 1).then(page => {
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas not found");
    }
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    return page.render({
      canvasContext: context,
      viewport: viewport
    }).promise.then(() => canvas);
  });
}
