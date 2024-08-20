import {DragWatcher} from "@/components/DragWatcher";
import {Flex} from "antd";
import {FileList} from "@/app/(_)/pick/_components/FileList";
export default function Page() {
  
  return (
    <>
      <FileList/>
      <DragWatcher/>
    </>
  );
}