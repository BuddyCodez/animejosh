import useSWR from 'swr';
const fetcher = (...args: any) => fetch(args).then((res) => res.json());
export default function useFetcher(url: string) {
    const { data, error } = useSWR(url, fetcher);
    // console.log("Fetcher Used for", url);
    const isLoading = !data && !error;
    error ? console.error("Fetcher Error", error) : null;
    return {
        isLoading: isLoading,
        data: data,
        error: error
    }
}