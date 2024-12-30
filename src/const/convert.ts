import type {
	FormatItemType,
	TTextureConverterFormat,
} from "@/_types/text-zip/formats";
import { selectedFiles2v0RGBA32 } from "@/lib/selectedFiles2textZip/selectedFiles2v0RGBA32";
import { selectedFiles2v1DXT1 } from "@/lib/selectedFiles2textZip/selectedFiles2v1DXT1";
import { selectedFiles2v1RGB24 } from "@/lib/selectedFiles2textZip/selectedFiles2v1RGB24";
import { selectedFiles2v1RGBA32 } from "@/lib/selectedFiles2textZip/selectedFiles2v1RGBA32";

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
];
