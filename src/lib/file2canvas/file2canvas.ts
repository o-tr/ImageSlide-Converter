import {img2canvas} from "./img2canvas";
import {pdf2canvases} from "@/lib/file2canvas/pdf2canvases";

export const file2canvas = async (
  file: File,
): Promise<HTMLCanvasElement|HTMLCanvasElement[]> => {
  if (file.type.startsWith("image/")) {
    return await img2canvas(file, false);
  }
  if (file.type.startsWith("application/pdf")) {
    return await pdf2canvases(file);
  }
  throw new Error("Unsupported file type");
};
