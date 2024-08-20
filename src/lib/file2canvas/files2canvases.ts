import {file2canvas} from "./file2canvas";

export const files2canvases = async (
  files: FileList,
): Promise<{canvas: HTMLCanvasElement, file: File}[]> => {
  return (await Promise.all(Array.from(files).map<Promise<{canvas: HTMLCanvasElement, file: File}[]>>(async (file) => {
    try{
      const canvases = await file2canvas(file);
      if (Array.isArray(canvases)) {
        return canvases.map((canvas) => ({canvas, file}));
      }
      return [{canvas: canvases, file}];
    }catch (e) {
      console.error(e);
      return [];
    }
  }))).flat();
};
