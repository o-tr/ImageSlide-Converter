import type { BoundingBox } from "@/_types/lib/crop";
import { mergeTwoBoundingBox } from "@/lib/crop/mergeTwoBoundingBox";

export const mergeBoundingBoxByLimit = (
  _boxes: BoundingBox[],
  limit: number,
): BoundingBox[] => {
  const boxes = structuredClone(_boxes); // 副作用を避けるためにクローンを作成

  while (boxes.length > limit) {
    let minExtraSpace = Number.POSITIVE_INFINITY;
    let mergeIdxA = -1;
    let mergeIdxB = -1;
    let mergedBox = null;

    // すべての組み合わせを探索すると計算量が大きいので、小さい方から200個だけ探索する
    for (let i = Math.max(0, boxes.length - 200); i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const boxA = boxes[i];
        const boxB = boxes[j];

        const tempMergedBox = mergeTwoBoundingBox(boxA, boxB);

        // 余白の計算
        const extraSpace = tempMergedBox.area - (boxA.area + boxB.area);

        // 最も余白が少ない組み合わせを探す
        if (extraSpace < minExtraSpace) {
          minExtraSpace = extraSpace;
          mergeIdxA = i;
          mergeIdxB = j;
          mergedBox = tempMergedBox;
        }
      }
    }

    // 最も余白が少ない組み合わせを統合
    if (mergeIdxA !== -1 && mergeIdxB !== -1 && mergedBox) {
      boxes[mergeIdxA] = mergedBox;
      boxes.splice(mergeIdxB, 1);
    } else {
      break; // 統合できる組み合わせがない場合は終了
    }
  }
  return boxes;
};
