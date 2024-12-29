import { HeaderLogo } from "@/app/(_)/_components/HeaderLogo";
import { AntContent } from "@/components/AntContent";
import { Flex } from "antd";
import type { ReactNode } from "react";

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<AntContent className={"flex flex-col"}>
			<HeaderLogo />
			<Flex className={"px-8 flex-1 overflow-y-scroll"} vertical gap={"middle"}>
				{children}
			</Flex>
		</AntContent>
	);
}
