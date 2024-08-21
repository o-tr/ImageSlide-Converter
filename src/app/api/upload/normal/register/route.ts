import {getSession} from "@/lib/iron-session";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import { z } from "zod";
import {auth} from "@/auth";
import {getUser} from "@/lib/prisma/getUser";
import {prisma} from "@/lib/prisma";
import {S3_NORMAL_BUCKET} from "@/const/env";

const RequestSchema = z.object({
  name: z.string(),
  fileId: z.string(),
  count: z.number()
});

export const POST = async(request: Request) => {
  try {
    const _auth = await auth();
    const _body = await request.json();
    const {success,data} = RequestSchema.safeParse(_body);
    if (!success || !data) {
      return NextResponse.json({
        status: "error",
        error: "Invalid request"
      }, {status: 400});
    }
    const session = await getSession(cookies());
    if (!session.fileId?.includes(data.fileId)){
      return NextResponse.json({
        status: "error",
        error: "Invalid request"
      }, {status: 400});
    }
    if (!_auth?.user) return NextResponse.json({status: "error", error: "Unauthorized"}, {status: 401});
    const {email, name, id} = _auth.user;
    if (!email || !name || !id) return NextResponse.json({status: "error", error: "Unauthorized"}, {status: 401});
    const user = await getUser({email, discordId: id, name});
    if (!user) return NextResponse.json({status: "error", error: "Internal Server Error"}, {status: 500});
    const file = await prisma.file.create({
      data: {
        name: data.name,
        bucket: S3_NORMAL_BUCKET,
        fileId: data.fileId,
        count: data.count,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });
    console.log(file);
    
    return NextResponse.json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      error: "Internal Server Error"
    }, {status: 500});
  }
}