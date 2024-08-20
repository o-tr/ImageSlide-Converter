import {FC} from "react";
import {StepProps, Steps} from "antd";

const items: StepProps[] =[
  {
    title: 'ファイルの選択',
  },
  {
    title: '設定',
  },
  {
    title: 'アップロード',
  },
  {
    title: 'URLをコピー',
  },
]

type UploadStepsProps = {
  current: number;
}

export const UploadSteps:FC<UploadStepsProps> = ({current}) => {
  return (
    <Steps direction={"horizontal"} current={current} items={items}/>
  );
}