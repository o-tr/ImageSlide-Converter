"use client";
import {Button, Dropdown, MenuProps} from "antd";
import {useSession,signOut} from "next-auth/react";
import Image from "next/image";

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <span>
        Sign out
      </span>
    ),
    onClick: () => {
      void signOut();
    }
  },
];

export const ManageUser = () => {
  const { data: session, status } = useSession()
  if (status !== "authenticated" || !session?.user) return null;
  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button className={"!pl-[4px] !pr-[8px]"} icon={<Image src={session.user.image??""} alt={"icon"} width={24} height={24} className={"rounded"}/>}>{session.user.name}</Button>
    </Dropdown>
  )
}