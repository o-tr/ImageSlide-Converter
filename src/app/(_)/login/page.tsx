"use client";
import { Spin } from "antd";
import { Suspense } from "react";
import { Redirect } from "./_components/Redirect";

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
