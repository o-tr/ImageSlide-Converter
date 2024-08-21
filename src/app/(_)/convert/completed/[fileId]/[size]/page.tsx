import {useMemo} from "react";
import {URLDisplay} from "@/app/(_)/convert/completed/[fileId]/[size]/_components/URLDisplay";
import {S3_NORMAL_PUBLIC_BASE_URL} from "@/const/env";
import {Flex} from "antd";

export default function Page({params}: {params: {fileId: string, size: string}}) {
  const urls = useMemo(()=>{
    const result: string[] = [];
    for (let i = 0; i < parseInt(params.size); i++) {
      result.push(`${S3_NORMAL_PUBLIC_BASE_URL}/${params.fileId}_${i}`);
    }
    return result;
  },[params]);
  return <div className={"flex-1 grid place-items-center"}>
    <Flex vertical gap={"middle"} className={"w-full lg:w-3/4"}>
      {urls.map((url) => (
        <URLDisplay url={url} key={url}/>
      ))}
    </Flex>
  </div>
}
