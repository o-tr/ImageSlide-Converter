import { Spin } from "antd";
import { type FC, useEffect, useRef, useState } from "react";

export const Preview: FC<{ canvas: OffscreenCanvas }> = ({ canvas }) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    canvas.convertToBlob().then((blob) => {
      setUrl(URL.createObjectURL(blob));
    });
  }, [canvas]);

  return (
    <div className={"w-128 text-center"}>
      {url ? (
        <img
          className={"object-contain max-h-32 max-w-32"}
          src={url}
          alt={"preview"}
        />
      ) : (
        <Spin />
      )}
    </div>
  );
};
