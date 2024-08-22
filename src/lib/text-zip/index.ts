import { SelectedFile } from "@/_types/file-picker";
import { TTextureFormat } from "@/_types/text-zip/formats";
import { convert2v0 } from "@/lib/text-zip/v0/convert";
import { convert2v1 } from "@/lib/text-zip/v1/convert";

export const convert2textZip = async (
  files: SelectedFile[],
  version: number,
  format: TTextureFormat,
): Promise<string[]> => {
  if (version === 1) {
    return await convert2v1(files, format);
  }
  return await convert2v0(files);
};
