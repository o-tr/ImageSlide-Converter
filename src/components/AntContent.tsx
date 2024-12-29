"use client";
import { theme } from "antd";
import { Content } from "antd/lib/layout/layout";
import type { ComponentProps, FC } from "react";

export const AntContent: FC<ComponentProps<typeof Content>> = (props) => {
	const {
		token: { colorBgContainer, colorText },
	} = theme.useToken();
	return (
		<Content
			{...props}
			style={{
				...(props.style ?? {}),
				background: colorBgContainer,
				color: colorText,
				transition: "all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)",
			}}
		/>
	);
};
