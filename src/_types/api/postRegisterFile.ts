import { APIErrorResponseSchema } from "@/_types/api/error";
import { z } from "zod";

export const postRegisterFileResponseSchema = z.union([
	z.object({
		status: z.literal("success"),
	}),
	APIErrorResponseSchema,
]);
