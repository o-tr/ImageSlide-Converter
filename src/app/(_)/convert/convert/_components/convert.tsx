"use client";
import {FC, useEffect, useMemo} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {ConvertFormatAtom, ResultAtom, UsingVersionAtom} from "@/atoms/convert";
import {SelectedFilesAtom} from "@/atoms/file-drop";
import {convert2textZip} from "@/lib/text-zip";
import {getAvailableFormats} from "@/utils/getAvailableFormats";
import {FileSizeLimit} from "@/const/convert";
import {TTextureFormat} from "@/_types/text-zip/formats";
import {SelectedFile} from "@/_types/file-picker";
import {useRouter} from "next/navigation";

export const Convert: FC = () => {
  const version = useAtomValue(UsingVersionAtom);
  const _format = useAtomValue(ConvertFormatAtom);
  const _files = useAtomValue(SelectedFilesAtom);
  const setResults = useSetAtom(ResultAtom);
  const availableFormats = useMemo(()=>getAvailableFormats(version,_files),[version]);
  const router = useRouter();
  
  const bestFormat = useMemo(()=> {
    return availableFormats.toSorted((a, b) => b.priority - a.priority )[0];
  },[availableFormats]);
  useEffect(() => {
    setTimeout((async () => {
      const {format, files} = ((): {format: TTextureFormat, files: SelectedFile[]} => {
        switch (_format) {
          case "auto":
            return {format: bestFormat.label, files: _files};
          case "auto-one-file": {
            const scale = Math.floor(Math.min(((FileSizeLimit - 1024*1024) / bestFormat.fileSize), 1) * 100) / 100;
            return {format: bestFormat.label, files: resizeFiles(_files, scale)};
          }
          default:
            return {format: _format as TTextureFormat, files: _files};
        }
      })();
      const result = await convert2textZip(files, version, format);
      setResults(result);
      router.push("./upload");
    }),100);
  }, [version,_format,_files]);
  return <></>;
}

const resizeFiles = (files: SelectedFile[], scale: number) => {
  return files.map((file) => {
    const canvas = file.canvas;
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width * scale;
    newCanvas.height = canvas.height * scale;
    newCanvas.getContext("2d")?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newCanvas.width, newCanvas.height);
    return {
      ...file,
      canvas: newCanvas,
    };
  });
}
