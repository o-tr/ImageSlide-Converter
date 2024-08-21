import {useMemo} from "react";
import {URLDisplay} from "@/app/(_)/convert/completed/[fileId]/[size]/_components/URLDisplay";
import {S3_NORMAL_PUBLIC_BASE_URL} from "@/const/env";

export default function Page({params}: {params: {fileId: string, size: string}}) {
  const urls = useMemo(()=>{
    const result: string[] = [];
    for (let i = 0; i < parseInt(params.size); i++) {
      result.push(`${S3_NORMAL_PUBLIC_BASE_URL}/${params.fileId}_${i}`);
    }
    return result;
  },[params]);
  return <div>
    {urls.map((url) => (
      <URLDisplay url={url} key={url}/>
    ))}
  </div>
}
