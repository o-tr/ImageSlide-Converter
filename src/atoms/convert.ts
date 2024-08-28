import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

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
