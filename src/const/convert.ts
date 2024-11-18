import { FormatItemType, TTextureFormat } from "@/_types/text-zip/formats";

export const FileSizeLimit = 95 * 1024 * 1024;
export const ActualFileSizeLimit = 100 * 1024 * 1024;

export const TargetVersions: {
  label: string;
  image: string;
  value: number;
  formats: TTextureFormat[];
}[] = [
  {
    label: "v0.0.x",
    image: "/image-slide/v0.0.x.png",
    value: 0,
    formats: ["RGBA32"],
  },
  {
    label: "v0.1.x",
    image: "/image-slide/v0.1.x.png",
    value: 1,
    formats: ["RGBA32", "RGB24"],
  },
  {
    label: "v0.2.x",
    image: "/image-slide/v0.1.x.png",
    value: 1,
    formats: ["RGBA32", "RGB24", "DXT1"],
  },
];

export const TargetFormats: FormatItemType[] = [
  {
    label: "RGB24",
    bytePerPixel: 3,
    priority: 2,
  },
  {
    label: "RGBA32",
    bytePerPixel: 4,
    priority: 0,
  },
  {
    label: "DXT1",
    bytePerPixel: 1,
    priority: 1,
  },
];
