import { canvas2rgba32 } from "./canvas2rgba32";

export const canvas2rgb24 = (canvas: HTMLCanvasElement): number[] => {
  const rgba32 = canvas2rgba32(canvas);
  return rgba32.filter((_, i) => i % 4 !== 3);
};
