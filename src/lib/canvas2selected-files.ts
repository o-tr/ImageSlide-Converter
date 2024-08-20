import {SelectedFile} from "@/_types/file-picker";

export const canvas2selectedFile = (
  fileName: string,
  canvas: HTMLCanvasElement,
): SelectedFile => ({
  id: crypto.randomUUID(),
  fileName,
  canvas,
});
