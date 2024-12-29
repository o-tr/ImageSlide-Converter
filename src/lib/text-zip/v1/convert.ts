import { SelectedFile } from "@/_types/file-picker";
import { canvas2rawImage } from "@/lib/canvas2rawImage";
import { TTextureFormat } from "@/_types/text-zip/formats";
import { compressFile } from "./compress";

export const convert2v1 = async (
	files: SelectedFile[],
	format: TTextureFormat,
): Promise<string[]> => {
	const _files = files.map((file, index) => ({
		index,
		rect: {
			width: file.canvas.width,
			height: file.canvas.height,
		},
		format,
		note: file.note,
		buffer: Buffer.from(canvas2rawImage(file.canvas, format)),
	}));
	return await compressFile(_files);
};
