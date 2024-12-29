import type { TTextureFormat } from "@/_types/text-zip/formats";
import { basis2dxt1 } from "@/lib/canvas2rawImage/basis2dxt1";
import { canvas2basis } from "@/lib/canvas2rawImage/canvas2basis";
import { canvas2rgb24 } from "./canvas2rgb24";
import { canvas2rgba32 } from "./canvas2rgba32";

export const canvas2rawImage = (
	canvas: OffscreenCanvas,
	format: TTextureFormat = "RGBA32",
): Buffer => {
	switch (format) {
		case "RGB24":
			return Buffer.from(canvas2rgb24(canvas));
		case "RGBA32":
			return Buffer.from(canvas2rgba32(canvas));
		case "DXT1":
			return Buffer.from(basis2dxt1(canvas2basis(canvas)));
	}
};
