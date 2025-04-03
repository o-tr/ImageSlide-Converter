import { APIErrorResponseSchema } from "@/_types/api/error";
import { z } from "zod";

export const getNormalFileIdResponseSchema = z.union([
  z.object({
    status: z.literal("success"),
    data: z.object({
      fileId: z.string(),
    }),
  }),
  APIErrorResponseSchema,
]);
