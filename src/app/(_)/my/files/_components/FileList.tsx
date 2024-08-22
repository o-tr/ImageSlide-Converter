"use client";
import {FC, useEffect, useMemo, useState} from "react";
import {FileItem} from "@/_types/api/getMyFiles";
import {getMyFiles} from "@/lib/service/getMyFiles";
import {Button, Flex, Input, Modal, Spin, SpinProps, Table, TableColumnsType, Tooltip} from "antd";
import {MdDeleteOutline, MdOutlineOpenInNew} from "react-icons/md";
import {deleteRegisteredFile} from "@/lib/service/deleteRegisteredFile";
import {signIn} from "next-auth/react";
import {postMigrateHA} from "@/lib/service/postMigrateHA";
import {BiSolidCloudUpload} from "react-icons/bi";
import {TbPencil} from "react-icons/tb";
import Compact from "antd/es/space/Compact";
import {PatchRequest} from "@/app/api/my/files/[fileId]/route";
import {patchMyFile} from "@/lib/service/patchMyFile";

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
    setLoading(true)
    await deleteRegisteredFile(fileId);
    await loadFiles();
  },[]);
  
  const updateFile = useMemo(()=>async(fileId: string, data: PatchRequest)=>{
    setLoading(true)
    await patchMyFile(fileId, data);
    await loadFiles();
  },[])
  
  useEffect(()=>{
    void loadFiles().catch((e)=>{
      void signIn("discord", {callbackUrl: "/my/files"});
    });
  },[]);
  
  
  const columns: TableColumnsType<FileItem> = useMemo(()=>([
    { title: "File Name", dataIndex: "name", key: "name" },
    { title: "URLs", dataIndex: "count", key: "count", width: 25, },
    { title: "Server", key: "server", width: 25, render: (file: FileItem) => (
      <Flex gap={"middle"} align={"center"}>
        <span>{file.server}</span>
        {file.server === "Normal" &&
          <Tooltip placement={"top"} title={"高可用性サーバへ移行"}>
            <Button
              icon={<BiSolidCloudUpload />}
              onClick={async ()=> {
                setLoading(true)
                await postMigrateHA(file.fileId, (progress)=> {
                  setLoading(true);
                  setMigrateProgress(progress)
                })
                await loadFiles()
              }}
            />
          </Tooltip>
        }
      </Flex>
    )},
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", width: 200, },
    { title: "Expire At", dataIndex: "expireAt", key: "expireAt", width: 200, },
    { title: "Actions", key: "actions", width: 175, render: (file) => <Action file={file} deleteFile={deleteFile} updateFile={updateFile}/>},
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
      <Modal open={loading === true && migrateProgress >= 0} title={"Migrating"} footer={null} closable={false}>
        <Flex gap={"middle"}>
          <Spin percent={migrateProgress*100}/>
          <div>{Math.floor(migrateProgress*100)}%</div>
        </Flex>
      </Modal>
    </div>
  )
}


const Action:FC<{
  file: FileItem
  updateFile: (fileId: string, data: PatchRequest) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
}> = ({file,updateFile,deleteFile}) => {
  const [fileName, setFileName] = useState<string|undefined>(undefined);
  
  const changeFileName = async()=>{
    if (fileName === undefined) return;
    setFileName(undefined)
    await updateFile(file.fileId, {name: fileName})
  }
  
  return (
    <Flex gap={"middle"} wrap={true}>
      <Tooltip placement={"top"} title={"名前を変更"}>
        <Button icon={<TbPencil />} onClick={()=>setFileName(file.name)}/>
      </Tooltip>
      <Modal open={fileName!==undefined} title={"Edit"} footer={null} closable={true} onCancel={()=>setFileName(undefined)}>
        <Compact style={{ width: '100%' }}>
          <Input value={fileName} onChange={(e)=>setFileName(e.target.value)} onKeyDown={(e)=>{
            e.key === "Enter" && !e.nativeEvent.isComposing && changeFileName();
          }} />
          <Button type="primary" onClick={changeFileName}>OK</Button>
        </Compact>
      </Modal>
      <Tooltip placement={"top"} title={"開く"}>
        <Button icon={<MdOutlineOpenInNew/>} target={"_blank"} href={`/convert/completed/${file.server}/${file.fileId}/${file.count}`}/>
      </Tooltip>
      <Tooltip placement={"top"} title={"削除"}>
        <Button icon={<MdDeleteOutline/>} onClick={()=> {
          void deleteFile(file.fileId)
        }}/>
      </Tooltip>
    </Flex>
  )
}
