import { APIErrorResponseSchema } from "@/_types/api/error";
import { z } from "zod";

export const PreSignedPutItemSchema = z.object({
	fileId: z.string(),
	index: z.number(),
	url: z.string(),
	publicUrl: z.string(),
});

export type PreSignedPutItem = z.infer<typeof PreSignedPutItemSchema>;

export const getNormalPreSignedPutResponseSchema = z.union([
	z.object({
		status: z.literal("success"),
		data: z.array(PreSignedPutItemSchema),
	}),
	APIErrorResponseSchema,
]);
