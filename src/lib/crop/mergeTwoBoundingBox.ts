import type { BoundingBox } from "@/_types/lib/crop";

export const mergeTwoBoundingBox = (
  box1: BoundingBox,
  box2: BoundingBox,
): BoundingBox => {
  const x1 = Math.min(box1.x1, box2.x1);
  const y1 = Math.min(box1.y1, box2.y1);
  const x2 = Math.max(box1.x2, box2.x2);
  const y2 = Math.max(box1.y2, box2.y2);
  const width = x2 - x1;
  const height = y2 - y1;
  const area = width * height;
  return { x1, y1, x2, y2, width, height, area };
};
