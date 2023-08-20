import { siteConfig } from '@/config/site';
import DefaultLayout from '@/layouts/default';
import { AnimeType } from '@/pages/anime/[id]';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';
import 'vidstack/styles/base.css';
import 'vidstack/styles/ui/buttons.css';
import 'vidstack/styles/ui/buffering.css';
import 'vidstack/styles/ui/captions.css';
import 'vidstack/styles/ui/tooltips.css';
import 'vidstack/styles/ui/live.css';
import 'vidstack/styles/ui/sliders.css';
import 'vidstack/styles/ui/menus.css';

import {
    MediaCommunitySkin, MediaOutlet, MediaPlayer, MediaPoster, useMediaStore,
} from '@vidstack/react';
import { useRef } from 'react';
import { type MediaPlayerElement } from 'vidstack';

import parseText from '@/utils/parseText';
import { Button, ButtonGroup, Image, Skeleton, Switch } from '@nextui-org/react';
import { useRouter } from 'next/router';
import useFetcher from '@/utils/fetcher';
import { BsFillSkipEndFill, BsFillSkipStartFill } from 'react-icons/bs';
interface Episode {
    id: string,
    number: number,
    title: string,
    image: string
    description: string,
    airDate: string,
}
interface Source {
    url: string;
    isM3U8: boolean;
    quality: string;
}

interface VideoData {
    headers: {
        Referer: string;
    };
    sources: Source[];
    download: string;
}
type SkipTimings = {
    interval: {
        startTime: number;
        endTime: number;
    };
    skipType: string;
    skipId: string;
    episodeLength: number;
}

const WatchPage = () => {
    const router = useRouter();
    const query = router.query?.anime;
    const episodeNumber = router.query?.episode;
    try {
        const { data, isLoading } = useFetcher(siteConfig.apiUrl + "/meta/anilist/info/" + query + "?dub=true");
        let isDubAvailable = true;
        if (!data?.episodes || data.episodes.length === 0)
            throw new Error("Cant Load Anime Try again Later");
        const episodeInfo = data?.episodes?.find((x: episodeType) => String(x.number) == episodeNumber);
        const episodeId = episodeInfo?.id;
        if (!episodeId || episodeInfo?.title) throw new Error("Cant Load Anime Try again Later");
        const { data: epData } = useFetcher(siteConfig.apiUrl + "/meta/anilist/watch/" + episodeId);
        if (!epData?.sources || epData.sources.length === 0) throw new Error("Cant Load Anime Try again Later");
        console.log(data?.title?.english);
        let sortedEpisodes = data?.episodes?.sort((a: any, b: any) => a.number - b.number);
        const url = `/api/skiptimings?malid=${data?.malId}&epnumber=${episodeNumber}&eplen=0`;
        const { data: skipData } = useFetcher(url);
        return (
            <>
                {isLoading && <DefaultLayout>
                    <div className="flex flex-col items-center justify-center h-screen">
                        <div className='LoadWrapper'>
                            <div className="loader"></div>
                        </div>
                    </div>
                </DefaultLayout>}
                {!isLoading && <AnimeWatchPage data={data} episodeInfo={episodeInfo} epData={epData} episodes={sortedEpisodes} episodeId={episodeId} error={""} DubAv={isDubAvailable} skipTimings={skipData} />}
            </>
        );
    } catch (e) {
        let isDubAvailable = false;
        const { data, isLoading } = useFetcher(siteConfig.apiUrl + "/meta/anilist/info/" + query);
        const episodeInfo = data?.episodes?.find((x: episodeType) => String(x.number) == episodeNumber);
        const episodeId = episodeInfo?.id;
        const { data: epData } = useFetcher(siteConfig.apiUrl + "/meta/anilist/watch/" + episodeId);
        console.log(data?.title?.english);
        let sortedEpisodes = data?.episodes?.sort((a: any, b: any) => a.number - b.number);
        const error = "";
        const url = `/api/skiptimings?malid=${data?.malId}&epnumber=${episodeNumber}&eplen=0`;
        const { data: skipData } = useFetcher(url);
        return (
            <>
                {isLoading && <DefaultLayout>
                    <div className="flex flex-col items-center justify-center h-screen">
                        <div className='LoadWrapper'>
                            <div className="loader"></div>
                        </div>
                    </div>
                </DefaultLayout>}
                {!isLoading && <AnimeWatchPage data={data} episodeInfo={episodeInfo} epData={epData} episodes={sortedEpisodes} episodeId={episodeId} error={error} DubAv={isDubAvailable} skipTimings={skipData} />}
            </>
        );
    }

}

export default WatchPage
interface episodeType {
    number: number,
    id: string,
}

const AnimeWatchPage = ({ data, episodeInfo, epData, episodes, episodeId, error, DubAv, skipTimings }: { data: AnimeType, episodeInfo: Episode, epData: VideoData, episodes: any, episodeId: string, error: string, DubAv: boolean, skipTimings: SkipTimings[] }) => {
    const [anime, setAnime] = useState(data);
    const [episodeData, setEpisodeData] = useState<VideoData | null>(null);
    const router = useRouter();
    const aid: String = data?.id;
    const [Loading, setLoading] = useState(false);
    const [checked, setCheck] = useState(true);
    const [autoPlayNext, setAutoPlayNext] = useState(true);
    const [skipIn, setSkipIn] = useState(true);
    const [skipOut, setSkipOut] = useState(false);
    const player = useRef<MediaPlayerElement>(null);
    const { currentTime, duration } = useMediaStore(player);
    // when the video is ended, go to next episode


    useEffect(() => {
        // console.log(currentTime, duration);
        if ((currentTime == duration) && (currentTime != 0 && duration != 0)) {
            if (autoPlayNext == false) return;
            let NextEpNumber = router.query.episode ? Number(router.query.episode) + 1 : 1;
            const epId = episodes?.find((x: episodeType) => String(x.number) == String(NextEpNumber));
            if (epId) {
                console.log("[Autoplay]: Next Episode");
                router.push(`/watch/${anime?.id}/${epId?.number}`);
            }
        }
        if (skipTimings && skipTimings?.length > 0) {
            const timings: SkipTimings[] = skipTimings.filter((x: SkipTimings) => x.skipType == "op" || x.skipType == "ed");
            if (!timings.length) return;
            if (timings[0]?.skipType == "op" && skipIn) {
                if (currentTime >= timings[0]?.interval?.startTime && currentTime <= timings[0]?.interval?.endTime) {
                    if (player?.current && player?.current?.currentTime) player.current.currentTime = timings[0]?.interval?.endTime;
                    console.log("[Skip]: Intro");
                }
            }
            if (timings[1]?.skipType == "ed" && skipOut) {
                if (currentTime >= timings[1]?.interval?.startTime && currentTime <= timings[1]?.interval?.endTime) {
                    if (player?.current && player?.current?.currentTime) player.current.currentTime = timings[1]?.interval?.endTime;
                    console.log("[Skip]: Outro");
                }
            }
        }
    }, [currentTime, duration, autoPlayNext, skipTimings, skipIn, skipOut]);
    let bgStyle = {
        backgroundColor: "var(--rich-black-fogra-29)"
    };
    const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    useEffect(() => {
        if (epData?.sources) {
            setEpisodeData(epData);
        }
    }, [epData])
    const FetchAndSet = async (isChecked: boolean) => {
        const { data } = await axios.get(siteConfig.apiUrl + '/meta/anilist/info/' + aid + "?dub=" + isChecked);
        if (data) {
            const epId = data?.episodes?.find((x: episodeType) => String(x.number) == router.query.episode);
            const { data: epData } = await axios.get(siteConfig.apiUrl + "/meta/anilist/watch/" + epId?.id);
            setEpisodeData(epData);
            setAnime(data);
        } else {
            console.log("Error");
        }
        data?.id && setLoading(false);
        return data;
    }
    return (
        <>
            <DefaultLayout>
                <section className='anime-details spad' style={{
                    height: "100%"
                }}>
                    <div className='h-screen w-full' style={{
                        backgroundImage: `url("${anime?.cover}")`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        position: "fixed",
                        // width: "100%",
                        height: "100%"
                    }}>
                        <div className="bg-blur"></div>
                    </div>
                    <div className="container mx-auto p-4" >
                        <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                            <div className="col-span-1 md:col-span-1 h-[800px] rounded-lg shadow-md p-4 " style={bgStyle}>
                                <div className="flex items-center justify-center mb-3">
                                    <h1>Currently Watching: {parseText(anime?.title)}</h1>
                                </div>
                                <div className="wrapper">
                                    {!episodeData?.sources && <Skeleton className="h-[200px] w-full rounded-lg" />}
                                    {episodeData?.sources && <MediaPlayer ref={player}
                                        title={episodeInfo?.title}
                                        src={{
                                            src: episodeData?.sources && episodeData?.sources.find((x: any) => x.quality == "default")?.url || "",
                                            type: 'application/x-mpegurl',
                                        }}
                                        poster={episodeInfo?.image}
                                        aspectRatio={16 / 9}
                                        crossorigin=""

                                    >
                                        <MediaOutlet>
                                            <MediaPoster
                                                alt={episodeInfo?.title}
                                            />
                                        </MediaOutlet>
                                        <MediaCommunitySkin />
                                    </MediaPlayer>}
                                </div>
                                <div className="flex justify-between items-center flex-wrap gap-3 mt-3 px-4">

                                    <Switch defaultSelected size="sm"
                                        onChange={(e: any) => setSkipIn(e?.target?.checked)}
                                    >Skip Intro</Switch>
                                    <Switch defaultSelected size="sm" onChange={(e: any) => setSkipOut(e?.target?.checked)}>Skip Outro</Switch>

                                </div>
                                <div className="flex justify-between items-center flex-wrap gap-3 mt-1 px-4">
                                    <Switch defaultSelected size="sm" onChange={(e: any) => setAutoPlayNext(e?.target?.checked)}>
                                        <small>Autoplay Next</small>
                                    </Switch>
                                    {Loading && <div className='LoaderWrapper bg-black bg-opacity-40 absolute h-screen w-screen z-10 flex justify-center items-center'>
                                        <div className="loader"></div>
                                    </div>}
                                    {!Loading && <Switch defaultSelected={!DubAv ? false : checked}
                                        isDisabled={!DubAv}
                                        size="sm"
                                        onChange={(event: any) => {
                                            const isChecked = event?.target?.checked;
                                            console.log(isChecked);
                                            setLoading(true);
                                            FetchAndSet(isChecked);
                                            setCheck(isChecked);
                                        }}
                                    >Dubbed</Switch>}
                                </div>
                                <div className="flex justify-center items-center flex-wrap gap-2 mt-1">
                                    <ButtonGroup>
                                        <Button
                                            variant='shadow'
                                            color='primary'
                                            style={{
                                                width: "120px"
                                            }}
                                            startContent={<BsFillSkipStartFill />}
                                            onClick={() => {
                                                if (router.query.episode == "1") return;
                                                let NextEpNumber = router.query.episode ? Number(router.query.episode) - 1 : 1;
                                                const epId = episodes?.find((x: episodeType) => String(x.number) == String(NextEpNumber));
                                                if (epId) {
                                                    router.push(`/watch/${anime?.id}/${epId?.number}`);
                                                }
                                            }}
                                        >Previous</Button>
                                        <Button
                                            variant='shadow'
                                            color='primary'
                                            style={{
                                                width: "120px"
                                            }}
                                            endContent={<BsFillSkipEndFill />}
                                            onClick={() => {
                                                let NextEpNumber = router.query.episode ? Number(router.query.episode) + 1 : 1;
                                                const epId = episodes?.find((x: episodeType) => String(x.number) == String(NextEpNumber));
                                                if (epId) {
                                                    router.push(`/watch/${anime?.id}/${epId?.number}`);
                                                }
                                            }}
                                        >Next</Button>
                                    </ButtonGroup>
                                </div>
                            </div>


                            <div className="col-span-1 rounded-lg h-[800px] shadow-md p-4 mb-3" style={bgStyle}>
                                <h3 className="text-lg font-semibold mb-4">Episode List</h3>
                                <div className="wrapper  h-[20%] overflow-y-scroll">
                                    <ul className="flex gap-2 flex-wrap">
                                        {episodes?.map((ep: any) => (
                                            <Link href={`/watch/${anime?.id}/${ep.number}`} key={ep.id}>
                                                <li className="p-3 bg-gray-800 rounded-sm hover:bg-gray-600 cursor-pointer transition-all">{ep.number}</li>
                                            </Link>
                                        ))}
                                    </ul>
                                </div>
                                <div className="wrapper h-[550px] overflow-y-scroll mt-3">
                                    <ul className="flex gap-2 flex-wrap ">
                                        {episodes?.map((ep: any) => (
                                            <Link href={`/watch/${anime?.id}/${ep.number}`} className="w-full" key={ep.id}>
                                                <li className={`p-3 rounded-sm  cursor-pointer transition-all w-full ${ep.id == episodeId ? "bg-blue-500 text-black hover:bg-blue-600" : "bg-gray-800 hover:bg-gray-600"}`} key={ep.id}>
                                                    <div className="flex gap-2 justify-between">
                                                        <div className="flex flex-col">
                                                            <h4 className="font-semibold">{ep?.title?.length > 55 ? ep.title.slice(0, 55) + "..." : ep.title}</h4>
                                                            {ep?.airDate && <p className="text-gray-300">{shortDateFormatter.format(new Date(ep?.airDate))}</p>}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <h4 className="font-semibold">Watch</h4>
                                                            <p className="text-gray-300">Ep {ep.number}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-span-1 rounded-lg h-[800px] shadow-md p-4" style={bgStyle}>
                                <h3 className="text-lg font-semibold mb-2">Related Anime</h3>
                                <div className="flex flex-col">
                                    {anime?.relations && anime?.relations.slice(0, 7).map((item: any) => {
                                        return <div className="flex mb-2" key={item?.id}>
                                            <Image src={item?.image} alt="Related Anime" className="w-16 h-16 object-cover rounded-lg" />
                                            <div className="ml-4">
                                                <small className="font-semibold">{parseText(item?.title)}</small>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex flex-col">
                                                        <p className="text-gray-500">Rating:{item?.rating / 10}</p>
                                                        <p className="text-gray-500">Relation:<br />{item?.relationType}</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-gray-500">Type:{item?.type}</p>
                                                        <p className="text-gray-500">Status:<br />{item?.status}</p>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </DefaultLayout>
        </>
    )
}