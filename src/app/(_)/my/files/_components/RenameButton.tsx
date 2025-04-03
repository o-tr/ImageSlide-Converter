import type { FileItem } from "@/_types/api/getMyFiles";
import type { PatchRequest } from "@/app/api/my/files/[fileId]/route";
import { Button, Input, Modal, Tooltip } from "antd";
import { type FC, useState } from "react";
import { TbPencil } from "react-icons/tb";

export const RenameButton: FC<{
  file: FileItem;
  updateFile: (fileId: string, data: PatchRequest) => Promise<void>;
}> = ({ file, updateFile }) => {
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const changeFileName = async () => {
    if (fileName === undefined) return;
    setFileName(undefined);
    await updateFile(file.fileId, { name: fileName });
  };

  return (
    <>
      <Tooltip placement={"top"} title={"名前を変更"}>
        <Button icon={<TbPencil />} onClick={() => setFileName(file.name)} />
      </Tooltip>
      <Modal
        open={fileName !== undefined}
        title={"Edit"}
        closable={true}
        onCancel={() => setFileName(undefined)}
        onOk={changeFileName}
      >
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && !e.nativeEvent.isComposing && changeFileName();
          }}
        />
      </Modal>
    </>
  );
};
