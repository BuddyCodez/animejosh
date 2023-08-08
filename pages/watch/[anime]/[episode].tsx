import { siteConfig } from '@/config/site';
import DefaultLayout from '@/layouts/default';
import { AnimeType } from '@/pages/anime/[id]';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
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
    MediaCommunitySkin, MediaOutlet, MediaPlayer, MediaPoster,
} from '@vidstack/react';
import { SettingsIcon } from '@vidstack/react/icons';
import parseText from '@/utils/parseText';
import { Image, Switch } from '@nextui-org/react';
import useFetcher from '@/utils/fetcher';
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
const WatchPage = ({ data, episodeInfo, epData, episodes, episodeId, error, DubAv }: { data: AnimeType, episodeInfo: Episode, epData: VideoData, episodes: any, episodeId: string, error: string, DubAv: boolean }) => {
    const [anime, setAnime] = useState(data);
    const aid: String = data?.id;
    const [Loading, setLoading] = useState(false);
    const [checked, setCheck] = useState(true);
    if (error) return <h1>{error}</h1>;
    let bgStyle = {
        backgroundColor: "var(--rich-black-fogra-29)"
    };
    const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const FetchAndSet = async (isChecked: boolean) => {
        const { data } = await axios.get(siteConfig.apiUrl + '/meta/anilist/info/' + aid + "?dub=" + isChecked);
        data?.id && setLoading(false);
        data?.id && setAnime(data);
        return data;
    }
    return (
        <>
            <DefaultLayout>
                <section className='anime-details spad' style={{
                    backgroundImage: `url("${anime?.cover}")`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                }}>
                    <div className="bg-blur"></div>
                    <div className="container mx-auto p-4" >
                        <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                            <div className="col-span-1 md:col-span-1 h-[800px] rounded-lg shadow-md p-4 " style={bgStyle}>
                                <div className="flex items-center justify-center mb-3">
                                    <h1>Currently Watching: {parseText(anime?.title)}</h1>
                                </div>
                                <div className="wrapper">
                                    <MediaPlayer
                                        title={episodeInfo.title}
                                        src={{
                                            src: epData?.sources.find((x: any) => x.quality == "default")?.url || epData?.sources[0]?.url,
                                            type: 'application/x-mpegurl',
                                        }}
                                        poster={episodeInfo?.image}
                                        aspectRatio={16 / 9}
                                        crossorigin=""

                                    >
                                        <MediaOutlet>
                                            <MediaPoster
                                                alt={episodeInfo.title}
                                            />

                                        </MediaOutlet>
                                        <MediaCommunitySkin />
                                    </MediaPlayer>
                                </div>
                                <div className="flex justify-center items-center flex-wrap gap-2 mt-3">
                                    <Switch defaultSelected size="sm">Skip Intro</Switch>
                                    <Switch defaultSelected size="sm">Skip Outro</Switch>
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

export default WatchPage
interface episodeType {
    number: number,
    id: string,
}
export async function getServerSideProps(context: any) {
    const query = context.query.anime;
    const episodeNumber = context.query.episode;
    console.log(context.query);
    let isDubAvailable;
    let animeInfo;
    
    try {
        let { data } = await axios.get(siteConfig.apiUrl + "/meta/anilist/info/" + query + "?dub=true");
        isDubAvailable = true;
        animeInfo = data;
    } catch (err) {
        let { data } = await axios.get(siteConfig.apiUrl + "/meta/anilist/info/" + query);
        isDubAvailable = false;
        animeInfo = data;
    } finally {
        if (!animeInfo?.episodes || animeInfo.episodes.length === 0) {
            let { data } = await axios.get(siteConfig.apiUrl + "/meta/anilist/info/" + query);
            isDubAvailable = false;
            animeInfo = data;
        }
    }
    console.log(animeInfo, isDubAvailable);
    const episodeInfo = animeInfo?.episodes?.find((x: episodeType) => String(x.number) == episodeNumber);
    const episodeId = episodeInfo?.id;

    const { data: epData } = await axios.get(siteConfig.apiUrl + "/meta/anilist/watch/" + episodeId);
    console.log(animeInfo?.title?.english);
    let sortedEpisodes = animeInfo?.episodes?.sort((a: any, b: any) => a.number - b.number);

    return {
        props: {
            data: animeInfo,
            episodeInfo: episodeInfo,
            epData: epData,
            episodes: sortedEpisodes,
            episodeId: episodeId,
            DubAv: isDubAvailable
        }
    }
}