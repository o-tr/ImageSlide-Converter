"use client";
import {useSession} from "next-auth/react";
import {Button} from "antd";
import {SignIn} from "@/components/Header/UserControl/SignIn";
import {ManageUser} from "@/components/Header/UserControl/ManageUser";

export const UserControl = () => {
  const { data: session, status } = useSession()
  if (status === "loading") return <Button loading>Loading...</Button>
  if (session) return <ManageUser/>
  return <SignIn/>
}