import type { Rect } from "@/_types/text-zip";

export type RawImageObj = {
  index: number;
  rect: Rect;
  buffer: Buffer;
};

export type ManifestV0 = {
  path: string;
  rect: Rect;
}[];
