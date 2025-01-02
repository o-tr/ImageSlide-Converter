import type {
	ManifestV1,
	ManifestV1Extension,
	ManifestV1Item,
	RawImageObjV1Cropped,
} from "@/_types/text-zip/v1";
import { FileSizeLimit } from "@/const/convert";
import JSZip from "jszip";

export const compressFileV1 = async (
	data: RawImageObjV1Cropped[],
	count = 1,
): Promise<string[]> => {
	const partCount = Math.ceil(data.length / count);
	const result: string[] = [];
	let addedBytes = 0;
	for (let i = 0; i < count; i++) {
		const part = data.slice(i * partCount, (i + 1) * partCount);
		const metadata: ManifestV1Item[] = [];
		const features: string[] = [];
		const extensions: string[] = [];
		const partZip = new JSZip();
		for (const item of part) {
			const ext: ManifestV1Extension = {};
			const path = `${item.index}.rawimage`;
			if (item.cropped) {
				for (const rect of item.cropped.rects) {
					const rectPath = `${item.index}.${rect.index}.rawimage`;
					partZip.file(rectPath, rect.buffer);
					addedBytes += rect.buffer.length;
					console.log(
						`add ${rectPath} size: ${rect.buffer.length}, total: ${addedBytes}`,
					);
				}
				ext.cropped = {
					basePath: `${item.cropped.baseIndex}.rawimage`,
					rects: item.cropped.rects.map((rect) => ({
						x: rect.x,
						y: rect.y,
						width: rect.width,
						height: rect.height,
						index: rect.index,
						path: `${item.index}.${rect.index}.rawimage`,
					})),
				};
				extensions.push("cropped");
			} else {
				partZip.file(path, item.buffer);
				addedBytes += item.buffer.length;
				console.log(
					`add ${path} size: ${item.buffer.length}, total: ${addedBytes}`,
				);
			}
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
			return compressFileV1(data, count + 1);
		}
		result.push(base64);
	}
	return result;
};
