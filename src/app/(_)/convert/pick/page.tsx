import { UploadSteps } from "@/app/(_)/convert/_components/UploadSteps";
import { DragWatcher } from "@/components/DragWatcher";
import { FileList } from "./_components/FileList";

export default function Page() {
	return (
		<>
			<UploadSteps current={0} />
			<FileList />
			<DragWatcher />
		</>
	);
}
