import { Button } from "@nextui-org/react";
import Link from "next/link";
import { BsFillPlayFill } from "react-icons/bs";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import useFetcher from "@/utils/fetcher";
import { siteConfig } from "@/config/site";
import parseText from "@/utils/parseText";
import parse from 'html-react-parser';
const Hero = () => {
    const { data, isLoading } = useFetcher(siteConfig.apiUrl + "/meta/anilist/trending");
    return (
        <section className="MyHero hero flex justify-start items-start p-0" >
            <div className="w-full h-auto" style={{ margin: "0px 0" }}>
                {!isLoading && <Swiper
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
                                    <h1 className="title">{parseText(item?.title)}</h1>
                                    <div className="geners">
                                        {item?.genres.map((e: any) => {
                                            return <span key={e}>{e}</span>
                                        })}
                                    </div>
                                    <p className="description">
                                        {item?.description.length >= 300 ? parse(item?.description.slice(0, 350)) + "..." : parse(item?.description)}
                                    </p>
                                    <p className="status">
                                        <span className="status-item">
                                            <span className="status-item-label">Status:</span>
                                            <span className="status-item-value">{item?.status}</span>
                                        </span>
                                    </p>
                                </div>
                                <div className="playcontainer">
                                    <Link href={`/anime/${item?.id}`}>
                                        <span className="playIcon">
                                            <BsFillPlayFill />
                                        </span>
                                    </Link>
                                </div>
                            </div>

                        </SwiperSlide>
                    })}
                </Swiper>}
            </div>
        </section>
    );
};
export default Hero;
