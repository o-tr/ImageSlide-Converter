import axios from "axios";

export const postMigrateHA = async (fileId: string, callback?: (progress: number) => void) => {
  const res = await axios.post(`/api/my/files/${fileId}/migrate-ha`,{}, {
    headers: {
      "Accept": "text/event-stream"
    },
    responseType: "stream",
    adapter: "fetch"
  });
  
  const stream = res.data;
  
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    try{
      const data = JSON.parse(value);
      callback?.(data.progress);
    }catch {}
  }
}
