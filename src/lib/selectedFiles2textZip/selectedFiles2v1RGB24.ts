import type { SelectedFile } from "@/_types/file-picker";
import type { RawImageObjV1 } from "@/_types/text-zip/v1";
import { canvas2rgb24 } from "@/lib/canvas2rawImage/canvas2rgb24";
import { compressFileV1 } from "@/lib/text-zip/v1/compress";

export const selectedFiles2v1RGB24 = async (
  selectedFiles: SelectedFile[],
): Promise<string[]> => {
  const rawImages = selectedFiles.map<RawImageObjV1>((file, index) => ({
    index,
    rect: {
      width: file.canvas.width,
      height: file.canvas.height,
    },
    format: "RGB24",
    note: file.note,
    buffer: Buffer.from(canvas2rgb24(file.canvas)),
  }));
  return await compressFileV1(rawImages);
};
