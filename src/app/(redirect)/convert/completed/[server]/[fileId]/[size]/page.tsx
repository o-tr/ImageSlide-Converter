import { redirect } from "next/navigation";

type Props = Readonly<{
  params: { fileId: string; size: string; server: string };
}>;

export default function Page({ params }: Props) {
  redirect(`/files/${params.fileId}`);
}
