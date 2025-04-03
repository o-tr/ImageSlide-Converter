import type { SelectedFile } from "@/_types/file-picker";

export const TextureFormat = [
  "RGBA32",
  "RGB24",
  "DXT1",
  "RGB24-cropped",
] as const;

export const TextureConverterFormat = [
  "v0-RGBA32",
  "v1-RGB24",
  "v1-RGBA32",
  "v1-DXT1",
  "v1-RGB24-cropped",
] as const satisfies `v${number}-${(typeof TextureFormat)[number]}`[];

export type TTextureFormat = (typeof TextureFormat)[number];
export type TTextureConverterFormat = (typeof TextureConverterFormat)[number];

export type FormatItemType = {
  id: TTextureConverterFormat;
  label: string;
  description?: string;
  bytePerPixel: number;
  priority: number;
  converter: (selectedFiles: SelectedFile[]) => Promise<string[]>;
};
