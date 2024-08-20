import {convertFileToCanvas} from "./file2canvas";

const convertFilesToCanvases = async (
  files: FileList,
): Promise<HTMLCanvasElement[]> => {
  return (await Promise.all(Array.from(files).map<Promise<HTMLCanvasElement|HTMLCanvasElement[]>>(async (file) => {
    try{
      return await convertFileToCanvas(file);
    }catch (e) {
      console.error(e);
      return [];
    }
  }))).flat();
};
