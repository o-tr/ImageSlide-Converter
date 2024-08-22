"use client";
import { FC, useEffect, useState } from "react";
import { Button, Flex, Input, Result, Spin } from "antd";
import Compact from "antd/es/space/Compact";
import { TbCheck, TbCopy } from "react-icons/tb";
import { getFile } from "@/lib/service/getFile";
import { FileItem } from "@/_types/api/getMyFiles";
import { S3_HA_PUBLIC_BASE_URL, S3_NORMAL_PUBLIC_BASE_URL } from "@/const/env";
import { redirect } from "next/navigation";
import Link from "next/link";

export const URLDisplay: FC<{ fileId: string }> = ({ fileId }) => {
  const [files, setFiles] = useState<string[] | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const file = await getFile(fileId);
        const ha = file.server.toLowerCase() === "ha";
        const baseUrl = ha ? S3_HA_PUBLIC_BASE_URL : S3_NORMAL_PUBLIC_BASE_URL;
        const result: string[] = [];
        for (let i = 0; i < file.count; i++) {
          result.push(`${baseUrl}/${fileId}_${i}`);
        }
        setFiles(result);
      } catch (e) {
        setNotFound(true);
      }
    })();
  }, [fileId]);

  if (notFound) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="ファイルの保持期間が終了したか、ファイルが存在しません。"
        extra={
          <Link href={"/"}>
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Flex vertical>
        {files?.map((url, i) => <URLDisplayItem key={i} url={url} />)}
        {!files && (
          <Flex gap={"middle"} align={"center"}>
            <Spin size={"large"} />
            <span>Loading...</span>
          </Flex>
        )}
      </Flex>
      <div>
        <p>
          このページのURLと上記のURLは、知っていれば誰でもアクセスすることができます
        </p>
        <p>取り扱いには注意してください</p>
      </div>
    </>
  );
};

const URLDisplayItem: FC<{ url: string }> = ({ url }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
    });
  };

  return (
    <Compact block onClick={copy}>
      <Input readOnly value={url} />
      {isCopied ? (
        <Button
          type="primary"
          className={"w-32 bg-green-300"}
          icon={<TbCheck />}
        >
          Copied!
        </Button>
      ) : (
        <Button type="primary" className={"w-32"} icon={<TbCopy />}>
          Copy
        </Button>
      )}
    </Compact>
  );
};
