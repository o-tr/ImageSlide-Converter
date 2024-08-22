import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";
import {s3NormalClient} from "@/lib/s3/normal";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {S3_HA_BUCKET, S3_NORMAL_BUCKET} from "@/const/env";
import {getAuthorizedUser} from "@/utils/getAuthorizedUser";
import {s3HAClient} from "@/lib/s3/ha";

export const DELETE = async(request:Request, { params: {fileId} }: { params: { fileId: string }},) => {
  const user = await getAuthorizedUser()
  if (!user) return NextResponse.json({status: "error", error: "Unauthorized"}, {status: 401});
  const file = user.files.find((file) => file.fileId === fileId);
  if (!file) return NextResponse.json({status: "error", error: "File not found"}, {status: 404});
  
  const client = file.ha ? s3HAClient : s3NormalClient;
  const bucket = file.ha ? S3_HA_BUCKET : S3_NORMAL_BUCKET;
  
  await Promise.all([
    ...Array.from({length: file.count}, (_, index) => {
      return client.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: `${fileId}_${index}`,
      }));
    }),
    prisma.file.delete({
      where: {
        id: file.id,
      }
    })
  ])
  return NextResponse.json({status: "success"});
}