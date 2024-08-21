import {auth} from "@/auth";
import {getUser} from "@/lib/prisma/getUser";
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export const DELETE = async(request:Request, { params: {fileId} }: { params: { fileId: string }},) => {
  const _auth = await auth();
  if (!_auth?.user) return {status: "error", error: "Unauthorized"};
  const {email, name, id} = _auth.user;
  if (!email || !name || !id) return {status: "error", error: "Unauthorized"};
  const user = await getUser({email, discordId: id, name});
  if (!user) return {status: "error", error: "Internal Server Error"};
  const file = user.files.find((file) => file.fileId === fileId);
  if (!file) return {status: "error", error: "file not found"};
  await prisma.file.delete({
    where: {
      id: file.id,
    }
  });
  return NextResponse.json({status: "success"});
}