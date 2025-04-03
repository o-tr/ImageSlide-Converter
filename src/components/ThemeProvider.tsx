"use client";
import { ThemeIsDarkAtom } from "@/atoms/theme";
import { ConfigProvider, theme } from "antd";
import { useAtomValue } from "jotai";
import type { FC, ReactNode } from "react";

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
