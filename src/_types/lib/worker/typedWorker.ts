import type {
	TypedWorkerClientMethod,
	TypedWorkerClientMethodMap,
	TypedWorkerWorkerResponse,
} from "./client-method";
import type {
	TypedWorkerClientResponse,
	TypedWorkerWorkerMethod,
} from "./worker-method";

export interface TypedWorkerClient extends Worker {
	postMessage(
		message: TypedWorkerClientMessage,
		transfer?: Transferable[],
	): void;
	postMessage(message: TypedWorkerClientMessage): void;
	addEventListener(
		type: "message",
		listener: (event: MessageEvent<TypedWorkerWorkerMessage>) => void,
		options?: boolean | EventListenerOptions,
	): void;
	addEventListener(
		type: never,
		listener: EventListenerOrEventListenerObject,
		options?: AddEventListenerOptions,
	): void;
}

export interface TypedWorkerWorker extends Worker {
	postMessage(
		message: TypedWorkerWorkerMessage,
		transfer?: Transferable[],
	): void;
	postMessage(message: TypedWorkerWorkerMessage): void;
	addEventListener(
		type: "message",
		listener: (event: MessageEvent<TypedWorkerClientMessage>) => void,
		options?: boolean | EventListenerOptions,
	): void;
	addEventListener(
		type: never,
		listener: EventListenerOrEventListenerObject,
		options?: AddEventListenerOptions,
	): void;
}

type TypedWorkerTaskItemGenerics<T extends keyof TypedWorkerClientMethodMap> = {
	message: TypedWorkerClientMethodMap[T]["request"];
	promise: Promise<TypedWorkerClientMethodMap[T]["response"]>;
	resolve: (value: TypedWorkerClientMethodMap[T]["response"]) => void;
	transfer?: Transferable[];
};

export type TypedWorkerTaskItem = TypedWorkerTaskItemGenerics<
	keyof TypedWorkerClientMethodMap
>;

export type TypedWorkerClientMessage =
	| TypedWorkerClientMethod
	| TypedWorkerClientResponse;
export type TypedWorkerWorkerMessage =
	| TypedWorkerWorkerResponse
	| TypedWorkerWorkerMethod;
