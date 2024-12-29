import type { SelectedFile } from "@/_types/file-picker";
import type { TTextureFormat } from "@/_types/text-zip/formats";

export type WorkerMessage = {
	type: "compress";
	data: {
		files: (Omit<SelectedFile, "canvas"> & { bitmap: ImageBitmap })[];
		format: TTextureFormat;
		version: number;
		scale: number;
	};
};

export type WorkerResponse = {
	type: "compress";
	data: string[];
};
