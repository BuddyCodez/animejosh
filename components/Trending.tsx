import { Image, CircularProgress, Card, Skeleton, Button } from "@nextui-org/react";
import { useRef, RefObject } from "react";
import Link from "next/link";
import useFetcher from "@/utils/fetcher";
import { siteConfig } from "@/config/site";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import parseText from "@/utils/parseText";
const Loader = () => {
    return (
        <>
            <div className="flex justify-center items-center w-full h-full gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((e: any) => (
                    <Card className="w-[200px] h-[200px]" radius="lg" key={e}>
                        <Skeleton className="rounded-lg">
                            <div className="h-[200px] rounded-lg bg-default-300"></div>
                        </Skeleton>
                    </Card>
                ))}
            </div>
        </>

    )
}
const Trending = () => {
    const { data, isLoading } = useFetcher(siteConfig.apiUrl + "/meta/anilist/trending?perPage=20");
    const ref: RefObject<HTMLDivElement> = useRef(null);
    return (
        <>
            <section className="Trending">

                <div className="TrendingHeader">

                    <h1 className="float-left bah-heading mr-2">

                        Trending 20

                    </h1>

                </div>

                <div className="TrendingContent">

                    <div className="TrendingContentInner" ref={ref}>

                        {!isLoading ? (<ul className="ulclear">

                            {

                                data?.results.map((item: any, index: number) => {

                                    return (

                                        <li className="TrendingItem" key={item?.id}>

                                            <Link href={`/anime/${item?.id}`}>

                                                <div className="TrendingItemInner">

                                                    <div className="TrendingItemInnerRight">

                                                        <div className="TrendingItemInnerRightContent">

                                                            <p>
                                                                {parseText(item.title, 15)}
                                                            </p>

                                                        </div>

                                                        <span>{index + 1}</span>

                                                    </div>

                                                    <div className="TrendingItemInnerLeft">

                                                        <div className="TrendingItemImg">

                                                            {/* <Image src={item.image} alt={item.title.english}
                                                              showSkeleton maxDelay={5000} className="TrendingItemImg lazyload"
                                                              objectFit="cover"

                                                          /> */}
                                                            <Image src={item.image} alt={item.title.english}
                                                                isZoomed className="TrendingItemImg lazyload"
                                                                shadow="lg"
                                                                radius="none"
                                                            />

                                                        </div>

                                                    </div>

                                                </div>

                                            </Link>

                                        </li>

                                    )

                                })

                            }

                        </ul>) : (

                            <div className="ulclear">
                                <Loader />
                            </div>

                        )}

                    </div>

                    <div className="TredingContentOuter">

                        <div className="btns-container">


                            <Button 
                                variant="solid"
                                color="primary"
                                isIconOnly
                                endContent={
                                    <span className="Rotate">
                                        <BsChevronRight />
                                    </span>
                                }
                                onClick={() => {

                                    if (ref && ref.current) {
                                        ref.current.scrollLeft += 300;
                                    }
                                }}

                            >
                            </Button>





                            <Button variant="solid"
                                color="primary"
                                isIconOnly
                                endContent={
                                    <span className="Rotate">
                                        <BsChevronLeft />
                                    </span>
                                }
                                onClick={() => {
                                if (ref && ref.current) {
                                    ref.current.scrollLeft -= 300;
                                }

                            }} >

                                
                            </Button>



                        </div>

                    </div>

                </div>

            </section>
        </>
    )
}

export default Trending
export { Loader };