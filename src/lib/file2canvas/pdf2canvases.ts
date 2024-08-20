import {readFile} from "@/lib/readFile";
import * as pdfjs from "pdfjs-dist";
import {pdfPage2canvas} from "./pdfPage2canvas";

export const pdf2canvases = async (file: File): Promise<HTMLCanvasElement[]> => {
  const fileData = await readFile(file);
  
  const pdf = await pdfjs.getDocument({
    data: fileData,
    cMapUrl: "/cmaps/",
    cMapPacked: true,
  }).promise;
  const total = pdf.numPages;
  
  return await Promise.all(Array.from({ length: total }, (_, i) => i).map(async (i) => {
    return await pdfPage2canvas(pdf, i);
  }));
}
