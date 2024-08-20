export const canvas2rgba32 = (canvas: HTMLCanvasElement): number[] => {
	const context = canvas.getContext("2d");
	if (!context) throw new Error("Canvas not found");
	const data = context.getImageData(
		0,
		0,
		context.canvas.width,
		context.canvas.height,
	);
	const output = Array.from(data.data);
	const result: number[][] = [];
	for (let i = 0; i * context.canvas.width * 4 < output.length; i++) {
		result.push(
			output.slice(
				i * context.canvas.width * 4,
				(i + 1) * context.canvas.width * 4,
			),
		);
	}
	return result.toReversed().flat(1);
};
