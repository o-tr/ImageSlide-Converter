import type { BoundingBox } from "@/_types/lib/crop";

export const diff2boundingBox = (
	maskArray: Uint8Array,
	width: number,
	height: number,
): BoundingBox[] => {
	const visited = new Uint8Array(width * height); // 探索したかどうか
	const boxes: BoundingBox[] = [];

	for (let idx = 0; idx < width * height; idx++) {
		if (maskArray[idx] === 1 && visited[idx] === 0) {
			// 新しい連結成分を見つけた => BFS or DFSで探索
			const stack = [idx];
			visited[idx] = 1;

			// バウンディングボックスの初期値 (xMin,xMax,yMin,yMax)
			let xMin = width;
			let xMax = 0;
			let yMin = height;
			let yMax = 0;

			while (stack.length > 0) {
				const current = stack.pop();
				if (current === undefined) {
					throw new Error("unknown error");
				}
				const cx = current % width;
				const cy = Math.floor(current / width);

				// バウンディングボックス更新
				if (cx < xMin) xMin = cx;
				if (cx > xMax) xMax = cx;
				if (cy < yMin) yMin = cy;
				if (cy > yMax) yMax = cy;

				// 近傍ピクセルを探索(上下左右4近傍)
				const neighbors = [
					current - width, // up
					current + width, // down
					current - 1, // left
					current + 1, // right
				];

				for (const nb of neighbors) {
					if (nb < 0 || nb >= width * height) {
						continue; // 範囲外
					}
					const nx = nb % width;
					const ny = Math.floor(nb / width);

					// 左右端で折り返さないようにする
					if (Math.abs(nx - cx) + Math.abs(ny - cy) > 1) {
						continue;
					}

					if (maskArray[nb] === 1 && visited[nb] === 0) {
						visited[nb] = 1;
						stack.push(nb);
					}
				}
			}

			// 連結成分のバウンディングボックスを格納
			const boxWidth = yMax - yMin + 1;
			const boxHeight = yMax - yMin + 1;
			boxes.push({
				x1: xMin,
				y1: yMin,
				x2: xMax,
				y2: yMax,
				width: boxWidth,
				height: boxHeight,
				area: boxWidth * boxHeight,
			});
		}
	}

	// バウンディングボックスを大きい順にソート
	boxes.sort((a, b) => b.area - a.area);
	return boxes;
};
