import type { Rect } from "@/_types/text-zip";

export type ManifestV1_1Item = {
  path: string;
  format: TTextureFormatV1_1;
  rect: Rect;
  extensions?: { [ext_name: string]: string };
};

export type ManifestV1_1 = {
  files: ManifestV1_1Item[];
  manifestVersion: 1;
  requiredFeatures: string[];
  extensions: string[];
};

export type RawImageObjV1_1 = {
  index: number;
  rect: Rect;
  format: TTextureFormatV1_1;
  buffer: Buffer;
  note?: string;
};

export const TextureFormatV1_1 = ["RGB24", "RGBA32", "BC1", "ETC1"] as const;

export type TTextureFormatV1_1 = (typeof TextureFormatV1_1)[number];

export type FormatItemTypeV1_1 = {
  label: TTextureFormatV1_1;
  bytePerPixel: number;
  priority: number;
};
