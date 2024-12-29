import type { SelectedFile } from "@/_types/file-picker";
import { TargetFormats, TargetVersions } from "@/const/convert";
import { estimateFileSize } from "@/utils/estimateFileSize";

export const getAvailableFormats = (version: string, files: SelectedFile[]) => {
	const supported = TargetVersions.find((v) => v.label === version)?.formats;
	if (!supported) {
		return [];
	}
	return TargetFormats.filter((v) => supported.includes(v.label)).map(
		(format) => ({
			...format,
			fileSize: estimateFileSize(files, format.bytePerPixel),
		}),
	);
};
