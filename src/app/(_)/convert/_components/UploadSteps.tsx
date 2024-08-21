import {ComponentProps, FC} from "react";
import {StepProps, Steps} from "antd";

const items: StepProps[] =[
  {
    title: 'ファイルの選択',
  },
  {
    title: '設定',
  },
  {
    title: '変換',
  },
  {
    title: 'アップロード',
  },
  {
    title: 'URLをコピー',
  },
]

export const UploadSteps:FC<ComponentProps<typeof Steps>> = (props) => {
  return (
    <Steps direction={"horizontal"} {...props} items={items}/>
  );
}