import {FC} from "react";
import {Button, Flex} from "antd";
import { TbBrandGoogleDrive } from "react-icons/tb";
import { TfiHarddrive } from "react-icons/tfi";
import {GooglePicker} from "@/app/(_)/pick/_components/GooglePicker";
import {LocalFilePicker} from "@/app/(_)/pick/_components/LocalFilePicker";

export const Controls:FC = () => {
  return (
    <Flex gap={"middle"}>
      <LocalFilePicker/>
      <GooglePicker/>
    </Flex>
  )
}