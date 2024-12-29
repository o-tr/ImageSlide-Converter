import {Button, Flex, Spin} from "antd";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {TbBrandGoogleDrive} from "react-icons/tb";
import {GooglePickerTokenAtom, IsGooglePickerReadyAtom,} from "@/atoms/google-picker";
import {useState} from "react";
import {SelectedFilesAtom} from "@/atoms/file-drop";
import {pdf2canvases} from "@/lib/file2canvas/pdf2canvases";
import {GetSlideResponse} from "@/_types/google-slides-api";
import {fetchFileBuffer} from "@/lib/gapi/fetchFile";
import {AntContent} from "@/components/AntContent";
import {files2canvases} from "@/lib/file2canvas";
import {canvas2selectedFile} from "@/lib/canvas2selected-files";
import {LoadingOutlined} from "@ant-design/icons";
import {requestTokenPromise} from "@/lib/google/requestToken";
import {showFilePicker} from "@/lib/google/showFilePicker";

export const GooglePicker = () => {
  const [token, setToken] = useAtom(GooglePickerTokenAtom);
  const isApiLoaded = useAtomValue(IsGooglePickerReadyAtom);
  const setFiles = useSetAtom(SelectedFilesAtom);
  const [validating, setValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showPicker = async (__token = token) => {
    const _token = __token ?? await (async()=>{
      try {
        const token = await requestTokenPromise();
        setToken(token);
        return token;
      }catch (e) {
        console.error(e);
        return
      }
    })();
    if (!_token) return;
    setValidating(true);
    const response = await fetch(
      "https://www.googleapis.com/drive/v3/about?fields=user",
      {
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      },
    ).then((res) => res.json());
    setValidating(false);
    if (response.user === undefined) {
      setToken(null);
      await showPicker(null);
      return;
    }
    void showFilePicker(_token,onFilePicked);
  };

  const onFilePicked = async (data: { action: string; docs?: any[] }) => {
    if (data.action !== "picked" || !data.docs) return;
    const file = data.docs[0];
    setIsLoading(true);
    if (file.mimeType === "application/pdf") {
      const canvases = await pdf2canvases(await fetchFileBuffer(file.id));
      const files = canvases.map((canvas, index) => ({
        id: `${index}-${crypto.randomUUID()}`,
        fileName: `${file.name}-${index + 1}`,
        canvas: canvas,
      }));
      setFiles((pv) => [...pv, ...files]);
    }
    if (file.mimeType === "application/vnd.google-apps.presentation") {
      const { slides, title } = await slide2canvas(file.id);
      const files = slides.map((slide, index) => ({
        id: `${index}-${crypto.randomUUID()}`,
        fileName: `${title}-${index + 1}`,
        ...slide,
      }));
      setFiles((pv) => [...pv, ...files]);
    }
    if (file.mimeType.startsWith("image/")) {
      const buffer = await fetchFileBuffer(file.id);
      const fileObject = new File([buffer], file.name, {
        type: file.mimeType,
      });
      const canvas = (await files2canvases([fileObject])).map(
        ({ canvas, fileName }) => canvas2selectedFile(fileName, canvas),
      );
      setFiles((pv) => [...pv, ...canvas]);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Button
        disabled={!isApiLoaded && !validating}
        icon={
          isApiLoaded && !validating ? (
            <TbBrandGoogleDrive />
          ) : (
            <Spin indicator={<LoadingOutlined spin />} />
          )
        }
        onClick={() => showPicker()}
      >
        Add File From Google Drive
      </Button>
      {isLoading && (
        <div
          className={
            "fixed top-0 left-0 w-full h-full z-50 grid place-items-center"
          }
        >
          <div
            className={
              "absolute left-0 top-0 w-full h-full bg-black bg-opacity-75 -z-0"
            }
          />
          <AntContent className={"relative p-8 rounded-2xl"}>
            <Flex gap={"middle"} align={"center"}>
              <Spin indicator={<LoadingOutlined spin />} size={"large"} />
              <div>Loading data from google drive...</div>
            </Flex>
          </AntContent>
        </div>
      )}
    </>
  );
};

const slide2canvas = async (
  slideId: string,
): Promise<{
  slides: { note: string; canvas: OffscreenCanvas }[];
  title: string;
}> => {
  const pdfFile = await gapi.client.drive.files.export({
    fileId: slideId,
    mimeType: "application/pdf",
  }) as {body: string};

  const uint8Array = new Uint8Array(pdfFile.body.split('').map(char => char.charCodeAt(0)));
  const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });
  const buffer = await pdfBlob.arrayBuffer();
  const canvases = await pdf2canvases(buffer);

  const response: GetSlideResponse = await gapi.client.slides.presentations.get(
    {
      presentationId: slideId,
    },
  );
  const slides = response.result.slides
      .filter((slide) => !slide.slideProperties.isSkipped)
      .map<string>((slide) => {
        return slide.slideProperties.notesPage.pageElements
          .filter((element) => element.shape.shapeType === "TEXT_BOX")
          .map((element) => {
            if (
              !element.shape.text ||
              element.shape.text.textElements.length === 0
            )
              return "";
            return element.shape.text.textElements
              .map((textElement) => textElement.textRun?.content)
              .join("");
          })
          .join("\n");
      });

  const result = slides.map((note, index) => ({
    note,
    canvas: canvases[index],
  }));

  return { slides: result, title: response.result.title };
};
