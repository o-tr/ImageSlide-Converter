import {FC} from "react";
import {Button, Flex} from "antd";
import { TbBrandGoogleDrive } from "react-icons/tb";
import { TfiHarddrive } from "react-icons/tfi";

export const Controls:FC = () => {
  return (
    <Flex gap={"middle"}>
      <Button icon={<TfiHarddrive />}>Add File From Local</Button>
      <Button icon={<TbBrandGoogleDrive />}>Add File From Google Drive</Button>
    </Flex>
  )
}