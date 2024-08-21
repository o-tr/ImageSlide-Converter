import {z} from "zod";
import {APIErrorResponseSchema} from "@/_types/api/error";

export const fileSchema = z.object({
  name: z.string(),
  fileId: z.string(),
  count: z.number(),
  createdAt: z.string(),
});

export type FileItem = z.infer<typeof fileSchema>;

export const getMyFilesResponseSchema = z.union([
  z.object({
    status: z.literal("success"),
    data: z.object({
      files: z.array(z.object({
        name: z.string(),
        fileId: z.string(),
        count: z.number(),
        createdAt: z.string(),
      })),
    })
  }),
  APIErrorResponseSchema
]);
