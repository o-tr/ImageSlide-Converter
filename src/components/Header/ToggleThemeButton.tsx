"use client";
import {Button} from "antd";
import {useAtom} from "jotai";
import {ThemeIsDarkAtom} from "@/atoms/theme";
import {FC} from "react";
import { MdOutlineNightlight, MdOutlineWbSunny } from "react-icons/md";

export const ToggleThemeButton: FC = () => {
  const [isDarkMode, setIsDarkMode] = useAtom(ThemeIsDarkAtom);
  return (
    <Button onClick={()=>setIsDarkMode(pv=>!pv)}>
      {isDarkMode ? <MdOutlineNightlight/> : <MdOutlineWbSunny/> }
    </Button>
  )
}