"use client";
import {ComponentProps, FC} from "react";
import {Footer} from "antd/lib/layout/layout";
import {theme} from "antd";

export const AntFooter: FC<ComponentProps<typeof Footer>> = (props) => {
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  return (
    <Footer style={{
      background:colorBgContainer,
      color: colorText,
      transition: "all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)"
    }} {...props}/>
  )
}