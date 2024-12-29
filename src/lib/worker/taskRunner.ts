import type {
	TypedWorkerClientMethod,
	TypedWorkerTaskItem,
	TypedWorkerWorkerMessage,
	TypedWorkerWorkerResponse,
} from "@/_types/lib/worker/typedWorker";
import { getAvailableThread } from "@/lib/worker/threads";

const tasks: TypedWorkerTaskItem[] = [];

let isLaunching = false;

export const executeTask = async (message: TypedWorkerClientMethod) => {
	console.log("executeTask", message);
	const task: Partial<TypedWorkerTaskItem> = {
		message,
		resolve: () => {},
	};
	task.promise = new Promise<TypedWorkerWorkerResponse>((resolve) => {
		task.resolve = resolve;
	});
	tasks.push(task as TypedWorkerTaskItem);
	if (tasks.length === 1) {
		void executeNextTask();
	}
	const response = await task.promise;
	if (!isLaunching) {
		void executeNextTask();
	}
	return response;
};

export const executeNextTask = async () => {
	if (tasks.length === 0) {
		isLaunching = false;
		return;
	}
	const thread = await getAvailableThread();
	if (!thread) {
		isLaunching = false;
		return;
	}
	const task = tasks.shift();
	if (!task) {
		isLaunching = false;
		return;
	}
	isLaunching = true;

	console.log(`execute task ${task.message.type} on thread ${thread.id}`);
	thread.worker.postMessage(task.message);
	const onMessage = ({ data }: MessageEvent<TypedWorkerWorkerMessage>) => {
		if (
			!((data: TypedWorkerWorkerMessage): data is TypedWorkerWorkerResponse =>
				data.requestId === task.message.requestId)(data)
		)
			return;
		task.resolve(data);
		thread.worker.removeEventListener("message", onMessage);
		thread.isBusy = false;
	};
	thread.worker.addEventListener("message", onMessage);
	setTimeout(executeNextTask, 0);
};
