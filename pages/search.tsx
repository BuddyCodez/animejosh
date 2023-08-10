import { siteConfig } from '@/config/site'
import DefaultLayout from '@/layouts/default'
import { CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import { BsStar } from 'react-icons/bs';
import { TbCalendarStats } from 'react-icons/tb';
import parseText from '@/utils/parseText'
import { Button, Skeleton } from '@nextui-org/react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router'
import useFetcher from '@/utils/fetcher'
interface AnimeType {
  id: String,
  malId: number,
  title: Array<Object>,
  status: string,
  image: string,
  cover: string,
  popularity: number,
  description: string,
  rating: number,
  genres: Array<string>,
  color: string,
  totalEpisodes: number,
  currentEpisodeCount: number,
  type: string,
  releaseDate: number
}
interface searchResultType {
  hasNextPage: boolean,
  results: Array<AnimeType>,
  currentPage: number
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
interface AlertType {
  message: string,
  severity: AlertColor
}
const Search = () => {
  const router = useRouter();
  const { keyword } = router.query;
  if (!keyword) return <DefaultLayout><Typography variant='h5'>No results found for {keyword}</Typography></DefaultLayout>;
  const { data: searchResult, isLoading } = useFetcher(siteConfig.apiUrl + "/meta/anilist/" + keyword);
  const [searchResults, setSearch] = useState<searchResultType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = useState<AlertType>({
    message: "",
    severity: "error"
  });
  useEffect(() => {
    if (searchResult) {
      setSearch(searchResult);
    }
  }, [searchResult])
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  function getSearchResults() {
    axios.get(siteConfig.apiUrl + "/meta/anilist/" + keyword).then((res) => {
      let fetchedNew = false;
      setLoading(true);
      let hasNext = Boolean(searchResults?.hasNextPage);
      let prevN = Number(searchResults?.currentPage);
      let newN = Number(res?.data?.currentPage);
      if (prevN < newN && hasNext) {
        let results: any = res?.data?.results;
        let searchres: any = searchResults?.results || [];
        setSearch({
          hasNextPage: res?.data?.hasNextPage,
          results: [...searchres, ...results],
          currentPage: res?.data?.currentPage
        });
        fetchedNew = true;
      }
      setTimeout(() => {
        setLoading(false);
        if (fetchedNew) {
          setAlert({
            message: "Fetched new Page!",
            severity: "success"
          });
          handleClick();
        } else {
          setAlert({
            message: "No more pages to fetch!",
            severity: "error"
          });
          handleClick();
        }

      }, 500);
    })
  }
  return (
    <>
      <DefaultLayout>
        <article>
          <section className='sectionSearch'>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={alert?.severity || "error"} sx={{ width: '100%' }}>
                {alert?.message}
              </Alert>
            </Snackbar>
            <Typography variant='h5'>Search results for {keyword}</Typography>
            <div className="flex justify-center items-center flex-wrap p-3">
              {isLoading || !searchResult ? <div className='LoaderWrapper flex justify-center items-center' style={{width: "100vw", height: "100%"}}>
                <CircularProgress />
              </div> : null}
              {!isLoading && searchResults?.results?.map((item: any, index: number) => {
                return <Link href={'/anime/' + item?.id} className="col-lg-4 col-md-6 col-sm-6" key={item?.id}>
                  <div className="product__item">
                    <div className="product__item__pic set-bg" style={{
                      backgroundImage: `url(${item?.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat"
                    }}>
                      <div className="ep">{item?.totalEpisodes} Ep</div>
                      <div className="comment"><span className='flex items-center gap-1'><BsStar /> {item?.rating / 10}</span></div>
                      <div className="view">
                        <span className='flex items-center gap-1'>
                          <TbCalendarStats /> {item?.releaseDate}
                        </span>
                      </div>
                    </div>
                    <div className="product__item__text">
                      <ul className='flex gap-1'>
                        {item?.genres && item?.genres.slice(0, 3).map((genre: any, index: number) => (
                          <li key={index}>{genre}</li>
                        ))}
                      </ul>
                      <h5>{parseText(item?.title)}</h5>
                    </div>

                  </div>
                </Link>
              })}
            </div>
            <Button
              isLoading={loading}
              onPress={() => getSearchResults()}
              color="primary"
              spinner={
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              }
            >
              {loading ? "Loading..." : "Fetch More Pages..."}
            </Button>
          </section>
        </article>
      </DefaultLayout>
    </>
  )
}

export default Search