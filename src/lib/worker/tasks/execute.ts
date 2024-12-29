import type { TypedWorkerClient } from "@/_types/lib/worker/typedWorker";
import { executeTask } from "@/lib/worker/taskRunner";

export const registerExecuteHandler = (worker: TypedWorkerClient) => {
	worker.addEventListener("message", async (event) => {
		if (event.data.type !== "execute") return;
		const { requestId, task } = event.data;
		const response = await executeTask(task);
		worker.postMessage({
			requestId,
			type: "execute",
			result: response,
		});
	});
};
