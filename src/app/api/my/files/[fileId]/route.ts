import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";
import {s3NormalClient} from "@/lib/s3/normal";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {S3_NORMAL_BUCKET} from "@/const/env";
import {getAuthorizedUser} from "@/utils/getAuthorizedUser";

export const DELETE = async(request:Request, { params: {fileId} }: { params: { fileId: string }},) => {
  const user = await getAuthorizedUser()
  if (!user) return NextResponse.json({status: "error", error: "Unauthorized"}, {status: 401});
  const file = user.files.find((file) => file.fileId === fileId);
  if (!file) return NextResponse.json({status: "error", error: "File not found"}, {status: 404});
  await Promise.all([
    ...Array.from({length: file.count}, (_, index) => {
      return s3NormalClient.send(new DeleteObjectCommand({
        Bucket: S3_NORMAL_BUCKET,
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