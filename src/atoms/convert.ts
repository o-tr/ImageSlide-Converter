import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const UsingVersionAtom = atomWithStorage<string>("using-version", "");
export const ConvertFormatAtom = atomWithStorage<string>(
  "convert-format",
  "auto",
);

export const ResultAtom = atom<{
  data: string[];
  format: string;
  version: number;
}>();
