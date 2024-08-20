"use client";
import {FC, useEffect} from "react";
import {useSetAtom} from "jotai";
import {IsDragOverAtom, SelectedFilesAtom} from "@/atoms/file-drop";
import {files2canvases} from "@/lib/file2canvas";
import {canvas2selectedFile} from "@/lib/canvas2selected-files";

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
    const onDrop = async(e: DragEvent) => {
      e.preventDefault()
      const transfer = e.dataTransfer;
      if (transfer && transfer.files) {
        const files = (await files2canvases(transfer.files)).map(({canvas, file})=>canvas2selectedFile(file,canvas));
        setSelectedFiles(pv=>[...pv,...files]);
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