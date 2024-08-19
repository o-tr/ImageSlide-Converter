import { atom } from "jotai";

export const IsDragOverAtom = atom<boolean>(false);

export const SelectedFilesAtom = atom<File[]>([]);
