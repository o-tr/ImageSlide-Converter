import type {
  FormatItemType,
  TTextureConverterFormat,
} from "@/_types/text-zip/formats";
import {
  selectedFiles2v0RGBA32,
  selectedFiles2v1DXT1,
  selectedFiles2v1RGB24,
  selectedFiles2v1RGB24Cropped,
  selectedFiles2v1RGBA32,
} from "@/lib/selectedFiles2textZip";

export const FileSizeLimit = 95 * 1024 * 1024;
export const ActualFileSizeLimit = 100 * 1024 * 1024;

export const TargetVersions: {
  label: string;
  image: string;
  value: number;
  formats: TTextureConverterFormat[];
}[] = [
  {
    label: "v0.0.x",
    image: "/image-slide/v0.0.x.png",
    value: 0,
    formats: ["v0-RGBA32"],
  },
  {
    label: "v0.1.x",
    image: "/image-slide/v0.1.x.png",
    value: 1,
    formats: ["v1-RGBA32", "v1-RGB24"],
  },
  {
    label: "v0.2.x",
    image: "/image-slide/v0.1.x.png",
    value: 1,
    formats: ["v1-RGBA32", "v1-RGB24", "v1-DXT1"],
  },
  {
    label: "v0.3.x",
    image: "/image-slide/v0.1.x.png",
    value: 1,
    formats: ["v1-RGBA32", "v1-RGB24", "v1-DXT1", "v1-RGB24-cropped"],
  },
];

export const TargetFormats: FormatItemType[] = [
  {
    id: "v0-RGBA32",
    label: "RGBA32",
    bytePerPixel: 4,
    priority: 0,
    converter: selectedFiles2v0RGBA32,
  },
  {
    id: "v1-RGB24",
    label: "RGB24",
    bytePerPixel: 3,
    priority: 2,
    converter: selectedFiles2v1RGB24,
  },
  {
    id: "v1-RGBA32",
    label: "RGBA32",
    bytePerPixel: 4,
    priority: 0,
    converter: selectedFiles2v1RGBA32,
  },
  {
    id: "v1-DXT1",
    label: "DXT1",
    bytePerPixel: 1,
    priority: 1,
    converter: selectedFiles2v1DXT1,
  },
  {
    id: "v1-RGB24-cropped",
    label: "RGB24 (cropped)",
    bytePerPixel: 3,
    priority: 3,
    converter: selectedFiles2v1RGB24Cropped,
  },
];
