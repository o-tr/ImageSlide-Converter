"use client";
import {FC, useEffect} from "react";
import {useAtomValue} from "jotai";
import { IsDragOverAtom } from "@/atoms/file-drop";
import {useRouter} from "next/navigation";

export const TransitionOnDrag:FC = () => {
  const isDragOver = useAtomValue(IsDragOverAtom);
  const router = useRouter();

  useEffect(()=>{
    if (isDragOver) {
      void router.push("/upload/pick");
    }
  },[isDragOver]);

  return <></>;
}