import type { TypedWorkerWorker } from "@/_types/lib/worker/typedWorker";
import { initPromise } from "@/lib/basis";
import { setWorkerId } from "@/worker/env";

export const registerInitHandler = (worker: TypedWorkerWorker) => {
	worker.addEventListener("message", async (event) => {
		if (event.data.type !== "init") return;
		setWorkerId(event.data.threadId);
		await initPromise;
		worker.postMessage({
			type: "init",
			requestId: event.data.requestId,
		});
	});
};
