import {file2canvas} from "./file2canvas";

export const files2canvases = async (
  files: FileList | File[],
): Promise<{canvas: HTMLCanvasElement, fileName: string}[]> => {
  return (await Promise.all(Array.from(files).map<Promise<{canvas: HTMLCanvasElement, fileName: string}[]>>(async (file) => {
    try{
      const canvases = await file2canvas(file);
      if (Array.isArray(canvases)) {
        return canvases.map((canvas) => ({canvas, fileName: `${file.name} (${canvases.indexOf(canvas) + 1})`}));
      }
      return [{canvas: canvases, fileName: file.name}];
    }catch (e) {
      console.error(e);
      return [];
    }
  }))).flat();
};
