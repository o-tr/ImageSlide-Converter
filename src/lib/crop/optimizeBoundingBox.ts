import type { BoundingBox } from "@/_types/lib/crop";
import { IMAGE_BOUNDING_BOX_LIMIT } from "@/const/config";
import { calcBoundingBoxScore } from "@/lib/crop/calcBoundingBoxScore";
import { mergeBoundingBoxByLimit } from "@/lib/crop/mergeBoundingBoxByLimit";

export const optimizeBoundingBox = (boxes: BoundingBox[]): BoundingBox[] => {
	let bestBoxes = mergeBoundingBoxByLimit(boxes, IMAGE_BOUNDING_BOX_LIMIT);
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
	return bestBoxes;
};
