"use client";
import { IsDragOverAtom } from "@/atoms/file-drop";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { type FC, useEffect } from "react";

export const TransitionOnDrag: FC = () => {
	const isDragOver = useAtomValue(IsDragOverAtom);
	const router = useRouter();

	useEffect(() => {
		if (isDragOver) {
			void router.push("/convert/pick");
		}
	}, [isDragOver, router]);

	return <></>;
};
