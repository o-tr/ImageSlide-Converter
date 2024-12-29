import {GOOGLE_CLIENT_ID} from "@/const/env";

export const requestToken = (callback: (response: {
  error?: string;
  access_token: string;
}) => void) => {
  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: "https://www.googleapis.com/auth/drive.file",
    callback: "",
  });
  tokenClient.callback = callback;
  tokenClient.requestAccessToken({ prompt: "" });
}

export const requestTokenPromise = () => {
  return new Promise<string>((resolve, reject) => {
    requestToken((response) => {
      if (response.error !== undefined || !response.access_token) {
        reject(response);
        return;
      }
      resolve(response.access_token);
    });
  })
}
