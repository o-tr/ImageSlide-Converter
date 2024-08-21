import {getSession} from "@/lib/iron-session";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export const POST = async() => {
  try {
    const session = await getSession(cookies());
    session.fileId ??= [];
    const id = crypto.randomUUID()
    session.fileId = [...session.fileId, id];
    await session.save();
    return NextResponse.json({
      status: "success",
      data: {
        fileId: id,
      }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      error: "Internal Server Error"
    }, {status: 500});
  }
}
