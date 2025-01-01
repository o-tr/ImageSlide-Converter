import type { BoundingBox } from "@/_types/lib/crop";
import type { Rect } from "@/_types/text-zip";
import { IMAGE_BOUNDING_BOX_LIMIT } from "@/const/config";
import { calcBoundingBoxScore } from "@/lib/crop/calcBoundingBoxScore";
import { expandBoundingBoxes } from "@/lib/crop/expandBoundingBox";
import { mergeBoundingBoxByLimit } from "@/lib/crop/mergeBoundingBoxByLimit";
import { shrinkOverlapBoundingBox } from "@/lib/crop/shrinkOverlapBoundingBox";

export const optimizeBoundingBox = (
	boxes: BoundingBox[],
	rect: Rect,
): BoundingBox[] => {
	let bestBoxes = mergeBoundingBoxByLimit(
		expandBoundingBoxes(boxes, rect, 4),
		IMAGE_BOUNDING_BOX_LIMIT,
	);
	let bestScore = calcBoundingBoxScore(bestBoxes);

	let reducedBoxes = bestBoxes;
	for (let i = IMAGE_BOUNDING_BOX_LIMIT - 1; i > 0; i--) {
		reducedBoxes = mergeBoundingBoxByLimit(reducedBoxes, i);
		const score = calcBoundingBoxScore(reducedBoxes);
		if (score < bestScore) {
			bestScore = score;
			bestBoxes = reducedBoxes;
		}
	}
	bestBoxes = shrinkOverlapBoundingBox(bestBoxes);
	return bestBoxes;
};
