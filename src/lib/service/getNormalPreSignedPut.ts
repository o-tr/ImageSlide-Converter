import axios from "axios";
import {getNormalPreSignedPutResponseSchema, PreSignedPutItem} from "@/_types/api/getNormalPreSignedPut";

export const getNormalPreSignedPut = async(fileId: string, contentLengths: number[]): Promise<PreSignedPutItem[]> => {
  const _response = await axios.post("/api/upload/normal/get-presigned-put", {
    fileId,
    data: contentLengths.map((contentLength, index) => ({
      index,
      contentLength,
    }))
  });
  const {success, data} = getNormalPreSignedPutResponseSchema.safeParse(_response.data);
  if (!success || data.status !== "success") {
    throw new Error("Invalid response");
  }
  return data.data;
}
