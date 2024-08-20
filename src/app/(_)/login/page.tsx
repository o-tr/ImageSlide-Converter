"use client";
import {useEffect} from "react";
import {signIn} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import {Spin} from "antd";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(()=>{
    if (searchParams.get("callbackUrl")){
      void signIn("discord", { callbackUrl: searchParams.get("callbackUrl")??"/" });
    }else if(searchParams.get("error")){
      router.replace("/");
    }
  },[searchParams])
  return (<div className={"grid place-items-center flex-1"}>
    <Spin size={"large"}/>
  </div>);
}