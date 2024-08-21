import {getSession} from "@/lib/iron-session";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import { z } from "zod";
import {auth} from "@/auth";
import {getUser} from "@/lib/prisma/getUser";
import {prisma} from "@/lib/prisma";
import {S3_NORMAL_BUCKET} from "@/const/env";
import {getAuthorizedUser} from "@/utils/getAuthorizedUser";

const RequestSchema = z.object({
  name: z.string(),
  fileId: z.string(),
  count: z.number()
});

export const POST = async(request: Request) => {
  try {
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
    const user = await getAuthorizedUser();
    await prisma.file.create({
      data: {
        name: data.name,
        bucket: S3_NORMAL_BUCKET,
        fileId: data.fileId,
        count: data.count,
        user: user ? {
          connect: {
            id: user.id
          }
        } : undefined
      }
    });
    
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
