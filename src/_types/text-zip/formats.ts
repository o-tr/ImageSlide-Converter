export const TextureFormat = ["RGB24", "RGBA32"] as const;

export type TTextureFormat = (typeof TextureFormat)[number];

export type FormatItemType = {
  label: TTextureFormat;
  bytePerPixel: number;
  priority: number;
};
