"use client";
import { Spin } from "antd";
import { Redirect } from "./_components/Redirect";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className={"grid place-items-center flex-1"}>
      <Spin size={"large"} />
      <Suspense>
        <Redirect />
      </Suspense>
    </div>
  );
}
