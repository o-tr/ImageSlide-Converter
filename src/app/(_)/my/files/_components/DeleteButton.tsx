import { FC } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { MdDeleteOutline } from "react-icons/md";

type Props = Readonly<{
  onDelete: () => void;
}>;

export const DeleteButton: FC<Props> = ({ onDelete }) => {
  return (
    <Popconfirm title={"削除しますか?"} onConfirm={onDelete}>
      <Tooltip placement={"top"} title={"削除"}>
        <Button icon={<MdDeleteOutline />} />
      </Tooltip>
    </Popconfirm>
  );
};
