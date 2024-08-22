import { Button } from "antd";
import { TfiHarddrive } from "react-icons/tfi";
import { ChangeEvent, useRef } from "react";
import { files2canvases } from "@/lib/file2canvas";
import { useSetAtom } from "jotai";
import { SelectedFilesAtom } from "@/atoms/file-drop";
import { canvas2selectedFile } from "@/lib/canvas2selected-files";

export const LocalFilePicker = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setFiles = useSetAtom(SelectedFilesAtom);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files) return;
    const processed = (await files2canvases(files)).map(
      ({ canvas, fileName }) => canvas2selectedFile(fileName, canvas),
    );
    setFiles((pv) => [...pv, ...processed]);
  };

  return (
    <>
      <input
        ref={inputRef}
        className={"hidden"}
        multiple={true}
        type="file"
        accept={"image/*,application/pdf"}
        onChange={onChange}
      />
      <Button icon={<TfiHarddrive />} onClick={onButtonClick}>
        Add File From Local
      </Button>
    </>
  );
};
