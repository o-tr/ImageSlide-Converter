"use client";
import { ThemeIsDarkAtom } from "@/atoms/theme";
import { Button } from "antd";
import { useAtom } from "jotai";
import type { FC } from "react";
import { MdOutlineNightlight, MdOutlineWbSunny } from "react-icons/md";

export const ToggleThemeButton: FC = () => {
  const [isDarkMode, setIsDarkMode] = useAtom(ThemeIsDarkAtom);
  return (
    <Button onClick={() => setIsDarkMode((pv) => !pv)}>
      {isDarkMode ? <MdOutlineNightlight /> : <MdOutlineWbSunny />}
    </Button>
  );
};
