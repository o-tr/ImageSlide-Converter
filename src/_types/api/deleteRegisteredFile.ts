import { APIErrorResponseSchema } from "@/_types/api/error";
import { z } from "zod";

export const deleteRegisteredFileResponseSchema = z.union([
  z.object({
    status: z.literal("success"),
  }),
  APIErrorResponseSchema,
]);
