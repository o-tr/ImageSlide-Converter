"use client";
import { FC, useEffect } from "react";
import { useSetAtom } from "jotai/index";
import { ResultAtom } from "@/atoms/convert";
import { SelectedFilesAtom } from "@/atoms/file-drop";

export const Reset: FC = () => {
	const setResult = useSetAtom(ResultAtom);
	const setFiles = useSetAtom(SelectedFilesAtom);

	useEffect(() => {
		setResult(undefined);
		setFiles([]);
	}, [setResult, setFiles]);
	return <></>;
};
