"use client";
import {FC} from "react";
import {IsDragOverAtom} from "@/atoms/file-drop";
import { useAtomValue} from "jotai";
import {TbDragDrop} from "react-icons/tb";
import {Flex} from "antd";

export const DragOverlay: FC = () => {
  const isDragOver = useAtomValue(IsDragOverAtom);
  if (!isDragOver) return <></>;
  return (
    <div className={"fixed inset-0 bg-black bg-opacity-75"}>
      <div className={"absolute inset-0 flex items-center justify-center"}>
        <Flex gap={16} align={"center"}>
          <TbDragDrop style={{width:"32px",height:"32px"}}/>
          <span>ファイルをドロップして追加</span>
        </Flex>
      </div>
    </div>
  )
}