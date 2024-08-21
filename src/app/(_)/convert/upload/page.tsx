import {Upload} from "@/app/(_)/convert/upload/_components/Upload";
import {UploadSteps} from "@/app/(_)/convert/_components/UploadSteps";

export default function Page() {
  return (
    <>
      <UploadSteps current={3}/>
      <Upload/>
    </>
  )
}
