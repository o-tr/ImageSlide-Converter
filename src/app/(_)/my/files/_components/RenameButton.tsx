import { FC, useState } from "react";
import { Button, Input, Modal, Tooltip } from "antd";
import { TbPencil } from "react-icons/tb";
import { PatchRequest } from "@/app/api/my/files/[fileId]/route";
import { FileItem } from "@/_types/api/getMyFiles";

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
