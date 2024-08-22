import {useMemo} from "react";
import {URLDisplay} from "./_components/URLDisplay";
import {S3_HA_PUBLIC_BASE_URL, S3_NORMAL_PUBLIC_BASE_URL} from "@/const/env";
import {Flex} from "antd";
import {Reset} from "./_components/Reset";
import {UploadSteps} from "@/app/(_)/convert/_components/UploadSteps";

type Props = Readonly<{ params: { fileId: string, size: string, server: string } }>

export default function Page({params}: Props) {
  const urls = useMemo(()=>{
    const ha = params.server === "ha";
    const baseUrl = ha ? S3_HA_PUBLIC_BASE_URL : S3_NORMAL_PUBLIC_BASE_URL;
    const result: string[] = [];
    for (let i = 0; i < parseInt(params.size); i++) {
      result.push(`${baseUrl}/${params.fileId}_${i}`);
    }
    return result;
  },[params]);
  return (
    <>
      <UploadSteps current={4}/>
      <div className={"flex-1 grid place-items-center"}>
        <Flex vertical gap={"middle"} className={"w-full lg:w-3/4"}>
          {urls.map((url) => (
            <URLDisplay url={url} key={url}/>
          ))}
        </Flex>
        <Reset/>
      </div>
    </>
  )
}
