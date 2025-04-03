import type { SelectedFile } from "@/_types/file-picker";
import { file2selectedFiles } from "./file2selectedFiles";

export const files2selectedFiles = async (
  files: File[] | FileList,
): Promise<SelectedFile[]> => {
  return (await Promise.all(Array.from(files).map(file2selectedFiles))).flat(1);
};
