import { Button } from "@nextui-org/react";
import Link from "next/link";
import { BsCalendar2DateFill, BsChevronRight, BsFillPlayFill, BsPlayCircleFill } from "react-icons/bs";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { MdWatchLater } from 'react-icons/md';
import { GrStatusGoodSmall } from 'react-icons/gr';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter } from "next/dist/client/router";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import useFetcher from "@/utils/fetcher";
import { siteConfig } from "@/config/site";
import parseText from "@/utils/parseText";
import parse from 'html-react-parser';
import { Skeleton } from "@mui/material";
const Hero = () => {
    const router = useRouter();
    const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const { data, isLoading } = useFetcher(siteConfig.apiUrl + "/meta/anilist/trending");
    return (
        <section className="MyHero hero flex justify-start items-start p-0" >
            <div className="w-full h-auto" style={{ margin: "0px 0" }}>
                {!isLoading && <Swiper
                    style={
                        {
                            height: "80vh"
                        }
                    }
                    // install Swiper modules
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    centeredSlides={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {data?.results.map((item: any, index: number) => {
                        return <SwiperSlide key={item?.id} className="w-full h-full swiperWrapper">
                            <div className="bg" style={{
                                backgroundImage: `url(${item?.cover})`
                            }}>
                                <div className="blur"></div>
                            </div>
                            <div className="content">
                                <div className="content-inner">
                                    <div className="spotlight">
                                        <p>#{index + 1} Spotlight</p>
                                    </div>
                                    <h1 className="title">{parseText(item?.title)}</h1>
                                    <div className="geners">
                                        {item?.genres.map((e: any) => {
                                            return <span key={e}>{e}</span>
                                        })}
                                    </div>
                                    <p className="description text-xs md:text-sm mb-4 leading-5 line-clamp-2 lg:line-clamp-4 font-light lg:mb-5">
                                        {parse(item?.description)}
                                    </p>
                                    <div className="flex gap-4 w-full flex-wrap">
                                        <div className="icon">
                                            <BsPlayCircleFill />
                                            <span>{item?.type}</span>
                                        </div>
                                        <div className="icon">
                                            <MdWatchLater />
                                            <span>{item?.duration}/min</span>
                                        </div>
                                        <div className="icon">
                                            <BsCalendar2DateFill />
                                            <span>{item?.releaseDate || "Unkown"}</span>
                                        </div>
                                        <div className="icon">
                                            <GrStatusGoodSmall />
                                            <span>{item?.status || "Unkown"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 actionWrap">
                                        <span onClick={() => router.push(`/watch/${item?.id}/1`)} className="action-item">
                                          Watch Now
                                       </span>
                                        <span onClick={() => router.push(`/anime/${item?.id}`)} className="action-item">
                                                <span className="flex gap-1 items-center justify-center">Details <BsChevronRight /></span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>
                    })}
                </Swiper>}
                {isLoading && <>
                    <Skeleton variant="rectangular" sx={{ bgcolor: 'grey.800' }} animation="wave" width="100%" height="80vh"></Skeleton>
                </>}
            </div>
        </section>
    );
};
export default Hero;
