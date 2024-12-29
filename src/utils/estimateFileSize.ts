import { SelectedFile } from "@/_types/file-picker";

export const estimateFileSize = (
	files: SelectedFile[],
	bytePerPixel: number,
): number => {
	const pixelCount = files.reduce((pv, val) => {
		return pv + val.canvas.width * val.canvas.height;
	}, 0);
	return (pixelCount * bytePerPixel * 4) / 3; //base64でエンコードするときに4/3倍になる
};
