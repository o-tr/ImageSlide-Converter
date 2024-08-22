import { FormatItemType } from "@/_types/text-zip/formats";

export const FileSizeLimit = 95 * 1024 * 1024;
export const ActualFileSizeLimit = 100 * 1024 * 1024;

export const TargetVersions: {
  label: string;
  image: string;
  formats: string[];
}[] = [
  {
    label: "v0.0.x",
    image: "/image-slide/v0.0.x.png",
    formats: ["RGBA32"],
  },
  {
    label: "v0.1.x",
    image: "/image-slide/v0.1.x.png",
    formats: ["RGBA32", "RGB24"],
  },
];

export const TargetFormats: FormatItemType[] = [
  {
    label: "RGB24",
    bytePerPixel: 3,
    priority: 1,
  },
  {
    label: "RGBA32",
    bytePerPixel: 4,
    priority: 0,
  },
];
