import type { Rect } from "@/_types/text-zip";
import type { TTextureFormat } from "@/_types/text-zip/formats";

export type ManifestV1Item = {
	path: string;
	format: TTextureFormat;
	rect: Rect;
	extensions?: { [ext_name: string]: string };
};

export type ManifestV1 = {
	files: ManifestV1Item[];
	manifestVersion: 1;
	requiredFeatures: string[];
	extensions: string[];
};

export type RawImageObjV1 = {
	index: number;
	rect: Rect;
	format: TTextureFormat;
	buffer: Buffer;
	note?: string;
};
