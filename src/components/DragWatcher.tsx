"use client";
import {FC, useEffect} from "react";
import {useSetAtom} from "jotai";
import {IsDragOverAtom, SelectedFilesAtom} from "@/atoms/file-drop";

export const DragWatcher: FC = () => {
  const setIsDragOver = useSetAtom(IsDragOverAtom);
  const setSelectedFiles = useSetAtom(SelectedFilesAtom);
  useEffect(()=>{
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      const transfer = e.dataTransfer;
      if (transfer && transfer.files) {
        setSelectedFiles(pv=>[...pv,...Array.from(transfer.files)]);
      }
      setIsDragOver(false);
    }
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);

    return ()=>{
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop",onDrop);
    }
  },[]);

  return <></>;
}