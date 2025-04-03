import type { TypedWorkerClientMethodMap } from "@/_types/lib/worker/client-method";

export interface TypedWorkerWorkerMethodMap {
  execute: {
    request: TypedWorkerWorkerMethodExecute;
    response: TypedWorkerClientResponseExecute;
  };
}
export type TypedWorkerWorkerMethod =
  TypedWorkerWorkerMethodMap[keyof TypedWorkerWorkerMethodMap]["request"];
export type TypedWorkerClientResponse =
  TypedWorkerWorkerMethodMap[keyof TypedWorkerWorkerMethodMap]["response"];

export type TypedWorkerWorkerMethodExecute = {
  type: "execute";
  requestId: string;
  task: TypedWorkerClientMethodMap[keyof TypedWorkerClientMethodMap]["request"];
  transfer?: Transferable[];
};

export type TypedWorkerClientResponseExecute = {
  type: "execute";
  requestId: string;
  result: TypedWorkerClientMethodMap[keyof TypedWorkerClientMethodMap]["response"];
};
