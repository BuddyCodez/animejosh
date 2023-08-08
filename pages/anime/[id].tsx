import React, { useState, useRef, useEffect } from 'react'
import DefaultLayout from '@/layouts/default';
import { siteConfig } from '@/config/site';
import axios from 'axios';
import { Button, Card, Image, CardHeader, Chip, CardFooter, Pagination, Input } from '@nextui-org/react';
import parseText, { parseAllText, textType } from '@/utils/parseText';
import StarRating from '@/components/starRating';
import parse from 'html-react-parser';
import { BsPlay, BsPlayFill } from 'react-icons/bs';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
interface AnimeType {
  id: String,
  malId: number,
  title: textType,
  status: string,
  image: string,
  cover: string,
  popularity: number,
  description: string,
  rating: number,
  genres: Array<string>,
  color: string,
  totalEpisodes: number,
  currentEpisode: number,
  type: string,
  releaseDate: number
  episodes: Array<Object>,
  studios: Array<string>,
  synonyms: Array<string>,
  duration: number,
  season: string,
  subOrDub: string,
  recommendations: Array<Object>,
  relations: Array<Object>
}

interface Episode {
  number: number;
  id: string;
  title: string;
  image: string;
  airDate: string;

  // Other properties of an episode, adjust accordingly.
}
const AnimeDetails = ({ anime }: { anime: AnimeType }) => {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // console.log(anime);
  const formatter = new Intl.NumberFormat('en', {
    notation: "compact",
    compactDisplay: "short",
  });
  const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  useEffect(() => {
    const sortedEpisodes = anime.episodes.slice(0).sort((a: any, b: any) => a.number - b.number);
    const topEpisodes: any = sortedEpisodes.slice(0, 15);
    setEpisodes(topEpisodes);
  }, [anime]);

  return (
    <>
      <DefaultLayout>
        <article>
          <section className="anime-details spad mt-[60px] mb-4" style={{
            background: "var(--rich-black-fogra-29)"
          }}>
            <div className="container">
              <div className="anime__details__content">
                <div className="row">
                  <div className="col-lg-3">
                    <Image

                      className="anime__details__pic set-bg cursor-pointer" src={anime?.image} isZoomed isBlurred shadow='lg' />
                  </div>
                  <div className="col-lg-9">
                    <div className="anime__details__text">
                      <div className="anime__details__title max-sm:mt-3">
                        <h3>{parseText(anime?.title)}</h3>
                        <span>{anime?.synonyms?.slice(0, 3).join(" / ")}</span>
                      </div>
                      <div className="anime__details__rating  hideonphone">
                        <div className="rating flex">
                          <StarRating rating={anime.rating} />
                        </div>
                      </div>
                      <div className="h-[200px] overflow-y-scroll p-3">
                        <p>{parse(anime?.description)}</p>
                      </div>
                      <div className="anime__details__widget">
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <ul>
                              <li><span>Type:</span> {anime?.type}</li>
                              <li><span>Studios:</span> {anime.studios.join(",")}</li>
                              <li><span>Date aired:</span> {anime?.releaseDate}</li>
                              <li><span>Status:</span> {anime?.status}</li>
                              <li><span>Genre:</span> {anime?.genres.join(", ")}</li>
                            </ul>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <ul>
                              <li><span>Popularity:</span>{formatter.format(anime?.popularity)}</li>
                              <li><span>Rating:</span> {anime?.rating / 10} / 10</li>
                              <li><span>Duration:</span> {anime?.duration} min/ep</li>
                              <li><span>Episodes:</span>{anime?.totalEpisodes || anime?.currentEpisode} Ep</li>
                              <li><span>Current: </span>{anime?.currentEpisode} Ep</li>
                              <li><span>Season:</span> {anime?.season}</li>

                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="anime__details__btn">
                        <Button variant='solid' color='primary' endContent={
                          <BsPlayFill scale={2} color='black' />
                        } onPress={() => router.push(`/watch/${anime?.id}/1`)}
                        >Watch Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-9 col-md-8">
                  <div className="anime__details__review" ref={ref}>
                    <div className="section-title flex justify-between items-center">
                      <h5 className='text-3xl bold text-white flex justify-between items-center w-full'>Episodes:
                        <Input label="Search Episode..." style={{
                          width: "120px"
                        }} fullWidth={false}
                          className="max-w-[220px]"
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            if (!anime || !anime.episodes) {
                              setEpisodes(null);
                              return;
                            }

                            if (searchTerm === "") {
                              const sortedEpisodes = anime.episodes.slice(0).sort((a: any, b: any) => a.number - b.number);
                              const topEpisodes: any = sortedEpisodes.slice(0, 15);
                              setEpisodes(topEpisodes);
                            } else {
                              const FilteredEp: any = anime.episodes.filter((x: any) => x.title.toLowerCase().includes(searchTerm));
                              setEpisodes(
                                FilteredEp);
                            }
                          }}
                        />
                      </h5>

                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {episodes?.map((item: any, index: number) => {
                        return <Card className=" h-[300px] w-[250px]" isPressable isHoverable key={item?.id || index}
                          onPress={() => {
                            router.push("/watch/" + anime?.id + "/" + item?.number);
                          }}
                        >
                          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            <div className="flex justify-between w-full">
                              <Chip color="primary" variant="shadow">{item?.number} Ep</Chip>
                              {item?.airDate && <Chip color="default" variant="shadow">
                                <i className="fa-solid fa-calendar"></i> &nbsp;
                                {shortDateFormatter.format(new Date(item?.airDate))} </Chip>}
                            </div>
                          </CardHeader>
                          <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover"
                            src={item?.image}
                            isBlurred
                            isZoomed
                          />
                          <CardFooter className="absolute z-10 bottom-0 flex-col" style={{
                            backgroundImage: " linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))",
                            width: "100%"
                          }}>
                            <p className='poppins text-md'>{item?.title}</p>

                          </CardFooter>
                        </Card>
                      })}
                    </div>
                    <div className="flex w-full items-center justify-center mt-3">
                      {anime?.episodes?.length > 15 && <Pagination showControls total={Math.ceil(anime?.episodes.length / 15)}
                        onChange={(page) => {
                          // console.log("page", page);
                          let end = (15 * page);
                          const sortedEpisodes: any = anime?.episodes?.sort((a: any, b: any) => a.number - b.number);
                          setEpisodes(sortedEpisodes.slice(end - 15, end));
                          ref?.current && ref?.current.scrollIntoView({ behavior: 'smooth' });
                        }}
                      // initialPage={1}
                      />}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4">
                  <div className="anime__details__sidebar product__sidebar">
                    <div className="section-title w-full flex items-center justify-between mb-4">
                      <h5 className='p-0 w-[150px] '>You might also like ...</h5>
                      <Link href={"/recommendations/" + anime?.id} className="primary-btn">View All <i className="fa-solid fa-arrow-right"></i></Link>
                    </div>
                    <div className="flex flex-col gap-2">
                      {anime?.recommendations && anime?.recommendations.slice(0, 5).map((item: any, index: number) => {
                        return <Card className="col-span-12 sm:col-span-4 h-[300px]" isPressable isHoverable
                          onPress={() => {
                            router.push("/anime/" + item?.id);

                          }}
                          key={item?.id}
                        >
                          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            <div className="flex justify-between w-full">
                              <Chip color="primary" variant="shadow">{item?.episodes} Ep</Chip>
                              <Chip color="default" variant="shadow">
                                {item?.status} </Chip>
                            </div>
                          </CardHeader>
                          <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover"
                            src={item?.image}
                            isBlurred
                            isZoomed
                          />
                          <CardFooter className="absolute z-10 bottom-0 flex-col" style={{
                            backgroundImage: " linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))",
                            width: "100%"
                          }}>
                            <Typography variant='h6' className='poppins'>{parseText(item?.title)}</Typography>

                          </CardFooter>
                        </Card>
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </DefaultLayout>
    </>
  )
}
export async function getServerSideProps(context: any) {
  const query = context?.query.id;
  console.log(context.query);
  // console.log(query);
  const { data: anime } = await axios.get(siteConfig.apiUrl + "/meta/anilist/info/" + query);
  // console.log(anime);
  return {
    props: {
      anime: anime,
    }
  }
}

export default AnimeDetails;
export type { AnimeType };
