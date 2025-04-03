import type {
  ETIFileV1,
  ETIFileV1CroppedPart,
  ETIManifestV1,
} from "@/_types/eti/v1";
import type { RawImageObjV1Cropped } from "@/_types/text-zip/v1";
import { FileSizeLimit } from "@/const/convert";
import { encode } from "@/lib/base64-rle-csv/encode";

export const compressETIv1 = async (
  data: RawImageObjV1Cropped[],
  count = 1,
  stepSize = 10,
): Promise<string[]> => {
  const partCount = Math.ceil(data.length / (count * stepSize)) * stepSize;
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const part = data.slice(i * partCount, (i + 1) * partCount);
    const compressedPart = await compressETIv1Part(part);

    if (compressedPart.length > FileSizeLimit) {
      return compressETIv1(data, count + 1);
    }

    result.push(compressedPart);
  }

  return result;
};

const compressETIv1Part = async (data: RawImageObjV1Cropped[]) => {
  const usedFormats = new Set<string>();
  const files: ETIFileV1[] = [];
  const buffer: string[] = [];
  let bufferLength = 0;

  for (const image of data) {
    if (!image.cropped) {
      const base64 = encode(image.buffer.toString("base64"));
      buffer.push(base64);
      usedFormats.add(image.format);
      files.push({
        t: "m",
        n: `${image.index}`,
        f: image.format,
        w: image.rect.width,
        h: image.rect.height,
        e: image.note ? { note: image.note } : undefined,
        s: bufferLength,
        l: base64.length,
      });
      bufferLength += base64.length;
      continue;
    }
    const parts: ETIFileV1CroppedPart[] = [];

    for (const rect of image.cropped.rects) {
      const base64 = encode(rect.buffer.toString("base64"));
      buffer.push(base64);
      usedFormats.add(image.format);
      parts.push({
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height,
        s: bufferLength,
        l: base64.length,
      });
      bufferLength += base64.length;
    }
    files.push({
      t: "c",
      n: `${image.index}`,
      f: image.format,
      w: image.rect.width,
      h: image.rect.height,
      e: image.note ? { note: image.note } : undefined,
      r: parts,
    });
  }

  const manifest: ETIManifestV1 = {
    t: "eti",
    c: "base64-rle-csv",
    v: 1,
    f: Array.from(usedFormats).map((format) => `Format:${format}`),
    e: ["note"],
    i: files,
  };

  return `ETI^${JSON.stringify(manifest)}$${buffer.join("")}`;
};
