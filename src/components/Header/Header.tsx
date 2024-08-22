import { Flex } from "antd";
import { FC } from "react";
import { ToggleThemeButton } from "./ToggleThemeButton";
import { UserControl } from "@/components/Header/UserControl";

export const Header: FC = () => {
  return (
    <header className={"fixed top-0 right-0 p-8"}>
      <Flex gap={"middle"}>
        <UserControl />
        <ToggleThemeButton />
      </Flex>
    </header>
  );
};
