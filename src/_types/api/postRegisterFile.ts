import { z } from "zod";
import { APIErrorResponseSchema } from "@/_types/api/error";

export const postRegisterFileResponseSchema = z.union([
  z.object({
    status: z.literal("success"),
  }),
  APIErrorResponseSchema,
]);
