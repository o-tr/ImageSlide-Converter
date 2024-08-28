import { WorkerMessage, WorkerResponse } from "@/_types/worker";
import { convert2textZip } from "@/lib/text-zip";
import { initPromise } from "@/lib/basis";

const worker = self as unknown as Worker;
worker.addEventListener(
  "message",
  async (event: MessageEvent<WorkerMessage>) => {
    if (event.data.type !== "compress") return;
    await initPromise;
    const { files: _files, format, version, scale } = event.data.data;
    const files = _files.map((file) => {
      if (["DXT1"].includes(format)) {
        const _width = Math.ceil((file.bitmap.width * scale) / 4) * 4;
        const _height = Math.ceil((file.bitmap.height * scale) / 4) * 4;
        if (_width === file.bitmap.width && _height === file.bitmap.height) {
          const canvas = new OffscreenCanvas(
            file.bitmap.width,
            file.bitmap.height,
          );
          canvas.getContext("2d")?.drawImage(file.bitmap, 0, 0);
          return { ...file, canvas };
        }
        const canvas = new OffscreenCanvas(_width, _height);
        canvas
          .getContext("2d")
          ?.drawImage(file.bitmap, 0, 0, canvas.width, canvas.height);
        return { ...file, canvas };
      }
      if (scale === 1) {
        const canvas = new OffscreenCanvas(
          file.bitmap.width,
          file.bitmap.height,
        );
        canvas.getContext("2d")?.drawImage(file.bitmap, 0, 0);
        return { ...file, canvas };
      }
      const canvas = new OffscreenCanvas(
        file.bitmap.width * scale,
        file.bitmap.height * scale,
      );
      canvas
        .getContext("2d")
        ?.drawImage(file.bitmap, 0, 0, canvas.width, canvas.height);
      return { ...file, canvas };
    });
    const result = await convert2textZip(files, version, format);
    const message: WorkerResponse = {
      type: "compress",
      data: result,
    };
    worker.postMessage(message);
  },
);

export {};
