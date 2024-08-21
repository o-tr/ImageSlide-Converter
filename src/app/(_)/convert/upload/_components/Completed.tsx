import {FC} from "react";
import {Flex, Spin} from "antd";

export const Completed:FC = () => (
  <div className={"flex-1 grid place-items-center"}>
    <Flex gap={16} align={"center"}>
      <Spin size={"large"}/>
      <h2 className={"text-xl"}>サーバーの応答を待っています...</h2>
    </Flex>
  </div>
)
