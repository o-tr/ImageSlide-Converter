"use client";
import { ResultAtom } from "@/atoms/convert";
import { SelectedFilesAtom } from "@/atoms/file-drop";
import { useSetAtom } from "jotai/index";
import { type FC, useEffect } from "react";

export const Reset: FC = () => {
  const setResult = useSetAtom(ResultAtom);
  const setFiles = useSetAtom(SelectedFilesAtom);

  useEffect(() => {
    setResult(undefined);
    setFiles([]);
  }, [setResult, setFiles]);
  return <></>;
};
