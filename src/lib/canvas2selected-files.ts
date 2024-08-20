import {SelectedFile} from "@/_types/file-picker";

export const canvas2selectedFile = (
  file: File,
  canvas: HTMLCanvasElement,
): SelectedFile => ({
  id: crypto.randomUUID(),
  fileName: file.name,
  canvas: canvas,
});
