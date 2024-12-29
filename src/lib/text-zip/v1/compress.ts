import type {
	ManifestV1,
	ManifestV1Item,
	RawImageObjV1,
} from "@/_types/text-zip/v1";
import { FileSizeLimit } from "@/const/convert";
import JSZip from "jszip";

export const compressFile = async (
	data: RawImageObjV1[],
	count = 1,
): Promise<string[]> => {
	const partCount = Math.ceil(data.length / count);
	const result: string[] = [];
	for (let i = 0; i < count; i++) {
		const part = data.slice(i * partCount, (i + 1) * partCount);
		const metadata: ManifestV1Item[] = [];
		const features: string[] = [];
		const extensions: string[] = [];
		const partZip = new JSZip();
		for (const item of part) {
			const path = `${item.index}.rawimage`;
			partZip.file(path, item.buffer);
			const ext: { [ext_name: string]: string } = {};
			if (item.note) {
				ext.note = item.note;
				extensions.push("note");
			}
			features.push(`Format:${item.format}`);
			metadata.push({
				path,
				format: item.format,
				rect: item.rect,
				extensions: ext,
			});
		}
		const manifest: ManifestV1 = {
			files: metadata,
			manifestVersion: 1,
			requiredFeatures: Array.from(new Set(features)),
			extensions: Array.from(new Set(extensions)),
		};
		partZip.file("metadata.json", JSON.stringify(manifest));
		const base64 = await partZip.generateAsync({
			type: "base64",
		});
		if (base64.length > FileSizeLimit) {
			return compressFile(data, count + 1);
		}
		result.push(base64);
	}
	return result;
};
