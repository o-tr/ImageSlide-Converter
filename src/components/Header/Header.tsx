import { UserControl } from "@/components/Header/UserControl";
import { Flex } from "antd";
import type { FC } from "react";
import { ToggleThemeButton } from "./ToggleThemeButton";

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
