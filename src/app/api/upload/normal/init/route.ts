import {getSession} from "@/lib/iron-session";
import {NextResponse} from "next/server";

export const POST = async(request: Request, response: Response) => {
  try {
    const session = await getSession(request, response);
    session.fileId ??= [];
    const id = crypto.randomUUID()
    session.fileId = [...session.fileId, id];
    await session.save();
    return NextResponse.json({id});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
}
