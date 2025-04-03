import type { TTextureFormat } from "@/_types/text-zip/formats";

export const ETIExtensions = ["note"];

export type ETIExtension = (typeof ETIExtensions)[number];

export type ETIExtensionObject = {
  note?: string;
} & { [key in ETIExtension]?: string };

export type ETIManifestV1 = {
  t: "eti"; //type
  c: "base64-rle-csv"; //compressor
  v: 1; //version
  f: string[]; //features
  e: ETIExtension[]; //extensions
  i: ETIFileV1[]; //items
};

export type ETIFileV1 = ETIFileV1Master | ETIFileV1Cropped;

type ETIFileV1Base = {
  n: string; //name
  f: TTextureFormat; //format
  w: number; //width
  h: number; //height
  e?: ETIExtensionObject; //extensions
};

export type ETIFileV1Master = ETIFileV1Base & {
  t: "m"; //type: master
  s: number; //start
  l: number; //length
};

export type ETIFileV1Cropped = ETIFileV1Base & {
  t: "c"; //type: cropped
  r: ETIFileV1CroppedPart[]; //rects
};

export type ETIFileV1CroppedPart = {
  x: number;
  y: number;
  w: number; //width
  h: number; //height
  s: number; //start
  l: number; //length
};
