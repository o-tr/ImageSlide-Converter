"use client";
import { FC, useEffect, useMemo, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ConvertFormatAtom,
  ResultAtom,
  UsingVersionAtom,
} from "@/atoms/convert";
import { SelectedFilesAtom } from "@/atoms/file-drop";
import { convert2textZip } from "@/lib/text-zip";
import { getAvailableFormats } from "@/utils/getAvailableFormats";
import { FileSizeLimit } from "@/const/convert";
import { TTextureFormat } from "@/_types/text-zip/formats";
import { SelectedFile } from "@/_types/file-picker";
import { useRouter } from "next/navigation";
import {RootURL} from "@/const/path";
import {postCompress} from "@/lib/workerService/postCompress";

export const Convert: FC = () => {
  const version = useAtomValue(UsingVersionAtom);
  const _format = useAtomValue(ConvertFormatAtom);
  const _files = useAtomValue(SelectedFilesAtom);
  const setResults = useSetAtom(ResultAtom);
  const availableFormats = useMemo(
    () => getAvailableFormats(version, _files),
    [version, _files],
  );
  const router = useRouter();

  const bestFormat = useMemo(() => {
    return availableFormats.toSorted((a, b) => b.priority - a.priority)[0];
  }, [availableFormats]);

  const initRef = useRef(false);

  useEffect(() => {
    if (_files.length < 1) {
      router.push("./pick");
      return;
    }
    if (initRef.current) return;
    initRef.current = true;
    postCompress(_files, bestFormat.label as TTextureFormat, version, 1).then(
      (result) => {
        setResults(result);
        router.push("./upload");
      },
    );
  }, [version, _format, _files, bestFormat, router, setResults]);
  return <></>;
};
