import { Flex } from "antd";
import Link from "next/link";
import { AntFooter } from "./AntFooter";

export const Footer = () => {
	return (
		<AntFooter>
			<Flex justify={"center"} align={"center"} gap={"middle"}>
				<p>
					<Link href={"https://docs.ootr.jp/"} target={"_blank"}>
						Documents
					</Link>
				</p>
				<p>
					<Link href={"https://github.com/o-tr/"} target={"_blank"}>
						GitHub
					</Link>
				</p>
				<p>
					<Link href={"https://ootr.booth.pm/"} target={"_blank"}>
						BOOTH
					</Link>
				</p>
			</Flex>
			<div>
				<p className={"text-center"}>
					Copyright &copy; 2024 ootr. Licensed under the MIT License.
				</p>
			</div>
		</AntFooter>
	);
};
