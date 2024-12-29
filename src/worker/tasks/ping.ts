import type { TypedWorkerWorker } from "@/_types/lib/worker/typedWorker";

export const registerPingHandler = (worker: TypedWorkerWorker) => {
	worker.addEventListener("message", (event) => {
		if (event.data.type !== "ping") return;
		worker.postMessage({
			type: "ping",
			requestId: event.data.requestId,
		});
	});
};
