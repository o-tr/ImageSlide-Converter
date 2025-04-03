import { FileList } from "@/app/(_)/my/files/_components/FileList";
import { TransitionOnDrag } from "@/app/_components/TransitionOnDrag";
import { DragWatcher } from "@/components/DragWatcher";

export default function Page() {
  return (
    <>
      <FileList />
      <DragWatcher />
      <TransitionOnDrag />
    </>
  );
}
