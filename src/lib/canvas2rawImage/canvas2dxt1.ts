import { basis2dxt1 } from "@/lib/canvas2rawImage/basis2dxt1";
import { canvas2basis } from "@/lib/canvas2rawImage/canvas2basis";

export const canvas2dxt1 = (canvas: OffscreenCanvas): Uint8Array => {
	return basis2dxt1(canvas2basis(canvas));
};
