import type { SelectedFile } from "@/_types/file-picker";
import type { RawImageObjV1, RawImageObjV1Cropped } from "@/_types/text-zip/v1";
import { canvas2rgb24 } from "@/lib/canvas2rawImage/canvas2rgb24";
import { applyDiff } from "@/lib/crop/applyDiff";
import { diff2boundingBox } from "@/lib/crop/diff2boundingBox";
import { mergeOverlapBoundingBox } from "@/lib/crop/mergeOverlapBoundingBox";
import { optimizeBoundingBox } from "@/lib/crop/optimizeBoundingBox";
import { shrinkOverlapBoundingBox } from "@/lib/crop/shrinkOverlapBoundingBox";
import { rgb242diff } from "@/lib/rawImage2Diff/rgb242diff";
import { compressFileV1 } from "@/lib/text-zip/v1/compress";

export const selectedFiles2v1RGB24Cropped = async (
	selectedFiles: SelectedFile[],
): Promise<string[]> => {
	const rawImages = selectedFiles.map<RawImageObjV1>((file, index) => ({
		index,
		rect: {
			width: file.canvas.width,
			height: file.canvas.height,
		},
		format: "RGB24",
		note: file.note,
		buffer: Buffer.from(canvas2rgb24(file.canvas)),
	}));
	console.log(
		`before compress size: ${rawImages.reduce((acc, cur) => acc + cur.buffer.length, 0)}`,
	);

	const croppedImages = processImages(rawImages);
	console.log(
		`after compress size: ${croppedImages.reduce((acc, cur) => acc + (cur.cropped ? cur.cropped.rects.reduce((acc, cur) => acc + cur.buffer.length, 0) : cur.buffer.length), 0)}`,
	);

	return await compressFileV1(croppedImages);
};

const processImages = (rawImages: RawImageObjV1[]): RawImageObjV1Cropped[] => {
	if (rawImages.length === 0) {
		return [];
	}
	const croppedImages: RawImageObjV1Cropped[] = [rawImages[0]];
	for (let i = 1; i < rawImages.length; i++) {
		const lastImage = croppedImages[i - 1];
		const currentImage = rawImages[i];

		const diff = rgb242diff(lastImage, currentImage);

		const diffBox = diff2boundingBox(
			diff,
			currentImage.rect.width,
			currentImage.rect.height,
		);
		const boundingBoxes = mergeOverlapBoundingBox(
			shrinkOverlapBoundingBox(diffBox),
		);
		const mergedBoundingBoxes = optimizeBoundingBox(
			boundingBoxes,
			currentImage.rect,
		);
		if (
			mergedBoundingBoxes.length === 0 ||
			mergedBoundingBoxes[0].area ===
				currentImage.rect.width * currentImage.rect.height
		) {
			croppedImages.push(currentImage);
			continue;
		}
		const rects = mergedBoundingBoxes.map((box, index) => {
			const { x1: x, y1: y, width, height } = box;
			const buffer = Buffer.alloc(width * height * 3);
			for (let j = 0; j < height; j++) {
				const srcStart = ((y + j) * currentImage.rect.width + x) * 3;
				const destStart = j * width * 3;
				currentImage.buffer.copy(
					buffer,
					destStart,
					srcStart,
					srcStart + width * 3,
				);
			}
			return {
				index,
				x,
				y,
				width,
				height,
				buffer,
			};
		});
		const merged = applyDiff(lastImage, currentImage, rects);
		const croppedImage: RawImageObjV1Cropped = {
			...currentImage,
			cropped: {
				rects,
				merged,
			},
		};
		croppedImages.push(croppedImage);
	}
	return croppedImages;
};
