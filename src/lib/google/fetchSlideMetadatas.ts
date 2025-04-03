import type { GetSlideResponse } from "@/_types/google-slides-api";

type SlideMetadata = {
  title: string;
  items: SlideItem[];
};

type SlideItem = {
  speakerNote: string;
  isSkipped: boolean;
};

export const fetchSlideMetadata = async (
  slideId: string,
): Promise<SlideMetadata> => {
  const response: GetSlideResponse = await gapi.client.slides.presentations.get(
    {
      presentationId: slideId,
    },
  );
  const items = response.result.slides.map<SlideItem>((slide) => {
    const speakerNote = slide.slideProperties.notesPage.pageElements
      .filter((element) => element.shape.shapeType === "TEXT_BOX")
      .map((element) => {
        if (!element.shape.text || element.shape.text.textElements.length === 0)
          return "";
        return element.shape.text.textElements
          .map((textElement) => textElement.textRun?.content)
          .join("");
      })
      .join("\n");

    return {
      speakerNote,
      isSkipped: slide.slideProperties.isSkipped || false,
    };
  });
  return {
    title: response.result.title,
    items,
  };
};
