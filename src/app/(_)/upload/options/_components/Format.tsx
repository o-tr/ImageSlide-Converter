import {FC, useMemo} from "react";
import {useAtom, useAtomValue} from "jotai";
import {ConvertFormatAtom, UsingVersionAtom} from "@/atoms/convert-options";
import {Flex, Radio, Tooltip} from "antd";
import {SelectedFile} from "@/_types/file-picker";
import { SelectedFilesAtom } from "@/atoms/file-drop";
import {FileSizeLimit, TargetVersions} from "@/const/convert";

type Format = {
  label: string;
  bytePerPixel: number;
  priority: number;
}

const formats: Format[] = [
  {
    label: "RGB24",
    bytePerPixel: 3,
    priority: 1
  },
  {
    label: "RGBA32",
    bytePerPixel: 4,
    priority: 0
  },
]

export const Format:FC = () => {
  const [format, setFormat] = useAtom(ConvertFormatAtom);
  const version = useAtomValue(UsingVersionAtom);
  const files = useAtomValue(SelectedFilesAtom);
  
  const availableFormats = useMemo(()=>{
    const supported = TargetVersions[version].formats;
    return formats.filter(v=>supported.includes(v.label)).map((format)=>({
      ...format,
      fileSize: estimateFileSize(files, format.bytePerPixel),
    }));
  },[format,version]);
  
  const bestFormat = useMemo(()=> {
    return availableFormats.toSorted((a, b) => b.priority - a.priority )[0];
  },[availableFormats]);
  
  return (
    <Flex vertical gap={"middle"}>
      <h2 className={"text-xl"}>フォーマットを選択してください</h2>
      <Radio.Group onChange={(e)=>setFormat(e.target.value)} value={format}>
        <Radio.Button className={"w-[256px] !h-[76px]"} value={"auto"}>
          <Flex vertical className={"p-2 text-center h-full"} align={"center"}>
            <p>自動 ({bestFormat.label})</p>
            <p>{toLabel(bestFormat.fileSize)}</p>
          </Flex>
        </Radio.Button>
        {bestFormat.fileSize > FileSizeLimit &&
          <Tooltip placement="top" title={`画像サイズを${Math.floor(FileSizeLimit * 100 / bestFormat.fileSize)}% に縮小することによって容量を圧縮します`} arrow={true}>
            <Radio.Button className={"w-[256px] !h-[76px]"} value={"auto-one-file"}>
              <Flex vertical className={"p-2 text-center h-full"} align={"center"}>
                <p>自動 ({bestFormat.label})</p>
                <p>縮小して1ファイルに纏める</p>
              </Flex>
            </Radio.Button>
          </Tooltip>}
        {availableFormats.map((v) =><FormatItem key={v.label} item={v}/>)}
      </Radio.Group>
    </Flex>
  )
}

export const FormatItem:FC<{item: Format}> = ({item}) => {
  const files = useAtomValue(SelectedFilesAtom);
  const label = useMemo(()=>{
    return toLabel(estimateFileSize(files, item.bytePerPixel));
  },[item.bytePerPixel,files]);
  return (
    <Radio.Button key={item.label} value={item.label} className={"w-[256px] !h-[76px]"}>
      <Flex vertical className={"p-2 text-center"}>
        <p>{item.label}</p>
        <p>{label}</p>
      </Flex>
    </Radio.Button>
  )
}

const estimateFileSize = (files: SelectedFile[], bytePerPixel: number): number => {
  const pixelCount = files.reduce((pv,val)=>{
    return pv + val.canvas.width * val.canvas.height;
  },0);
  return pixelCount * bytePerPixel * 4 / 3;//base64でエンコードするときに4/3倍になる
}

const unit = ["B", "KB", "MB", "GB", "TB"] as const;
const toLabel = (input: number) => {
  let size = input;
  let i = 0;
  while (size >= 1000) {
    size /= 1000;
    i++;
  }
  return `${size.toFixed(2)}${unit[i]} / ${Math.ceil(input/FileSizeLimit)}file(s)`;
}
