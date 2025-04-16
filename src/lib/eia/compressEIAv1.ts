import type {
  EIAFileV1,
  EIAFileV1CroppedPart as EIAFileV1CroppedPart,
  EIAManifestV1 as EIAManifestV1,
} from "@/_types/eia/v1";
import type { RawImageObjV1Cropped } from "@/_types/text-zip/v1";
import { FileSizeLimit } from "@/const/convert";
import { LZW } from "@/lib/lzw";

export const compressEIAv1 = async (
  data: RawImageObjV1Cropped[],
  count = 1,
  stepSize = 10,
): Promise<Buffer[]> => {
  const partCount = Math.ceil(data.length / (count * stepSize)) * stepSize;
  const result: Buffer[] = [];

  for (let i = 0; i < count; i++) {
    const part = data.slice(i * partCount, (i + 1) * partCount);
    const compressedPart = await compressEIAv1Part(part);

    if (compressedPart.length > FileSizeLimit) {
      return compressEIAv1(data, count + 1);
    }

    result.push(compressedPart);
  }

  return result;
};

const compressEIAv1Part = async (data: RawImageObjV1Cropped[]) => {
  const usedFormats = new Set<string>();
  const files: EIAFileV1[] = [];
  const buffer: Buffer[] = [];
  let bufferLength = 0;

  for (const image of data) {
    if (!image.cropped) {
      const compressed = Buffer.from(LZW.compress(image.buffer));
      buffer.push(compressed);
      usedFormats.add(image.format);
      files.push({
        t: "m",
        n: `${image.index}`,
        f: image.format,
        w: image.rect.width,
        h: image.rect.height,
        e: image.note ? { note: image.note } : undefined,
        s: bufferLength,
        l: compressed.length,
      });
      bufferLength += compressed.length;
      continue;
    }
    let fileBufferLength = 0;
    const fileBuffer: Buffer[] = [];
    const parts: EIAFileV1CroppedPart[] = [];

    for (const rect of image.cropped.rects) {
      fileBuffer.push(rect.buffer);
      usedFormats.add(image.format);
      parts.push({
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height,
        s: fileBufferLength,
        l: rect.buffer.length,
      });
      fileBufferLength += rect.buffer.length;
    }
    
    const mergedBuffer = Buffer.concat(fileBuffer);
    const compressed = Buffer.from(LZW.compress(mergedBuffer));
    buffer.push(compressed);
    
    files.push({
      t: "c",
      b: `${image.cropped.baseIndex}`,
      n: `${image.index}`,
      f: image.format,
      w: image.rect.width,
      h: image.rect.height,
      s: bufferLength,
      l: compressed.length,
      e: image.note ? { note: image.note } : undefined,
      r: parts,
    });
    bufferLength += compressed.length;
  }

  const manifest: EIAManifestV1 = {
    t: "eia",
    c: "lzw",
    v: 1,
    f: Array.from(usedFormats).map((format) => `Format:${format}`),
    e: ["note"],
    i: files,
  };

  const encodedBuffer = Buffer.concat([Buffer.from(`EIA^${JSON.stringify(manifest)}$`),...buffer,]);
  
  return encodedBuffer;
};
