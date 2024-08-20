import { atom } from "jotai";
import {SelectedFile} from "@/_types/file-picker";

export const IsDragOverAtom = atom<boolean>(false);

export const SelectedFilesAtom = atom<SelectedFile[]>([]);
