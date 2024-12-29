"use client";
import { IsDragOverAtom, SelectedFilesAtom } from "@/atoms/file-drop";
import { canvas2selectedFile } from "@/lib/canvas2selected-files";
import { files2canvases } from "@/lib/file2canvas";
import { Flex } from "antd";
import { useAtom, useSetAtom } from "jotai";
import { type FC, useEffect } from "react";
import { TbDragDrop } from "react-icons/tb";

export const DragWatcher: FC = () => {
	const [isDragOver, setIsDragOver] = useAtom(IsDragOverAtom);
	const setSelectedFiles = useSetAtom(SelectedFilesAtom);
	useEffect(() => {
		const onDragOver = (e: DragEvent) => {
			e.preventDefault();
			setIsDragOver(true);
		};
		const onDragLeave = (e: DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);
		};
		const onDrop = async (e: DragEvent) => {
			e.preventDefault();
			const transfer = e.dataTransfer;
			if (transfer?.files) {
				const files = (await files2canvases(transfer.files)).map(
					({ canvas, fileName }) => canvas2selectedFile(fileName, canvas),
				);
				setSelectedFiles((pv) => [...pv, ...files]);
			}
			setIsDragOver(false);
		};
		document.addEventListener("dragover", onDragOver);
		document.addEventListener("dragleave", onDragLeave);
		document.addEventListener("drop", onDrop);

		return () => {
			document.removeEventListener("dragover", onDragOver);
			document.removeEventListener("dragleave", onDragLeave);
			document.removeEventListener("drop", onDrop);
		};
	}, [setIsDragOver, setSelectedFiles]);

	if (!isDragOver) return <></>;
	return (
		<div className={"fixed inset-0 bg-black bg-opacity-75 z-50"}>
			<div className={"absolute inset-0 flex items-center justify-center"}>
				<Flex gap={16} align={"center"}>
					<TbDragDrop style={{ width: "32px", height: "32px" }} />
					<span>ファイルをドロップして追加</span>
				</Flex>
			</div>
		</div>
	);
};
