import type { TypedWorkerWorker } from "@/_types/lib/worker/typedWorker";
import { registerConvertDxt1Handler } from "@/worker/tasks/convert-dxt1";
import { registerInitHandler } from "@/worker/tasks/init";
import { registerPingHandler } from "@/worker/tasks/ping";

const worker = self as unknown as TypedWorkerWorker;

registerInitHandler(worker);
registerPingHandler(worker);
registerConvertDxt1Handler(worker);
