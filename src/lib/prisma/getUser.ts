import {prisma} from "@/lib/prisma";

type Props = {email: string, discordId: string, name: string}

export const getUser = async ({email, discordId, name}: Props) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      discordId,
    },
    include:{
      files: true
    }
  })
  if (user) return user;
  return prisma.user.create({
    data: {
      email,
      discordId,
      name,
    },
    include: {
      files: true
    }
  });
}
