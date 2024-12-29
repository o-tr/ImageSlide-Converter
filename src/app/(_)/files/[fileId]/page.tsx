import { URLDisplay } from "@/app/(_)/files/[fileId]/_components/URLDisplay";
import { Flex } from "antd";
import { Reset } from "@/app/(_)/files/[fileId]/_components/Reset";

type Props = Readonly<{ params: { fileId: string } }>;

export default function Page({ params }: Props) {
	return (
		<div className={"flex-1 grid place-items-center"}>
			<Flex vertical gap={"middle"} className={"w-3/4"}>
				<URLDisplay fileId={params.fileId} />
			</Flex>
			<Reset />
		</div>
	);
}
