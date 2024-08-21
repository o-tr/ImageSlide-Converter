"use client";
import {FC, useEffect, useRef, useState} from "react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {ResultAtom} from "@/atoms/convert";
import {getNormalFileId} from "@/lib/service/getNormalFileId";
import {getNormalPreSignedPut} from "@/lib/service/getNormalPreSignedPut";
import axios, {AxiosProgressEvent} from "axios";
import {useRouter} from "next/navigation";
import {Flex, List, Spin} from "antd";
import {Preparing} from "./Preparing";
import {Completed} from "./Completed";
import {SelectedFilesAtom} from "@/atoms/file-drop";

export const Upload:FC = () => {
  const result = useAtomValue(ResultAtom);
  const [progress, setProgress] = useState<{[fileName: string]:number}>({});
  const setFiles = useSetAtom(SelectedFilesAtom);
  const router = useRouter();
  const initRef = useRef(false);
  useEffect(()=>{
    setFiles([]);
    if (initRef.current) return;
    if (result.length === 0) {
      router.push("./pick");
      return;
    }
    initRef.current = true;
    void (async()=>{
      const data = result.map<{fileSize: number, file:File}>((input) => {
        const file = new File([input], "file.txt");
        return {fileSize: input.length, file};
      });
      const fileId = await getNormalFileId();
      const contentLengths = data.map((input) => input.fileSize);
      const preSignedPut = await getNormalPreSignedPut(fileId, contentLengths);
      await Promise.all(preSignedPut.map(async(val)=>{
        const {file} = data[val.index];
        const onProgress = (progressEvent: AxiosProgressEvent) => {
          setProgress((pv)=>({
            ...pv,
            [`${fileId}_${val.index}`]: progressEvent.loaded / (progressEvent.total ?? 1)
          }));
        }
        await axios.put(val.url, file, {
          onUploadProgress: onProgress
        });
      }));
      setTimeout(()=>{
        router.push(`/convert/completed/${fileId}/${data.length}`);
      },100)
    })();
  },[result])
  
  if (Object.keys(progress).length === 0) {
    return (<Preparing/>)
  }
  if (Object.entries(progress).reduce((acc, [_, value]) => acc + value, 0) === result.length) {
    return (
      <Completed/>
    )
  }
  
  return <div className={"flex-1 grid place-items-center"}>
    <List
      itemLayout="horizontal"
      dataSource={Object.entries(progress)}
      renderItem={(item) => (
        <List.Item>
          <Flex gap={"middle"} align={"center"}>
            <Spin percent={Math.floor(item[1]*100)} size={"large"}/>
            <div>{item[0]}</div>
          </Flex>
        </List.Item>
      )}
    />
  </div>
;
}