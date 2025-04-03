export type GetSlideResponse = {
  result: {
    slides: {
      objectId: string;
      pageElements: unknown;
      pageProperties: unknown;
      slideProperties: {
        isSkipped?: boolean;
        notesPage: {
          pageElements: {
            shape: {
              shapeType: "TEXT_BOX";
              text?: {
                textElements: {
                  textRun?: {
                    content: string;
                  };
                }[];
              };
            };
          }[];
        };
      };
    }[];
    title: string;
  };
};

export type GetThumbnailResponse = {
  result: {
    contentUrl: string;
  };
};
