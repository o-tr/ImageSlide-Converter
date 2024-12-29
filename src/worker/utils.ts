import type {
	TypedWorkerClientMessage,
	TypedWorkerClientMethod,
	TypedWorkerClientResponseExecute,
	TypedWorkerWorker,
	TypedWorkerWorkerResponse,
} from "@/_types/lib/worker/typedWorker";

const worker = self as unknown as TypedWorkerWorker;

export const executeClientTask = async (
	task: TypedWorkerClientMethod,
): Promise<TypedWorkerWorkerResponse> => {
	let resolve: (value: TypedWorkerWorkerResponse) => void;
	const executeTaskId = crypto.randomUUID();
	const promise = new Promise<TypedWorkerWorkerResponse>((_resolve) => {
		resolve = _resolve;
	});
	const onMessage = ({ data }: MessageEvent<TypedWorkerClientMessage>) => {
		if (
			!((data): data is TypedWorkerClientResponseExecute =>
				data.requestId === executeTaskId)(data)
		)
			return;
		worker.removeEventListener("message", onMessage);
		resolve(data.result);
	};
	worker.addEventListener("message", onMessage);
	worker.postMessage({
		type: "execute",
		task,
		requestId: executeTaskId,
	});
	return promise;
};
