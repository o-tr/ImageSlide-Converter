import { Button, Flex } from "antd";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

export const HeaderLogo: FC = () => {
  return (
    <div className={"p-6"}>
      <Link href={"/"}>
        <Button type={"text"} className={"!h-[48px]"}>
          <Flex gap={16} align={"center"} className={"h-[32px]"}>
            <Image src={"/icon.png"} alt={"logo"} width={32} height={32} />
            <span className={"text-2xl hidden sm:block"}>
              ImageSlide Converter
            </span>
          </Flex>
        </Button>
      </Link>
    </div>
  );
};
