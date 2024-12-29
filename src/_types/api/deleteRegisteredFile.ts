import { z } from "zod";
import { APIErrorResponseSchema } from "@/_types/api/error";

export const deleteRegisteredFileResponseSchema = z.union([
	z.object({
		status: z.literal("success"),
	}),
	APIErrorResponseSchema,
]);
