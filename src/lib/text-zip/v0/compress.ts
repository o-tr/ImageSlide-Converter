import JSZip from "jszip";
import { ManifestV0, RawImageObj } from "@/_types/text-zip/v0";
import { FileSizeLimit } from "@/const/convert";

export const compressFile = async (
  data: RawImageObj[],
  count = 1,
): Promise<string[]> => {
  const partCount = Math.ceil(data.length / count);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const part = data.slice(i * partCount, (i + 1) * partCount);
    const metadata: ManifestV0 = [];
    const partZip = new JSZip();
    for (const item of part) {
      partZip.file(`${item.index}.rawimage`, item.buffer);
      metadata.push({
        path: `${item.index}.rawimage`,
        rect: item.rect,
      });
    }
    partZip.file("metadata.json", JSON.stringify(metadata));
    const base64 = await partZip.generateAsync({
      type: "base64",
    });
    if (base64.length > FileSizeLimit) {
      return compressFile(data, count + 1);
    }
    result.push(base64);
  }
  return result;
};
