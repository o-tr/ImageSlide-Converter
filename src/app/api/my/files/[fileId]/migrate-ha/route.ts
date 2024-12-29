import { NextResponse } from "next/server";
import { s3NormalClient } from "@/lib/s3/normal";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { S3_HA_BUCKET, S3_NORMAL_BUCKET } from "@/const/env";
import { Progress, Upload } from "@aws-sdk/lib-storage";
import { s3HAClient } from "@/lib/s3/ha";
import { getAuthorizedUser } from "@/utils/getAuthorizedUser";
import { prisma } from "@/lib/prisma";

export const POST = async (
	request: Request,
	{ params: { fileId } }: { params: { fileId: string } },
) => {
	const user = await getAuthorizedUser();
	if (!user)
		return NextResponse.json(
			{ status: "error", error: "Unauthorized" },
			{ status: 401 },
		);

	const file = await prisma.file.findFirst({
		where: {
			fileId: fileId,
			userId: user.id,
			ha: false,
		},
	});

	if (!file)
		return NextResponse.json(
			{ status: "error", error: "Not found" },
			{ status: 404 },
		);

	let responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	void (async () => {
		const processedSize = Array.from({ length: file.count }).fill(
			0,
		) as number[];
		await Promise.all(
			processedSize.map(async (_, index) => {
				await migrateHA(`${fileId}_${index}`, (v) => {
					processedSize[index] = v.loaded ?? 0;
					void writer.write(
						encoder.encode(
							JSON.stringify({
								progress:
									processedSize.reduce((pv, v) => pv + v, 0) / file.totalSize,
							}),
						),
					);
				});
			}),
		);
		await writer.close();
	})();
	await prisma.file.update({
		where: { fileId },
		data: {
			bucket: S3_HA_BUCKET,
			ha: true,
			createdAt: new Date(),
		},
	});

	return new Response(responseStream.readable, {
		headers: {
			"Content-Type": "text/event-stream",
			Connection: "keep-alive",
			"Cache-Control": "no-cache, no-transform",
		},
	});
};

const migrateHA = async (
	fileId: string,
	callback?: (progress: Progress) => void,
) => {
	const { Body } = await s3NormalClient.send(
		new GetObjectCommand({
			Bucket: S3_NORMAL_BUCKET,
			Key: fileId,
		}),
	);
	const upload = new Upload({
		client: s3HAClient,
		params: {
			Bucket: S3_HA_BUCKET,
			Key: fileId,
			Body,
		},
	});
	upload.on("httpUploadProgress", (v) => callback?.(v));
	await upload.done();

	await s3NormalClient.send(
		new DeleteObjectCommand({
			Bucket: S3_NORMAL_BUCKET,
			Key: fileId,
		}),
	);
};
