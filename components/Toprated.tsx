import { siteConfig } from '@/config/site';
import useFetcher from '@/utils/fetcher';
import React from 'react'
import { Loader } from './Trending';
import { Badge, Button, Card, CardFooter, CardHeader, Image } from '@nextui-org/react';
import { useRouter } from 'next/router';
import parseText from '@/utils/parseText';
import { CircularProgress, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import Latestsection from "./Latestsection";
import { BsArrowRight, BsCalendar2DateFill, BsEye, BsStar } from 'react-icons/bs';
import { TbCalendarStats } from 'react-icons/tb';
const Toprated = () => {
    const router = useRouter();
    const { data: subdata, isLoading: subloading } = useFetcher("https://animejosh.uditvegad.repl.co/recent-release?type=1");
    const { data: dubdata, isLoading: dubloading } = useFetcher("https://animejosh.uditvegad.repl.co/recent-release?type=2");
    const { data: popular, isLoading: popload } = useFetcher(siteConfig.apiUrl + "/meta/anilist/popular?perPage=6");
    const { data: trending, isLoading: trendLoad } = useFetcher(siteConfig.apiUrl + "/meta/anilist/trending?perPage=9");
    return (
        <>
            <section className="product spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="trending__product">
                                <div className="row">
                                    <div className="col-lg-8 col-md-8 col-sm-8 product__sidebar">
                                        <div className="section-title w-[160px] mb-4">
                                            <h5 className='p-0 w-[120px]'>Trending Animes</h5>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <div className="btn__all">
                                            <Link href="/trending" className="primary-btn">View All <i className="fa-solid fa-arrow-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {trendLoad && <div className='LoaderWrapper'>
                                        <div className="loader"></div>
                                    </div>}
                                    {!trendLoad && trending?.results.map((item: any, index: number) => { 
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
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-8">
                            <div className="product__sidebar">
                                <div className="product__sidebar__view">
                                    <div className="section-title w-full flex items-center justify-between mb-4">
                                        <h5 className='p-0 w-[120px]'>Popular Animes</h5>
                                        <Link href="/popular" className="primary-btn">View All <i className="fa-solid fa-arrow-right"></i></Link>
                                    </div>
                                    <div className="filter__gallery" id="MixItUp2106D7">
                                        {popload && <div className='LoaderWrapper'>
                                            <div className="loader"></div>
                                        </div>}
                                        {!popload && popular?.results.map((item: any, index: number) => { 
                                            return <Link href={'/anime/' + item?.id} className="product__sidebar__view__item set-bg mix day years" key={item?.id} style={{
                                                backgroundImage: `url(${item?.image})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "top",
                                                backgroundRepeat: "no-repeat"
                                            }}>
                                                                                                <div className="view"><span className='flex items-center gap-1'>
                                                    <TbCalendarStats /> {item?.releaseDate}
                                                </span></div>
                                                <div  className="w-full h-[100px] absolute bottom-0 flex items-end" style={{
                                                    backgroundImage: " linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))",
                                                    width: "100%"
                                                }}>
                                                    <div className="flex gap-2 px-2 items-center">
                                                        <div className="number flex gap-1 items-center">
                                                            <h6 className=' text-theme font-extrabold text-4xl flex items-center'>{index + 1}
                                                            <span className='text-white'>.</span>
                                                            </h6>
                                                            
                                                        </div>
                                                        <Typography variant='h6' >{parseText(item?.title)}</Typography>
                                                    </div>
                                                </div>
                                            </Link>
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Toprated
    // <div className = "flex flex-col md:flex-row lg:flex-row  gap-2 justify-center" >
    //                 <div className="flex flex-col md:w-[70%%] lg:w-[70%%] w-[100%] sm:w-full h-full">
    //                     <div className="flex w-full justify-between items-center h-12 flex-wrap md:px-[50%] lg:px-[18%]">
    //                         <span className="text-2xl font-bold text-white flex justify-center items-center gap-2 ">
    //                             <div className="cursor rounded w-[6px] bg-blue-500 h-[50px]"></div>
    //                             Trending Now</span>
    //                         <Button variant='flat' endContent={
    //                             <BsArrowRight scale={1.3} style={{
    //                                 fontSize: "50px"
    //                             }} className='text-blue-500' />
    //                         }
    //                             className='uppercase poppins font-bold'
    //                             style={{
    //                                 background: "transparent"
    //                             }}
    //                             size='lg'
    //                         >View All</Button>
    //                     </div>
    //                     <br />
    //                     <div className="flex justify-center flex-wrap items-center gap-4  mt-6">
    //                         {trendLoad && <CircularProgress />}
    //                         {!trendLoad && trending?.results.slice(0,3).map((item: any, index: number) => {
    //                             return <Link href={'/anime/' + item?.id} key={item?.id}><div className="poster la-anime rounded-lg" style={{
    //                                 width: "250px"
    //                             }}>
    //                                 <div id="shadow1" className="shadow">
    //                                     <div className="dubb">{item?.genres[Math.floor(Math.random() * item?.genres.length)]}</div>
    //                                     <div className="dubb dubb2">Ep {item?.totalEpisodes}</div>
    //                                 </div>
    //                                 <div id="shadow2" className="shadow">
    //                                     <Image
    //                                         removeWrapper
    //                                         src={item?.image} isBlurred isZoomed alt={parseText(item?.title) + "'s Image"}
    //                                         className='lzy_img'
    //                                         style={{
    //                                             objectFit: "cover"
    //                                         }}
    //                                     />
    //                                 </div>
    //                            <div className="la-details">
    //                                     <h3 className='m-0' style={{margin: 0}}>{parseText(item?.title)}</h3>
    //                                     <div className="flex items-center justify-between w-full">
    //                                         <div className='flex items-center'>
    //                                             <span className="dot"></span>
    //                                             <span>{item?.status}</span>
    //                                         </div>
    //                                         <div className='flex items-center'>
    //                                             <span className="dot"></span>
    //                                             <span>{item?.type} Series</span>
    //                                         </div>
    //                                    </div>
                                       
    //                                 </div>
    //                             </div>
    //                             </Link>
    //                         })}
                            
    //                     </div>
    //                     <div className="flex justify-center flex-wrap items-center gap-4 mt-6">
                        
    //                         {!trendLoad && trending?.results.slice(3, 6).map((item: any, index: number) => {
    //                             return <Link href={'/anime/' + item?.id} key={item?.id}><div className="poster la-anime rounded-lg" style={{
    //                                 width: "250px"
    //                             }}>
    //                                 <div id="shadow1" className="shadow">
    //                                     <div className="dubb">{item?.genres[Math.floor(Math.random() * item?.genres.length)]}</div>
    //                                     <div className="dubb dubb2">Ep {item?.totalEpisodes}</div>
    //                                 </div>
    //                                 <div id="shadow2" className="shadow">
    //                                     <Image
    //                                         removeWrapper
    //                                         src={item?.image} isBlurred isZoomed alt={parseText(item?.title) + "'s Image"}
    //                                         className='lzy_img'
    //                                         style={{
    //                                             objectFit: "cover"
    //                                         }}
    //                                     />
    //                                 </div>
    //                                 <div className="la-details">
    //                                     <h3 className='m-0' style={{margin: 0}}>{parseText(item?.title)}</h3>
    //                                     <div className="flex items-center justify-between w-full">
    //                                         <div className='flex items-center'>
    //                                             <span className="dot"></span>
    //                                             <span>{item?.status}</span>
    //                                         </div>
    //                                         <div className='flex items-center'>
    //                                             <span className="dot"></span>
    //                                             <span>{item?.type} Series</span>
    //                                         </div>
    //                                    </div>
                                       
    //                                 </div>
    //                             </div>
    //                             </Link>
    //                         })}

    //                     </div>
    //                     <div className="flex justify-center flex-wrap items-center gap-4 mt-6" >
    //                         {!trendLoad && trending?.results.slice(6, 9).map((item: any, index: number) => {
    //                             return <Link href={'/anime/' + item?.id} key={item?.id}><div className="poster la-anime rounded-lg" style={{
    //                                 width: "250px"
    //                             }}>
    //                                 <div id="shadow1" className="shadow">
    //                                     <div className="dubb">{item?.genres[Math.floor(Math.random() * item?.genres.length)]}</div>
    //                                     <div className="dubb dubb2">Ep {item?.totalEpisodes}</div>
    //                                 </div>
    //                                 <div id="shadow2" className="shadow">
    //                                     <Image
    //                                         removeWrapper
    //                                         src={item?.image} isBlurred isZoomed alt={parseText(item?.title) + "'s Image"}
    //                                         className='lzy_img'
    //                                         style={{
    //                                             objectFit: "cover"
    //                                         }}
    //                                     />
    //                                 </div>
    //                            <div className="la-details">
    //                                     <h3 className='m-0' style={{margin: 0}}>{parseText(item?.title)}</h3>
    //                                     <div className="flex items-center justify-between w-full">
    //                                         <div className='flex items-center'>
    //                                             <span className="dot"></span>
    //                                             <span>{item?.status}</span>
    //                                         </div>
    //                                         <div className='flex items-center'>
    //                                             <span className="dot"></span>
    //                                             <span>{item?.type} Series</span>
    //                                         </div>
    //                                    </div>
                                       
    //                                 </div>
    //                             </div>
    //                             </Link>
    //                         })}

    //                     </div>
    //                 </div>
    //                 <div className="flex flex-col md:w-[30%] lg:w-[30%] w-[100%]  h-auto">
    //                     <div className="flex w-full justify-between items-center h-12">
    //                         <span className="text-2xl font-bold text-white flex justify-center items-center gap-2">
    //                             <div className="cursor rounded w-[6px] bg-blue-500 h-[50px]"></div>
    //                             Popular Now</span>
    //                         <Button variant='flat' endContent={
    //                             <BsArrowRight scale={1.3} style={{
    //                                 fontSize: "50px"
    //                             }} className='text-blue-500' />
    //                         }
    //                             className='uppercase poppins font-bold'
    //                             style={{
    //                                 background: "transparent"
    //                             }}
    //                             size='lg'
    //                         >View All</Button>
    //                     </div>
    //                     <br />
    //                     <div className="flex justify-center flex-wrap items-center gap-4 p-4">
    //                         {popload && <CircularProgress />}
    //                         {!popload && popular?.results.slice(0,5).map((item: any, index: number) => {
    //                             return <Card className=" h-[200px] w-full" isHoverable isPressable key={item?.id}>
    //                                 <CardHeader className="absolute z-10 top-1 flex-col !items-start">
    //                                     <div className="flex items-center justify-between px-3 w-full">
    //                                         <span className='bg-blue-500 rounded-3xl p-3 flex justify-between gap-2 items-center'>
    //                                             {item?.rating / 10} / 10 <AiFillStar color='yellow' />
    //                                         </span>
    //                                         <span className=' bg-slate-700 rounded-lg p-3 flex justify-between gap-2 items-center'>
    //                                             <BsCalendar2DateFill />   {item?.releaseDate}
    //                                         </span>
    //                                     </div>
    //                                 </CardHeader>
    //                                 <Image
    //                                     removeWrapper
    //                                     alt="Card background"
    //                                     className="z-0 w-full h-full object-cover"
    //                                     src={item?.image}
    //                                     isZoomed
    //                                 />
    //                                 <CardFooter className="absolute z-10 bottom-0 flex-col !items-start" style={{
    //                                     backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))"

    //                                 }}>
    //                                     <Typography variant="h5" className='poppins'>
    //                                         {parseText(item?.title)}
    //                                     </Typography>
    //                                 </CardFooter>
    //                             </Card>
    //                         })}
    //                     </div>
    //                 </div>
    //             </div>
    