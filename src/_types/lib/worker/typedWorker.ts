export interface TypedWorkerClient extends Worker {
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

interface TypedWorkerClientMethodMap {
	init: {
		request: TypedWorkerClientMethodInit;
		response: TypedWorkerWorkerResponseInit;
	};
	ping: {
		request: TypedWorkerClientMethodPing;
		response: TypedWorkerWorkerResponsePing;
	};
}

interface TypedWorkerWorkerMethodMap {
	execute: {
		request: TypedWorkerWorkerMethodExecute;
		response: TypedWorkerClientResponseExecute;
	};
}

type TypedWorkerTaskItemGenerics<T extends keyof TypedWorkerClientMethodMap> = {
	message: TypedWorkerClientMethodMap[T]["request"];
	promise: Promise<TypedWorkerClientMethodMap[T]["response"]>;
	resolve: (value: TypedWorkerClientMethodMap[T]["response"]) => void;
};

export type TypedWorkerTaskItem = TypedWorkerTaskItemGenerics<
	keyof TypedWorkerClientMethodMap
>;

export type TypedWorkerClientMethod =
	TypedWorkerClientMethodMap[keyof TypedWorkerClientMethodMap]["request"];
export type TypedWorkerWorkerMethod =
	TypedWorkerWorkerMethodMap[keyof TypedWorkerWorkerMethodMap]["request"];
export type TypedWorkerWorkerResponse =
	TypedWorkerClientMethodMap[keyof TypedWorkerClientMethodMap]["response"];
export type TypedWorkerClientResponse =
	TypedWorkerWorkerMethodMap[keyof TypedWorkerWorkerMethodMap]["response"];
export type TypedWorkerClientMessage =
	| TypedWorkerClientMethod
	| TypedWorkerClientResponse;
export type TypedWorkerWorkerMessage =
	| TypedWorkerWorkerResponse
	| TypedWorkerWorkerMethod;

export type TypedWorkerClientMethodInit = {
	type: "init";
	threadId: number;
	requestId: string;
};

export type TypedWorkerClientMethodPing = {
	type: "ping";
	requestId: string;
};

export type TypedWorkerWorkerResponseInit = {
	type: "init";
	requestId: string;
};

export type TypedWorkerWorkerResponsePing = {
	type: "ping";
	requestId: string;
};

export type TypedWorkerWorkerMethodExecute = {
	type: "execute";
	requestId: string;
	task: TypedWorkerClientMethodMap[keyof TypedWorkerClientMethodMap]["request"];
};

export type TypedWorkerClientResponseExecute = {
	type: "execute";
	requestId: string;
	result: TypedWorkerClientMethodMap[keyof TypedWorkerClientMethodMap]["response"];
};
