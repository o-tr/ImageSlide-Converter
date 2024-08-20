export const FileSizeLimit = 90 * 1000 * 1000;

export const TargetVersions: {
  label: string;
  image: string;
  formats: string[]
}[] = [
  {
    label: "v0.0.x",
    image: "/image-slide/v0.0.x.png",
    formats: ["RGBA32"]
  },
  {
    label: "v0.1.x",
    image: "/image-slide/v0.1.x.png",
    formats: ["RGBA32", "RGB24"]
  }
]
