import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const UsingVersionAtom = atomWithStorage<number>("using-version", -1);
export const ConvertFormatAtom = atomWithStorage<string>(
  "convert-format",
  "auto",
);

export const ResultAtom = atom<string[]>([]);
