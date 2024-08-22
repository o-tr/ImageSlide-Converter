import {NextResponse} from "next/server";
import {getAuthorizedUser} from "@/utils/getAuthorizedUser";
import {addDay, format} from "@formkit/tempo";

export const GET = async () => {
  const user = await getAuthorizedUser();
  if (!user) return NextResponse.json({status: "error", error: "Unauthorized"}, {status: 401});
  const files = user.files.map((file)=>({
    fileId: file.fileId,
    name: file.name,
    count: file.count,
    server: file.ha ? "HA" : "Normal",
    createdAt: format(new Date(file.updatedAt), "YYYY/MM/DD HH:mm:ss", "en"),
    expireAt: format(addDay(new Date(file.updatedAt),file.ha ? 7 : 30).toISOString(), "YYYY/MM/DD HH:mm:ss", "en"),
  }));
  
  return NextResponse.json({status: "success", data: {
    files
  }});
}
