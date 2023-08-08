import { Container } from '@mui/material';
import { Card, CardBody, CardFooter, CircularProgress, Image, TableColumn, TableRow } from '@nextui-org/react';
import React, { useState } from 'react'

const Latestsection = ({ isLoading, DATA, subOrDub, subtitle, title, styleObj }: any) => {
    let [anime, setanime] = useState(DATA);
    DATA = DATA?.filter((item: any) => item.subOrDub == subOrDub || "SUB");
    DATA = DATA?.slice(0, 20);
    return (
        <>
            <section style={{
                background: "#110f1a",

                // margin: '20px',
            }} className="lazyload"
            >
                <Container>
                    <h1 className=" section-subtitle" style={{ textAlign: "left" }}>{subtitle || ""}</h1>
                    <h1 className=" section-title" style={{ textAlign: "left" }}>{title || ""}</h1>
                    {isLoading && anime?.length > 0 ? (
                        <div className="flex justify-center items-center h-screen">
                            <CircularProgress />
                        </div>
                    ) : (
                        <div className="mt-5 gap-3 flex justify-start flex-wrap newsSec"
                            style={styleObj}
                        >
                            {DATA?.map((item: any) => {
                                return <Card style={{ minWidth: "210px", height: "300px" }} key={item.name} isPressable isHoverable>

                                    <CardBody style={{ padding: 0 }}>
                                        <Image
                                            src={item.imgUrl}
                                            width="100%"
                                            height="100%"
                                            alt={item.name}
                                            loading="lazy"
                                            isZoomed
                                        />
                                    </CardBody>
                                    <CardFooter

                                        style={{
                                            position: "absolute",
                                            background: "#ffffff44",
                                            borderTop: "$borderWeights$light solid rgba(0, 0, 0, 0.4)",
                                            bottom: 0,
                                            zIndex: 1,
                                        }}
                                    >
                                        <TableRow>
                                            <TableColumn>
                                                <h3 className='text-white' style={{ fontFamily: "Poppins", }}>
                                                    {item.name}
                                                </h3>
                                            </TableColumn>
                                            <TableColumn>
                                                <span className='text-white' style={{
                                                    fontFamily: "Poppins", display: "flex",
                                                    gap: "7px"
                                                }}>
                                                    Episode: <span style={{
                                                        fontFamily: "Poppins",
                                                    }} className=' text-cyan-400'>{item.episodeNum}</span>
                                                </span>
                                            </TableColumn>

                                        </TableRow>
                                    </CardFooter>
                                </Card>
                            })}
                        </div>
                    )}
                </Container>
            </section>
        </>
    )
}

export default Latestsection