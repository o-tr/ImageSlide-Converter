import {auth} from "@/auth";
import {getUser} from "@/lib/prisma/getUser";

export const getAuthorizedUser = async() => {
  const _auth = await auth();
  if (!_auth?.user) return undefined;
  const {email, name, id} = _auth.user;
  if (!email || !name || !id) return undefined;
  return await getUser({email, discordId: id, name});
}