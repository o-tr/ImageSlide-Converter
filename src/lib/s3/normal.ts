import {S3Client} from "@aws-sdk/client-s3";

export const s3NormalClient = new S3Client({
  region: "auto",
  endpoint: process.env.S3_NORMAL_ENDPOINT ?? "",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_NORMAL_ACCESS_KEY??"",
    secretAccessKey: process.env.S3_NORMAL_SECRET_KEY??"",
  },
});
