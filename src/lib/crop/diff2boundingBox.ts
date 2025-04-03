import type { BoundingBox } from "@/_types/lib/crop";

export const diff2boundingBox = (
  maskArray: Uint8Array,
  width: number,
  height: number,
  padding = 0, // append padding to the bounding box
): BoundingBox[] => {
  const boxes: BoundingBox[] = [];
  const visited = new Uint8Array(maskArray.length);
  const queue: [number, number][] = [];
  const dx = [0, 1, 0, -1];
  const dy = [-1, 0, 1, 0];

  const isInside = (x: number, y: number) =>
    x >= 0 && x < width && y >= 0 && y < height;
  const index = (x: number, y: number) => y * width + x;
  const pushQueue = (x: number, y: number) => {
    visited[index(x, y)] = 1;
    queue.push([x, y]);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (maskArray[index(x, y)] === 0 || visited[index(x, y)]) {
        continue;
      }
      const box: BoundingBox = {
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        width: 1,
        height: 1,
        area: 1,
      };
      pushQueue(x, y);
      while (queue.length > 0) {
        const [x, y] =
          queue.pop() ||
          (() => {
            throw new Error("queue is empty, which should not happen in normal circumstances.  Check the maskArray for unexpected values.");
          })();
        for (let i = 0; i < 4; i++) {
          const nx = x + dx[i];
          const ny = y + dy[i];
          if (
            !isInside(nx, ny) ||
            visited[index(nx, ny)] ||
            maskArray[index(nx, ny)] === 0
          ) {
            continue;
          }
          visited[index(nx, ny)] = 1;
          queue.push([nx, ny]);
          box.x1 = Math.min(box.x1, nx);
          box.y1 = Math.min(box.y1, ny);
          box.x2 = Math.max(box.x2, nx);
          box.y2 = Math.max(box.y2, ny);
          box.width = box.x2 - box.x1 + 1;
          box.height = box.y2 - box.y1 + 1;
          box.area = box.width * box.height;
        }
      }
      box.x1 = Math.max(0, box.x1 - padding);
      box.y1 = Math.max(0, box.y1 - padding);
      box.x2 = Math.min(width - 1, box.x2 + padding);
      box.y2 = Math.min(height - 1, box.y2 + padding);
      box.width = box.x2 - box.x1 + 1;
      box.height = box.y2 - box.y1 + 1;
      box.area = box.width * box.height;
      boxes.push(box);
    }
  }

  return boxes;
};
