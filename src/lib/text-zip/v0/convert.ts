import {SelectedFile} from "@/_types/file-picker";
import {canvas2rawImage} from "@/lib/canvas2rawImage";
import {compressFile} from "./compress";

export const convert2v0= async(files: SelectedFile[]): Promise<string[]> => {
  const _files = files.map((file, index) => {
    return {
      index,
      rect: {
        width: file.canvas.width,
        height: file.canvas.height,
      },
      buffer: Buffer.from(canvas2rawImage(file.canvas, "RGBA32")),
    };
  });
  return await compressFile(_files);
}
