export type SelectedFile = {
	id: string;
	fileName: string;
	note?: string;
	canvas: OffscreenCanvas;
	metadata: SelectedFileMetadata;
};

export type SelectedFileMetadataImage = {
	fileType: "image";
};

export type SelectedFileMetadataPdf = {
	file: File;
	fileType: "pdf";
	index: number;
	scale: number;
};

export type SelectedFileMetadata =
	| SelectedFileMetadataImage
	| SelectedFileMetadataPdf;
