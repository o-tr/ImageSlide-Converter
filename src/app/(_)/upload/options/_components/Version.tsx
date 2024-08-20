"use client";
import {FC} from "react";
import {Flex, Radio} from "antd";
import Image from "next/image";
import {useAtom} from "jotai";
import {UsingVersionAtom} from "@/atoms/convert-options";
import {TargetVersions} from "@/const/convert";

export const Version:FC = () => {
  const [version, setVersion] = useAtom(UsingVersionAtom);
  return (
    <Flex vertical gap={"middle"}>
      <h2 className={"text-xl"}>使用している環境を選択してください</h2>
      <Radio.Group onChange={(e)=>setVersion(e.target.value)} value={version}>
        {TargetVersions.map((v, i) => <Radio.Button key={v.label} value={i} className={"w-[256px] !h-[256px]"}>
          <Flex vertical className={"p-2 text-center"}>
            <Image src={v.image} alt={v.label} width={224} height={224} className={"object-contain"}/>
            <p>{v.label}</p>
          </Flex>
        </Radio.Button>)}
      </Radio.Group>
    </Flex>
  )
}
