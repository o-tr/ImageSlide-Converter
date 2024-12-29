import { getNormalFileIdResponseSchema } from "@/_types/api/getNormalFileId";
import axios from "axios";

export const getNormalFileId = async (): Promise<string> => {
	const _response = await axios.post("/api/upload/normal/init");
	const { success, data } = getNormalFileIdResponseSchema.safeParse(
		_response.data,
	);
	if (!success || data.status !== "success") {
		throw new Error("Invalid response");
	}
	return data.data.fileId;
};
