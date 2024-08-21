"use client";
import {FC, useEffect, useMemo, useState} from "react";
import {FileItem} from "@/_types/api/getMyFiles";
import {getMyFiles} from "@/lib/service/getMyFiles";
import {Button, Flex, Table, TableColumnsType} from "antd";
import {MdDeleteOutline, MdOutlineOpenInNew} from "react-icons/md";
import {deleteRegisteredFile} from "@/lib/service/deleteRegisteredFile";
import {signIn} from "next-auth/react";

export const FileList:FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadFiles = async()=>{
    const files = await getMyFiles();
    setFiles(files);
    setLoading(false)
  }
  
  const deleteFile = async(fileId: string)=>{
    await deleteRegisteredFile(fileId);
    await loadFiles();
  }
  
  useEffect(()=>{
    void loadFiles().catch(()=>{
      void signIn("discord", {callbackUrl: "/my/files"});
    });
  },[]);
  
  const columns: TableColumnsType<FileItem> = useMemo(()=>([
    { title: "File Name", dataIndex: "name", key: "name" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    { title: "Actions", key: "actions", render: (file: FileItem) => <Flex gap={"middle"}>
        <Button icon={<MdOutlineOpenInNew/>} target={"_blank"} href={`/convert/completed/${file.fileId}/${file.count}`}>開く</Button>
        <Button icon={<MdDeleteOutline/>} onClick={()=> {
          setLoading(true)
          void deleteFile(file.fileId)
        }}>削除</Button>
      </Flex> },
  ]),[]);
  
  return(
    <div>
      <Table
        loading={loading}
        dataSource={files}
        rowKey="fileId"
        columns={columns}
        pagination={false}
      />
    </div>
  )
}
