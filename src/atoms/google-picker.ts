import { atom } from "jotai";

export const IsGooglePickerReadyAtom = atom(false);

export const GooglePickerTokenAtom = atom<string | null>("null");
