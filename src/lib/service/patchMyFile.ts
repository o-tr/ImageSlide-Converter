import type { PatchRequest } from "@/app/api/my/files/[fileId]/route";
import axios from "axios";

export const patchMyFile = async (fileId: string, data: PatchRequest) => {
  await axios.patch(`/api/my/files/${fileId}`, data);
};
