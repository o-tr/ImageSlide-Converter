import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {NextResponse} from "next/server";
import {s3NormalClient} from "@/lib/s3/normal";
import {z} from "zod";
import { getSession } from "@/lib/iron-session";
import {cookies} from "next/headers";
import {S3_NORMAL_BUCKET, S3_NORMAL_PUBLIC_BASE_URL} from "@/const/env";
import {ActualFileSizeLimit} from "@/const/convert";

const generatePreSignedPutUrl = async (fileName: string, contentLength: number): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: S3_NORMAL_BUCKET,
    Key: fileName,
    ContentLength: contentLength,
  });
  return await getSignedUrl(s3NormalClient, command, { expiresIn: 3600 });
}

const GetPreSignedPutSchema = z.object({
  fileId: z.string(),
  data: z.array(z.object({
    index: z.number(),
    contentLength: z.number(),
  })),
});

export const POST = async (request: Request) => {
  const _body = await request.json();
  const body = GetPreSignedPutSchema.safeParse(_body);
  if (!body.success) {
    return NextResponse.json({
      status: "error",
      error: "Invalid request"
    }, {status: 400});
  }
  const session = await getSession(cookies());
  if (!session?.fileId){
    return NextResponse.json({
      status: "error",
      error: "Invalid request"
    }, {status: 400});
  }
  const {fileId, data} = body.data;

  if (data.some(val=>val.contentLength > ActualFileSizeLimit)){
    return NextResponse.json({
      status: "error",
      error: "Invalid request"
    }, {status: 400});
  }
  
  const result = await Promise.all(data.map(async(val)=>({
    fileId: fileId,
    index: val.index,
    url: await generatePreSignedPutUrl(`${fileId}_${val.index}`, val.contentLength),
    publicUrl: `${S3_NORMAL_PUBLIC_BASE_URL}/${fileId}_${val.index}`,
  })));
  
  return NextResponse.json({
    status: "success",
    data: result,
  });
}
