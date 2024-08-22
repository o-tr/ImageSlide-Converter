import {redirect} from "next/navigation";

//サーバーが指定される前のURLなので実際はserver->fileId, fileId->sizeが正しい
type Props = Readonly<{ params: { fileId: string, server: string } }>

export default function Page({params}: Props) {
  redirect(`/files/${params.server}`)
}
