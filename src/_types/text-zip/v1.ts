import type { Rect } from "@/_types/text-zip";
import type { TTextureFormat } from "@/_types/text-zip/formats";

export type ManifestV1Item = {
	path: string;
	format: TTextureFormat;
	rect: Rect;
	extensions?: ManifestV1Extension;
};

export type ManifestV1Extension = {
	note?: string;
	cropped?: ManifestV1ExtensionCropped;
};

export type ManifestV1ExtensionCropped = {
	basePath: string;
	rects: {
		index: number;
		x: number;
		y: number;
		width: number;
		height: number;
		path: string;
	}[];
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

export type RawImageObjV1Cropped = RawImageObjV1 & {
	cropped?: {
		baseIndex: number;
		rects: RawImageObjV1CroppedPart[];
		merged: Buffer;
	};
};

export type RawImageObjV1CroppedPart = {
	index: number;
	x: number;
	y: number;
	width: number;
	height: number;
	buffer: Buffer;
};
