import type { BoundingBox } from "@/_types/lib/crop";
import { IMAGE_BOUNDING_BOX_PENALTY_FACTOR } from "@/const/config";

export const calcBoundingBoxScore = (boxes: BoundingBox[]): number => {
	const totalArea = boxes.reduce((sum, box) => sum + box.area, 0);
	return totalArea * (1 + boxes.length * IMAGE_BOUNDING_BOX_PENALTY_FACTOR);
};
