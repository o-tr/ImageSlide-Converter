import type { FileItem } from "@/_types/api/getMyFiles";
import { DeleteButton } from "@/app/(_)/my/files/_components/DeleteButton";
import type { PatchRequest } from "@/app/api/my/files/[fileId]/route";
import { Button, Flex, Tooltip } from "antd";
import type { FC } from "react";
import { MdOutlineOpenInNew } from "react-icons/md";
import { RenameButton } from "./RenameButton";

export const Actions: FC<{
  file: FileItem;
  updateFile: (fileId: string, data: PatchRequest) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
}> = ({ file, updateFile, deleteFile }) => {
  return (
    <Flex gap={"middle"} wrap={true}>
      <RenameButton file={file} updateFile={updateFile} />
      <Tooltip placement={"top"} title={"開く"}>
        <Button
          icon={<MdOutlineOpenInNew />}
          target={"_blank"}
          href={`/files/${file.fileId}`}
        />
      </Tooltip>
      <DeleteButton onDelete={() => deleteFile(file.fileId)} />
    </Flex>
  );
};
