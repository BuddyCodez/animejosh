import { siteConfig } from '@/config/site'
import DefaultLayout from '@/layouts/default'
import parseText from '@/utils/parseText'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '@nextui-org/react'
import { BsStar } from 'react-icons/bs'
import { TbCalendarStats } from 'react-icons/tb';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
interface TrendingType {
    currentPage: number,
    hasNextPage: boolean,
    results: Array<Object>
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

const trending = ({ data }: { data: TrendingType }) => {

    const [trending, setTrending] = useState<TrendingType>(data);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const [alert, setAlert] = useState<AlertType>({
        message: "",
        severity: "error"
    });

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
        try {
            axios.get(siteConfig.apiUrl + "/meta/anilist/trending", {
                params: {
                    page: trending?.currentPage + 1,
                    perPage: 20
                }
            }).then((res: any) => {
                let fetchedNew = false;
                setLoading(true);
                let prevN = Number(trending?.currentPage);
                let newN = Number(res?.data?.currentPage);
                let hasNextPage = Boolean(trending?.hasNextPage);
                if (prevN < newN && hasNextPage) {
                    let results = res?.data?.results;
                    setTrending(prevTrending => ({
                        hasNextPage: res?.data?.hasNextPage,
                        results: [...prevTrending.results, ...results],
                        currentPage: res?.data?.currentPage,
                    }));
                    fetchedNew = true;
                }

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
            })
        } catch (e) {
            console.log(e);
            setAlert({
                message: "Error Fetching new Page!",
                severity: "error"
            });
            handleClick();
        }
    }

    return (
        <>
            <DefaultLayout>
                <section className='w-full p-3'>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alert?.severity || "error"} sx={{ width: '100%' }}>
                            {alert?.message}
                        </Alert>
                    </Snackbar>
                    <div className="container w-full mt-5 flex flex-col justify-center items-center" style={{ padding: "0" }}>
                        <div className="TrendingHeader">

                            <h1 className="float-left bah-heading mr-2 flex flex-col gap-2">

                                Trending Anime
                                <span className='text-white'>{trending?.results?.length} Results</span>
                            </h1>

                        </div>
                        <div className="flex gap-2 flex-wrap justify-center items-center w-full">
                            {trending?.results?.map((item: any) => {
                                return <Link href={'/anime/' + item?.id} className="col-lg-4 col-md-6 col-sm-6" style={{
                                    maxWidth: "19.333333%"
                                }} key={item?.id}>
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
                        <div className="mb-4">
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
                    </div>
                    </div>
                </section>
            </DefaultLayout>
        </>
    )
}

export default trending
export const getStaticProps = async () => {
    const { data } = await axios.get(siteConfig.apiUrl + "/meta/anilist/trending?perPage=20");
    return {
        props: {
            data: data
        }
    }
}