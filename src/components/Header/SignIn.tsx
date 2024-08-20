"use client";
import { signIn } from "next-auth/react";
import {Button} from "antd";

export const SignIn = () => {
  return (
    <Button onClick={() => signIn("discord", { callbackUrl:"/" })}>Sign in / Sign up</Button>
  )
}