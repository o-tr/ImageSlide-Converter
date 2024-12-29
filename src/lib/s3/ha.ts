import {
	S3_HA_ACCESS_KEY,
	S3_HA_ENDPOINT,
	S3_HA_SECRET_KEY,
} from "@/const/env";
import { S3Client } from "@aws-sdk/client-s3";

export const s3HAClient = new S3Client({
	region: "auto",
	endpoint: S3_HA_ENDPOINT,
	forcePathStyle: true,
	credentials: {
		accessKeyId: S3_HA_ACCESS_KEY,
		secretAccessKey: S3_HA_SECRET_KEY,
	},
});
