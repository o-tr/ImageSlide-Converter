import {getUser} from "@/lib/prisma/getUser";
import {auth} from "@/auth";
import {NextResponse} from "next/server";

export const GET = async () => {
  const _auth = await auth();
  if (!_auth?.user) return NextResponse.json({status: "error", error: "Unauthorized"}, {status: 401});
  const {email, name, id} = _auth.user;
  if (!email || !name || !id) return NextResponse.json({status: "error", error: "Unauthorized"}, {status: 401});
  const user = await getUser({email, discordId: id, name});
  if (!user) return NextResponse.json({status: "error", error: "Internal Server Error"}, {status: 500});
  const files = user.files;
  
  return NextResponse.json({status: "success", data: {
    files
  }});
}
