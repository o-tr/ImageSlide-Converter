import {FC} from "react";
import Image from "next/image";
import {Flex} from "antd";

export const HeaderLogo:FC = () => {
  return (
    <div className={"p-8"}>
      <Flex gap={16} align={"center"} className={"h-[32px]"}>
        <Image src={"/icon.png"} alt={"logo"} width={32} height={32}/>
        <span className={"text-2xl hidden sm:block"}>ImageSlide Converter</span>
      </Flex>
    </div>
  );
}