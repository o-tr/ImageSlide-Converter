import {FC} from "react";
import {Input} from "antd";

export const URLDisplay:FC<{url: string}> = ({url}) => {
  return <Input readOnly value={url}/>
}