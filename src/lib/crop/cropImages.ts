import type { RawImageObjV1, RawImageObjV1Cropped } from "@/_types/text-zip/v1";
import { applyDiff } from "@/lib/crop/applyDiff";
import { diff2boundingBox } from "@/lib/crop/diff2boundingBox";
import { mergeOverlapBoundingBox } from "@/lib/crop/mergeOverlapBoundingBox";
import { optimizeBoundingBox } from "@/lib/crop/optimizeBoundingBox";
import { shrinkOverlapBoundingBox } from "@/lib/crop/shrinkOverlapBoundingBox";
import { rgb242diff } from "@/lib/rawImage2Diff/rgb242diff";

export interface CropOptions {
  keyframeInterval?: number;
}

export const cropImages = (
  rawImages: RawImageObjV1[],
  options?: CropOptions,
): RawImageObjV1Cropped[] => {
  if (rawImages.length === 0) {
    return [];
  }

  const keyframeInterval = options?.keyframeInterval ?? 0;

  const croppedImages: RawImageObjV1Cropped[] = [rawImages[0]];
  for (let i = 1; i < rawImages.length; i++) {
    const lastImage = croppedImages[i - 1];
    const currentImage = rawImages[i];

    if (keyframeInterval > 0 && i % keyframeInterval === 0) {
      croppedImages.push(currentImage);
      continue;
    }

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
        baseIndex: lastImage.index,
        rects,
        merged,
      },
    };
    croppedImages.push(croppedImage);
  }
  return croppedImages;
};
