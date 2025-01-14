import useSWR from "swr";

export const useMultiDataFetch = (urls, options) => {
  const results = useSWR(
    urls,
    async (urls) => {
      const responses = await Promise.all(urls.map((url) => fetch(url)));
      return Promise.all(responses.map((response) => response.json()));
    },
    options
  );

  return results;
};
