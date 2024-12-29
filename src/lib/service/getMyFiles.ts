import { getMyFilesResponseSchema } from "@/_types/api/getMyFiles";
import axios from "axios";

export const getMyFiles = async () => {
	const _data = await axios.get("/api/my/files");
	const { success, data } = getMyFilesResponseSchema.safeParse(_data.data);
	if (!success || data.status !== "success") {
		throw new Error("Invalid response");
	}
	return data.data.files;
};
