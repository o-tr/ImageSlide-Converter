import { FC } from "react";
import { Flex, Spin } from "antd";

export const Preparing: FC = () => (
  <div className={"flex-1 grid place-items-center"}>
    <Flex gap={16} align={"center"}>
      <Spin size={"large"} />
      <h2 className={"text-xl"}>アップロードを準備しています...</h2>
    </Flex>
  </div>
);
