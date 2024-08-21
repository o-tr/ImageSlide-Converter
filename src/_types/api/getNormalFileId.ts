import {z} from "zod";
import {APIErrorResponseSchema} from "@/_types/api/error";

export const getNormalFileIdResponseSchema = z.union([
  z.object({
    status: z.literal("success"),
    data: z.object({
      fileId: z.string(),
    }),
  }),
  APIErrorResponseSchema,
])