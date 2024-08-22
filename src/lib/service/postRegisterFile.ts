import axios from "axios";
import {postRegisterFileResponseSchema} from "@/_types/api/postRegisterFile";

export const postRegisterFile = async (fileId: string, fileName: string,count: number, totalSize: number) => {
  const _data = await axios.post("/api/upload/normal/register",{
    name: fileName,
    fileId: fileId,
    count: count,
    totalSize: totalSize
  })
  const {success, data} = postRegisterFileResponseSchema.safeParse(_data.data);
  if (!success || data.status !== "success") {
    throw new Error("Invalid response");
  }
}