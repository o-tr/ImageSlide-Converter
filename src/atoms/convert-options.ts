import {atomWithStorage} from "jotai/utils";

export const UsingVersionAtom = atomWithStorage<number>("using-version", -1);
export const ConvertFormatAtom = atomWithStorage<string>("convert-format", "auto");
