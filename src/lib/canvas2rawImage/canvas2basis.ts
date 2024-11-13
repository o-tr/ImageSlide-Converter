import { BasisEncoder, initializeBasis } from "@/lib/basis";
import { canvas2rgba32 } from "@/lib/canvas2rawImage/canvas2rgba32";

export const canvas2basis = (canvas: OffscreenCanvas): Uint8Array => {
  const data = new Uint8Array(canvas2rgba32(canvas));
  const tmpOutput = new Uint8Array(data.length);
  initializeBasis();
  const basisEncoder = new BasisEncoder();
  basisEncoder.setSliceSourceImage(0, data, canvas.width, canvas.height, false);
  basisEncoder.setDebug(false);
  basisEncoder.setComputeStats(false);
  basisEncoder.setPerceptual(true);
  basisEncoder.setMipSRGB(true);
  basisEncoder.setQualityLevel(255);
  basisEncoder.setCompressionLevel(0);
  basisEncoder.setUASTC(false);
  basisEncoder.setMipGen(false);
  const num_output_bytes = basisEncoder.encode(tmpOutput);
  const result = new Uint8Array(tmpOutput.buffer, 0, num_output_bytes);
  basisEncoder.delete();
  return result;
};
