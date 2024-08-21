import {NextResponse} from "next/server";
import {getAuthorizedUser} from "@/utils/getAuthorizedUser";

export const GET = async () => {
  const user = await getAuthorizedUser();
  if (!user) return NextResponse.json({status: "error", error: "Unauthorized"}, {status: 401});
  const files = user.files;
  
  return NextResponse.json({status: "success", data: {
    files
  }});
}
