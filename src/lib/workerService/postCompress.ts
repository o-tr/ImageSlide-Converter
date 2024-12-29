import type { SelectedFile } from "@/_types/file-picker";
import type { TTextureFormat } from "@/_types/text-zip/formats";
import type { WorkerMessage, WorkerResponse } from "@/_types/worker";

const worker = (
	typeof window !== "undefined"
		? new Worker(new URL("../../worker/compress.ts", import.meta.url))
		: undefined
) as Worker;

export const postCompress = (
	files: SelectedFile[],
	format: TTextureFormat,
	version: number,
	scale: number,
): Promise<string[]> => {
	const message: WorkerMessage = {
		type: "compress",
		data: {
			format,
			version,
			scale,
			files: files.map((file) => ({
				...file,
				bitmap: file.canvas.transferToImageBitmap(),
				canvas: undefined,
			})),
		},
	};
	return new Promise<string[]>((resolve) => {
		worker.addEventListener(
			"message",
			(event: MessageEvent<WorkerResponse>) => {
				if (event.data.type !== "compress") return;
				resolve(event.data.data);
			},
		);
		worker.postMessage(
			message,
			message.data.files.map((file) => file.bitmap),
		);
	});
};
