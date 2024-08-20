import {Button, Flex} from "antd";
import {FC} from "react";
import {ToggleThemeButton} from "./ToggleThemeButton";
import {SignIn} from "@/components/Header/SignIn";

export const Header: FC = () => {
  return (
    <header className={"fixed top-0 right-0 p-8"}>
      <Flex gap={"middle"}>
        <SignIn/>
        <ToggleThemeButton/>
      </Flex>
    </header>
  )
}