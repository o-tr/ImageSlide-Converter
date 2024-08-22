import { FC } from "react";
import { Flex } from "antd";
import { GooglePicker } from "./GooglePicker";
import { LocalFilePicker } from "./LocalFilePicker";

export const Controls: FC = () => {
  return (
    <Flex gap={"middle"}>
      <LocalFilePicker />
      <GooglePicker />
    </Flex>
  );
};
