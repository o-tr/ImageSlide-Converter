import { postRegisterFileResponseSchema } from "@/_types/api/postRegisterFile";
import axios from "axios";

export const postRegisterFile = async (
	fileId: string,
	fileName: string,
	count: number,
	totalSize: number,
	format: string,
	version: number,
) => {
	const _data = await axios.post("/api/upload/normal/register", {
		name: fileName,
		fileId: fileId,
		format: format,
		version: version,
		count: count,
		totalSize: totalSize,
	});
	const { success, data } = postRegisterFileResponseSchema.safeParse(
		_data.data,
	);
	if (!success || data.status !== "success") {
		throw new Error("Invalid response");
	}
};
