import { deleteRegisteredFileResponseSchema } from "@/_types/api/deleteRegisteredFile";
import axios from "axios";

export const deleteRegisteredFile = async (fileId: string) => {
  const res = await axios.delete(`/api/my/files/${fileId}`);
  const { success, data } = deleteRegisteredFileResponseSchema.safeParse(
    res.data,
  );
  if (!success || data?.status !== "success") {
    throw new Error("Invalid response");
  }
};
