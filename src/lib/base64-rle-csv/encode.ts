const seek_length = 4;

export const encode = (input: string): string => {
	if (input.length === 0) return "";

	const result: {
		str: string;
		count: number;
	}[] = [];

	const push = (str: string, count: number) => {
		if (str.length * count < 8) {
			if (result[result.length - 1]?.count === 1) {
				result[result.length - 1].str += str.repeat(count);
				return;
			}
			result.push({ str: str.repeat(count), count: 1 });
			return;
		}
		result.push({ str: str, count: count });
	};

	for (let i = 0; i < input.length; i++) {
		for (let j = seek_length; j > 0; j--) {
			if (j === 1) {
				if (input[i] === input[i + 1]) {
					let count = 1;
					while (input[i] === input[i + count]) {
						count++;
					}
					push(input[i], count);
					i += count - 1;
					continue;
				}
				const lastElem = result[result.length - 1];
				if (lastElem?.count === 1) {
					lastElem.str += input[i];
					continue;
				}
				push(input[i], 1);
				continue;
			}
			const current = input.slice(i, i + j);
			if (current === input.slice(i + j, i + 2 * j) && !isSameChars(current)) {
				let count = 1;
				while (current === input.slice(i + count * j, i + (count + 1) * j)) {
					count++;
				}
				push(current, count);
				i += count * j - 1;
				break;
			}
		}
	}
	const resultStr = result
		.map((x) => {
			return `${int2str(x.count)},${x.str}`;
		})
		.join(",");

	return `${result.length * 2}:${resultStr}`;
};

const int2str = (input: number) => {
	return input.toString();
};

const isSameChars = (input: string) => {
	for (let i = 1; i < input.length; i++) {
		if (input[i] !== input[0]) return false;
	}
	return true;
};
