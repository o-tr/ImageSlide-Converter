import { canvas2rgb24 } from "./canvas2rgb24";
import { canvas2rgba32 } from "./canvas2rgba32";
import { TTextureFormat } from "@/_types/text-zip/formats";

export const canvas2rawImage = (
  canvas: HTMLCanvasElement,
  format: TTextureFormat = "RGBA32",
): Buffer => {
  switch (format) {
    case "RGB24":
      return Buffer.from(canvas2rgb24(canvas));
    case "RGBA32":
      return Buffer.from(canvas2rgba32(canvas));
  }
};
