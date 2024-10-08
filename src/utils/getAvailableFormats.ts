import { TargetFormats, TargetVersions } from "@/const/convert";
import { estimateFileSize } from "@/utils/estimateFileSize";
import { SelectedFile } from "@/_types/file-picker";

export const getAvailableFormats = (version: string, files: SelectedFile[]) => {
  const supported = TargetVersions.find((v) => v.label === version)?.formats;
  if (!supported) {
    return [];
  }
  return TargetFormats.filter((v) => supported.includes(v.label)).map(
    (format) => ({
      ...format,
      fileSize: estimateFileSize(files, format.bytePerPixel),
    }),
  );
};
