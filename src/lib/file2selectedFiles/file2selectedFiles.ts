import type { SelectedFile } from "@/_types/file-picker";
import { img2selectedFiles } from "./img2selectedFiles";
import { pdf2selectedFiles } from "./pdf2selectedFiles";

export const file2selectedFiles = async (
	file: File,
): Promise<SelectedFile[]> => {
	if (file.type.startsWith("image/")) {
		return await img2selectedFiles(file);
	}
	if (file.type.startsWith("application/pdf")) {
		return await pdf2selectedFiles(file);
	}
	throw new Error("Unsupported file type");
};
