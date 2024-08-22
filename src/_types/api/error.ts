import { z } from "zod";

export const APIErrorResponseSchema = z.object({
  status: z.literal("error"),
  error: z.string(),
});
