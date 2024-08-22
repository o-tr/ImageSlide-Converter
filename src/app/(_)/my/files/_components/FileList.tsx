"use client";
import {FC, useEffect, useMemo, useState} from "react";
import {FileItem} from "@/_types/api/getMyFiles";
import {getMyFiles} from "@/lib/service/getMyFiles";
import {Button, Flex, Modal, Spin, SpinProps, Table, TableColumnsType} from "antd";
import {MdDeleteOutline, MdOutlineDriveFileMove, MdOutlineOpenInNew} from "react-icons/md";
import {deleteRegisteredFile} from "@/lib/service/deleteRegisteredFile";
import {signIn} from "next-auth/react";
import {postMigrateHA} from "@/lib/service/postMigrateHA";

export const FileList:FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean|SpinProps>(true);
  const [migrateProgress, setMigrateProgress] = useState<number>(-1);
  
  const loadFiles = async()=>{
    const files = await getMyFiles();
    setFiles(files);
    setMigrateProgress(-1);
    setLoading(false)
  }
  
  const deleteFile = useMemo(()=>async(fileId: string)=>{
    await deleteRegisteredFile(fileId);
    await loadFiles();
  },[]);
  
  useEffect(()=>{
    void loadFiles().catch((e)=>{
      void signIn("discord", {callbackUrl: "/my/files"});
    });
  },[]);
  
  const columns: TableColumnsType<FileItem> = useMemo(()=>([
    { title: "File Name", dataIndex: "name", key: "name" },
    { title: "URLs", dataIndex: "count", key: "count", width: 25, },
    { title: "Server", dataIndex: "server", key: "server", width: 25, },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", width: 200, },
    { title: "Expire At", dataIndex: "expireAt", key: "expireAt", width: 200, },
    { title: "Actions", key: "actions", width: 100, render: (file: FileItem) => <Flex gap={"middle"}>
        <Button
          icon={<MdOutlineDriveFileMove />}
          onClick={async ()=> {
            setLoading(true)
            await postMigrateHA(file.fileId, (progress)=> {
              setLoading(true);
              setMigrateProgress(progress)
            })
            await loadFiles()
          }}
          disabled={file.server === "HA"}
        >高可用性サーバへ移行</Button>
        <Button icon={<MdOutlineOpenInNew/>} target={"_blank"} href={`/convert/completed/${file.server}/${file.fileId}/${file.count}`}>開く</Button>
        <Button icon={<MdDeleteOutline/>} onClick={()=> {
          setLoading(true)
          void deleteFile(file.fileId)
        }}>削除</Button>
      </Flex> },
  ]),[deleteFile]);
  
  return(
    <div>
      <Table
        loading={loading}
        dataSource={files}
        rowKey="fileId"
        columns={columns}
        pagination={false}
      />
      <Modal open={loading === true && migrateProgress >= 0} title={"Migrating"} footer={null} closable={false}>
        <Flex gap={"middle"}>
          <Spin percent={migrateProgress*100}/>
          <div>{Math.floor(migrateProgress*100)}%</div>
        </Flex>
      </Modal>
    </div>
  )
}
