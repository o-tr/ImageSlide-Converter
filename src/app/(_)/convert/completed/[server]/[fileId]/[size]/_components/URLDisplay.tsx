"use client";
import {FC, useState} from "react";
import {Button, Input} from "antd";
import Compact from "antd/es/space/Compact";
import {TbCheck, TbCopy} from "react-icons/tb";


export const URLDisplay:FC<{url: string}> = ({url}) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const copy = () => {
    navigator.clipboard.writeText(url).then(()=>{
      setIsCopied(true);
    });
  }
  
  return(
    <Compact block onClick={copy}>
      <Input readOnly value={url}/>
      {isCopied ? (
        <Button type="primary" className={"w-32 bg-green-300"} icon={<TbCheck/>}>Copied!</Button>
      ) : (
        <Button type="primary" className={"w-32"} icon={<TbCopy />}>Copy</Button>
      )}
    </Compact>
  )
}