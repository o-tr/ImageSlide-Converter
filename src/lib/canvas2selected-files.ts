import { SelectedFile } from "@/_types/file-picker";

export const canvas2selectedFile = (
	fileName: string,
	canvas: OffscreenCanvas,
): SelectedFile => ({
	id: crypto.randomUUID(),
	fileName,
	canvas,
});
