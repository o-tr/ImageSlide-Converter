import type { FileItem } from "@/_types/api/getMyFiles";

export const getFile = async (fileId: string): Promise<FileItem> => {
	const response = await fetch(`/api/files/${fileId}`);
	const data = await response.json();
	return data.data.file;
};
