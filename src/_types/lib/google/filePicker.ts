export type GoogleFilePickerCallbackData = {
	action: string;
	docs?: { mimeType?: string; id: string; name?: string }[];
};
