import {FC} from "react";
import {FileItem} from "@/_types/api/getMyFiles";
import {PatchRequest} from "@/app/api/my/files/[fileId]/route";
import {Button, Flex, Tooltip} from "antd";
import {MdDeleteOutline, MdOutlineOpenInNew} from "react-icons/md";
import {RenameButton} from "./RenameButton";

export const Actions:FC<{
  file: FileItem
  updateFile: (fileId: string, data: PatchRequest) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
}> = ({file,updateFile,deleteFile}) => {
  return (
    <Flex gap={"middle"} wrap={true}>
      <RenameButton file={file} updateFile={updateFile}/>
      <Tooltip placement={"top"} title={"開く"}>
        <Button icon={<MdOutlineOpenInNew/>} target={"_blank"} href={`/files/${file.fileId}`}/>
      </Tooltip>
      <Tooltip placement={"top"} title={"削除"}>
        <Button icon={<MdDeleteOutline/>} onClick={()=> {
          void deleteFile(file.fileId)
        }}/>
      </Tooltip>
    </Flex>
  )
}
