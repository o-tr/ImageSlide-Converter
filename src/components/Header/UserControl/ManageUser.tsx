"use client";
import { Button, Dropdown, type MenuProps } from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export const ManageUser = () => {
	const { data: session, status } = useSession();

	const items: MenuProps["items"] = [
		{
			key: "1",
			label: <span>Sign out</span>,
			onClick: () => {
				void signOut();
			},
		},
	];

	if (status !== "authenticated" || !session?.user) return null;
	return (
		<>
			<Link href={"/convert/pick"}>
				<Button>Upload</Button>
			</Link>
			<Link href={"/my/files"}>
				<Button>Files</Button>
			</Link>
			<Dropdown menu={{ items }} placement="bottomRight">
				<Button
					className={"!p-[3px] !pr-[7px]"}
					icon={
						<Image
							src={session.user.image ?? ""}
							alt={"icon"}
							width={24}
							height={24}
							className={"rounded-[2px]"}
						/>
					}
				>
					{session.user.name}
				</Button>
			</Dropdown>
		</>
	);
};
