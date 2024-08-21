import {auth} from "@/auth";
import {getUser} from "@/lib/prisma/getUser";
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export const DELETE = async(request:Request, { params: {fileId} }: { params: { fileId: string }},) => {
  const _auth = await auth();
  if (!_auth?.user) return NextResponse.json({status: "error", error: "Unauthorized"});
  const {email, name, id} = _auth.user;
  if (!email || !name || !id) return NextResponse.json({status: "error", error: "Unauthorized"});
  const user = await getUser({email, discordId: id, name});
  if (!user) return NextResponse.json({status: "error", error: "Unauthorized"});
  const file = user.files.find((file) => file.fileId === fileId);
  if (!file) return NextResponse.json({status: "error", error: "File not found"});
  await prisma.file.delete({
    where: {
      id: file.id,
    }
  });
  return NextResponse.json({status: "success"});
}