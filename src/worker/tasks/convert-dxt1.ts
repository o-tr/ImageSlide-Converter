import type { TypedWorkerWorker } from "@/_types/lib/worker";
import { initPromise } from "@/lib/basis";
import { canvas2dxt1 } from "@/lib/canvas2rawImage/canvas2dxt1";

export const registerConvertDxt1Handler = (worker: TypedWorkerWorker) => {
	worker.addEventListener("message", async (event) => {
		if (event.data.type !== "convert-dxt1") return;
		const { requestId, bitmap } = event.data;
		const targetWidth = Math.ceil(bitmap.width / 4) * 4;
		const targetHeight = Math.ceil(bitmap.height / 4) * 4;
		const canvas = new OffscreenCanvas(targetWidth, targetHeight);
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("ctx is null");
		ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
		await initPromise;
		const dxt1 = canvas2dxt1(canvas);
		worker.postMessage(
			{
				requestId,
				type: "convert-dxt1",
				buffer: dxt1.buffer,
				width: targetWidth,
				height: targetHeight,
			},
			[dxt1.buffer],
		);
	});
};
