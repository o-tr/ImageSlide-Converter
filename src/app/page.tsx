import {Button, Flex} from "antd";
import Image from "next/image";
import {AntContent} from "@/components/AntContent";
import {TransitionOnDrag} from "@/app/_components/TransitionOnDrag";
import {DragWatcher} from "@/components/DragWatcher";

export default function Home() {
  return (
    <AntContent className={"flex-1 flex flex-col"}>
      <Flex className={"flex-1"} justify={"center"} align={"center"} gap={64} vertical>
        <Flex align={"center"} gap={"middle"}>
          <Image src={"/icon.png"} alt={"logo"} width={64} height={64}/>
          <span className={"text-2xl"}>ImageSlide Converter</span>
        </Flex>
        <div className={"px-24"}>
          <p>スライドを TextZip 形式に変換し、ImageSlide で読み込めるようにするためのツールです</p>
          <p>ログインすると、ファイルの管理や高可用サーバーの利用(準備中)が可能になります</p>
          <p>ファイル保持期間はゲストが7日間、ユーザーが30日間です</p>
        </div>
        <Button href={"/convert/pick"}>ファイルを追加</Button>
      </Flex>
      <TransitionOnDrag/>
      <DragWatcher/>
    </AntContent>
  );
}
