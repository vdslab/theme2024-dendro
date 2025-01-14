import useSWR from "swr";

export const useDataFetch = (url, options) => {
  const results = useSWR(
    url,
    async (url) => {
      const response = await fetch(url);
      return response.json();
    },
    options
  );

  return results;
};
