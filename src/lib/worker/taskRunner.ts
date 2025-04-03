import type {
  TypedWorkerClientMethodMap,
  TypedWorkerTaskItem,
  TypedWorkerWorkerMessage,
  TypedWorkerWorkerResponse,
} from "@/_types/lib/worker";
import { getAvailableThread } from "@/lib/worker/threads";
import { getCurrentPlatform } from "@/utils/getCurrentPlatform";
import { executeClientTask } from "@/worker/utils";

const tasks: TypedWorkerTaskItem[] = [];

let isLaunching = false;

const isInWorker = getCurrentPlatform() === "worker";

export const executeTask = async <T extends keyof TypedWorkerClientMethodMap>(
  message: TypedWorkerClientMethodMap[T]["request"],
  transfer?: Transferable[],
): Promise<TypedWorkerClientMethodMap[T]["response"]> => {
  if (isInWorker) {
    return await executeClientTask(message, transfer);
  }

  const task: Partial<TypedWorkerTaskItem> = {
    message,
    resolve: () => {},
    transfer,
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

  console.log(
    `execute task ${task.message.type} (taskID: ${task.message.requestId}) in thread ${thread.id}`,
  );
  thread.worker.postMessage(task.message, task.transfer);
  const onMessage = ({ data }: MessageEvent<TypedWorkerWorkerMessage>) => {
    if (
      !((data: TypedWorkerWorkerMessage): data is TypedWorkerWorkerResponse =>
        data.requestId === task.message.requestId)(data)
    )
      return;
    task.resolve(data);
    thread.worker.removeEventListener("message", onMessage);
    console.log(
      `finish task ${task.message.type} (taskID: ${task.message.requestId}) in thread ${thread.id}`,
    );
    thread.isBusy = false;
  };
  thread.worker.addEventListener("message", onMessage);
  setTimeout(executeNextTask, 0);
};
