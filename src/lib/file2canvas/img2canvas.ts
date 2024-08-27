export const img2canvas = (
  file: File,
  resize = true,
): Promise<OffscreenCanvas> => {
  return new Promise<OffscreenCanvas>((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = (() => {
        if (resize) {
          const scale = Math.min(1, 1024 / img.width, 1024 / img.height);
          const width = Math.floor(img.width * scale);
          const height = Math.floor(img.height * scale);
          return { width, height };
        }
        return { width: img.width, height: img.height };
      })();
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas not found");
      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };
  });
};
