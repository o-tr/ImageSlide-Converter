import type { BoundingBox } from "@/_types/lib/crop";
import type { Rect } from "@/_types/text-zip";

export const expandBoundingBoxes = (
  box: BoundingBox[],
  rect: Rect,
  padding = 0,
): BoundingBox[] => {
  return box.map((b) => {
    const x1 = Math.max(b.x1 - padding, 0);
    const y1 = Math.max(b.y1 - padding, 0);
    const x2 = Math.min(b.x2 + padding, rect.width);
    const y2 = Math.min(b.y2 + padding, rect.height);
    const width = x2 - x1;
    const height = y2 - y1;
    return {
      x1,
      y1,
      x2,
      y2,
      width,
      height,
      area: width * height,
    };
  });
};
