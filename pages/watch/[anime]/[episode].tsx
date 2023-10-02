

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
import useSWR from 'swr';
import {
    MediaCommunitySkin, MediaOutlet, MediaPlayer, MediaPoster, useMediaStore,
} from '@vidstack/react';
import { useRef } from 'react';
import { type MediaPlayerElement } from 'vidstack';

import parseText from '@/utils/parseText';
import { Button, ButtonGroup, Image, Input, Skeleton, Switch } from '@nextui-org/react';
import { useRouter } from 'next/router';
import useFetcher from '@/utils/fetcher';
import { BsFillSkipEndFill, BsFillSkipStartFill } from 'react-icons/bs';
import { SearchIcon } from '@/components/icons';
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

let fetcher = (...args: any) => axios.get(args, { timeout: 60000 }).then((res) => res.data);
const WatchPage = ({ data, episodeInfo, epData, episodes, episodeId, error, DubAv, skipTimings }: { data: AnimeType, episodeInfo: Episode, epData: VideoData, episodes: any, episodeId: string, error: string, DubAv: boolean, skipTimings: SkipTimings[] }) => {
    const router = useRouter();
    const animeId = router.query?.anime;
    const episodeNumber = router.query?.episode;
    const Fetch = () => {
        const { data, error } = useSWR(`/api/episodes/${animeId}/${episodeNumber}`, fetcher);
        let isLoading = !data && !error;
        return {
            skipData: [],
            isDubAvailable: data?.dubAvailable,
            data: data?.animeInfo,
            isLoading: isLoading,
            episodeInfo: data?.episodeInfo,
            epData: data?.episodeSource,
            sortedEpisodes: data?.sortedEpisodes,
            episodeId: episodeId,
        }
    }

    try {
        if (!router.query?.anime || !router.query?.episode) return;
        let { skipData, isDubAvailable, data, isLoading, episodeInfo, epData, sortedEpisodes, episodeId }: any = Fetch();
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
        console.error(e);

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
    const [searchEnabled, setSearchEnabled] = useState(false);
    const [filteredEpisodes, setFilteredEpisodes] = useState(episodes);
    // when the video is ended, go to next episode
    const episodeNumber = router.query?.episode;
    function AutoPlayNextEpisode() {
        if ((currentTime == duration) && (currentTime != 0 && duration != 0)) {
            if (autoPlayNext == false) return;
            let NextEpNumber = router.query.episode ? Number(router.query.episode) + 1 : 1;
            const epId = episodes?.find((x: episodeType) => String(x.number) == String(NextEpNumber));
            // console.log(epId);
            if (epId) {
                console.log("[Autoplay]: Next Episode");
                router.push(`/watch/${anime?.id}/${epId?.number}`);
            }
        }
    }
    useEffect(() => {
        AutoPlayNextEpisode();
        console.log(currentTime, duration)
        if (Array.isArray(skipTimings) && skipTimings?.length > 0) {
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
    }, [currentTime, duration, skipTimings, skipIn, skipOut]);

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
                                            src: episodeData?.sources.find((x: any) => x.quality == "default")?.url || "",
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
                                <div className="flex items-center justify-between w-[100%] mb-4">
                                    {!searchEnabled && <>
                                        <h3 className="text-lg font-semibold">Episode List</h3>
                                        <Button variant="ghost" color="primary" isIconOnly radius='full' onClick={
                                            () => {
                                                setSearchEnabled(!searchEnabled);
                                            }
                                        }>
                                            <SearchIcon scale={1.5} />
                                        </Button></>}
                                    {searchEnabled && <>
                                        <Input
                                            isClearable
                                            onClear={() => {
                                                setFilteredEpisodes(episodes);
                                                setSearchEnabled(false);
                                            }}
                                            placeholder="Search Episode"
                                            onKeyPress={(e: any) => {
                                               if(e?.key == "Enter") {
                                                   const query = e?.target?.value;
                                                   if (!query || query == "") return setFilteredEpisodes(episodes);
                                                   const filteredEpisodes = episodes?.filter((x: any) => x?.title?.toLowerCase().includes(query?.toLowerCase())
                                                       || x?.number?.toString().includes(query?.toLowerCase())
                                                   );
                                                   setFilteredEpisodes(filteredEpisodes);
                                               }
                                            }}
                                        />
                                    </>}
                                </div>
                                <div className="wrapper h-[93%] overflow-y-scroll">
                                    <ul className="flex flex-col p-1">
                                        {filteredEpisodes?.map((ep: any, index: number) => (
                                            <li className="border-gray-400 flex flex-row mb-2" key={ep?.id}>
                                                <div className={`select-none cursor-pointer ${(index + 1).toString() == episodeNumber ? "bg-gray-900" : "bg-slate-800"} rounded-md flex flex-1 items-center p-3  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg`}>
                                                    <div className="flex flex-col rounded-md w-10 h-10 bg-gray-300 justify-center items-center mr-4">
                                                        <Image src={ep?.image} alt="Episode Image" className="w-10 h-10 object-cover rounded-md" />
                                                    </div>
                                                    <div className="flex-1 pl-1">
                                                        <div className="font-medium">{ep?.title}</div>
                                                        <div className="text-gray-600 text-sm">{ep?.number} Episode</div>
                                                    </div>

                                                </div>
                                            </li>
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
