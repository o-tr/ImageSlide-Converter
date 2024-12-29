import { z } from "zod";
import { APIErrorResponseSchema } from "@/_types/api/error";

export const fileSchema = z.object({
	name: z.string(),
	fileId: z.string(),
	count: z.number(),
	server: z.union([z.literal("HA"), z.literal("Normal")]),
	format: z.string(),
	version: z.number(),
	createdAt: z.string(),
	expireAt: z.string(),
});

export type FileItem = z.infer<typeof fileSchema>;

export const getMyFilesResponseSchema = z.union([
	z.object({
		status: z.literal("success"),
		data: z.object({
			files: z.array(fileSchema),
		}),
	}),
	APIErrorResponseSchema,
]);
