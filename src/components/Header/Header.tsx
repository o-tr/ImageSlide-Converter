import {Button, Flex} from "antd";
import {FC} from "react";
import {ToggleThemeButton} from "./ToggleThemeButton";

export const Header: FC = () => {
  return (
    <header className={"fixed top-0 right-0 p-8"}>
      <Flex gap={"middle"}>
        <Button>Sign in / Sign up</Button>
        <ToggleThemeButton/>
      </Flex>
    </header>
  )
}