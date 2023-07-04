import typesense from "typesense";

export function useTypesense() {
  let client = new typesense.Client({
    nodes: [
      {
        host: process.env.VUE_APP_TS_HOST,
        port: "443",
        protocol: "https",
      },
    ],
    apiKey: process.env.VUE_APP_TS_API_KEY,
  });

  return {
    client,
  };
}
