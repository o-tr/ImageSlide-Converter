import { Button, Flex, Spin } from "antd";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { TbBrandGoogleDrive } from "react-icons/tb";
import {
  GooglePickerTokenAtom,
  IsGooglePickerReadyAtom,
} from "@/atoms/google-picker";
import { useState } from "react";
import { SelectedFilesAtom } from "@/atoms/file-drop";
import { pdf2canvases } from "@/lib/file2canvas/pdf2canvases";
import { GetSlideResponse } from "@/_types/google-slides-api";
import { fetchFileBuffer } from "@/lib/gapi/fetchFile";
import { AntContent } from "@/components/AntContent";
import { files2canvases } from "@/lib/file2canvas";
import { canvas2selectedFile } from "@/lib/canvas2selected-files";
import { LoadingOutlined } from "@ant-design/icons";
import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID } from "@/const/env";

export const GooglePicker = () => {
  const [token, setToken] = useAtom(GooglePickerTokenAtom);
  const isApiLoaded = useAtomValue(IsGooglePickerReadyAtom);
  const setFiles = useSetAtom(SelectedFilesAtom);
  const [validating, setValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showPicker = async (_token = token) => {
    if (!_token) {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: "",
      });

      tokenClient.callback = async (response: {
        error?: string;
        access_token: string;
      }) => {
        if (response.error !== undefined) {
          throw response;
        }
        setToken(response.access_token);
        await showPicker(response.access_token);
      };
      tokenClient.requestAccessToken({ prompt: "" });
      return;
    }
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
    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS)
      .addView(google.picker.ViewId.DOCS_IMAGES)
      .setLocale("ja")
      .setTitle("Select a slide")
      .setOAuthToken(_token)
      .setSelectableMimeTypes(
        "application/vnd.google-apps.presentation,application/pdf,image/png,image/jpeg,image/jpg",
      )
      .setDeveloperKey(GOOGLE_API_KEY)
      .setCallback(async (data: { action: string; docs?: any[] }) => {
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
      })
      .setAppId(GOOGLE_CLIENT_ID)
      .build();
    picker.setVisible(true);
  };

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
  const response: GetSlideResponse = await gapi.client.slides.presentations.get(
    {
      presentationId: slideId,
    },
  );

  const slides = await Promise.all(
    response.result.slides
      .filter((slide) => !slide.slideProperties.isSkipped)
      .map<
        Promise<{
          note: string;
          canvas: OffscreenCanvas;
        }>
      >(async (slide) => {
        const note = slide.slideProperties.notesPage.pageElements
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
        const thumbnail =
          await gapi.client.slides.presentations.pages.getThumbnail({
            presentationId: slideId,
            pageObjectId: slide.objectId,
          });
        return new Promise<{ note: string; canvas: OffscreenCanvas }>(
          (resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = thumbnail.result.contentUrl;
            img.onload = () => {
              const canvas = new OffscreenCanvas(img.width, img.height);
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0);
              resolve({
                canvas,
                note,
              });
            };
          },
        );
      }),
  );
  return { slides, title: response.result.title };
};
