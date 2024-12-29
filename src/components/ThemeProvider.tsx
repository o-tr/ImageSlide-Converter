"use client";
import { FC, ReactNode } from "react";
import { ConfigProvider, theme } from "antd";
import { ThemeIsDarkAtom } from "@/atoms/theme";
import { useAtomValue } from "jotai";

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const isDarkMode = useAtomValue(ThemeIsDarkAtom);
	const { defaultAlgorithm, darkAlgorithm } = theme;
	return (
		<ConfigProvider
			theme={{
				algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
			}}
		>
			{children}
		</ConfigProvider>
	);
};
