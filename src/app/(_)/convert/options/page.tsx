"use client";
import { UploadSteps } from "@/app/(_)/convert/_components/UploadSteps";
import { Button, Flex } from "antd";
import Link from "next/link";
import { Version } from "./_components/Version";
import { useAtomValue } from "jotai";
import { UsingVersionAtom } from "@/atoms/convert";
import { Format } from "@/app/(_)/convert/options/_components/Format";

export default function Page() {
  const version = useAtomValue(UsingVersionAtom);
  return (
    <>
      <UploadSteps current={1} />
      <Flex justify={"space-between"}>
        <Link href={"./pick"}>
          <Button>Prev</Button>
        </Link>
        {version > -1 ? (
          <Link href={"./convert"}>
            <Button type={"primary"}>Next</Button>
          </Link>
        ) : (
          <Button type={"primary"} disabled>
            Next
          </Button>
        )}
      </Flex>
      <Version />
      {version > -1 && <Format />}
    </>
  );
}
