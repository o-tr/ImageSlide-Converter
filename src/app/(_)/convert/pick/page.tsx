import {DragWatcher} from "@/components/DragWatcher";
import {FileList} from "./_components/FileList";
import {UploadSteps} from "@/app/(_)/convert/_components/UploadSteps";

export default function Page() {
  return (
    <>
      <UploadSteps current={0}/>
      <FileList/>
      <DragWatcher/>
    </>
  );
}