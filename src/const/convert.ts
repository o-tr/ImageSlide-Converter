import {FormatItemType} from "@/_types/text-zip/formats";

export const FileSizeLimit = 90 * 1000 * 1000;

export const TargetVersions: {
  label: string;
  image: string;
  formats: string[]
}[] = [
  {
    label: "v0.0.x",
    image: "/image-slide/v0.0.x.png",
    formats: ["RGBA32"]
  },
  {
    label: "v0.1.x",
    image: "/image-slide/v0.1.x.png",
    formats: ["RGBA32", "RGB24"]
  }
]

export const TargetFormats: FormatItemType[] = [
  {
    label: "RGB24",
    bytePerPixel: 3,
    priority: 1
  },
  {
    label: "RGBA32",
    bytePerPixel: 4,
    priority: 0
  },
]
