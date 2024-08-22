"use client";
import { Button, Result } from "antd";
import Link from "next/link";
import { AntContent } from "@/components/AntContent";

export default function Page() {
  return (
    <AntContent className={"flex-1 grid place-items-center"}>
      <Result
        status="404"
        title="404"
        subTitle="ページは見つかりませんでした"
        extra={
          <Link href={"/"}>
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </AntContent>
  );
}
