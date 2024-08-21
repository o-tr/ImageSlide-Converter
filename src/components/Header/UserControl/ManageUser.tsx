"use client";
import {Button, Dropdown, MenuProps} from "antd";
import {useSession,signOut} from "next-auth/react";
import Image from "next/image";
import {useRouter} from "next/navigation";

export const ManageUser = () => {
  const { data: session, status } = useSession()
  const router = useRouter();
  
  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <span>
          Files
        </span>
      ),
      onClick: () => {
        router.push("/my/files");
      }
    },
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
  
  if (status !== "authenticated" || !session?.user) return null;
  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button className={"!p-[3px] !pr-[7px]"} icon={<Image src={session.user.image??""} alt={"icon"} width={24} height={24} className={"rounded-[2px]"}/>}>{session.user.name}</Button>
    </Dropdown>
  )
}
