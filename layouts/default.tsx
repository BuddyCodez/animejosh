import { Navbar } from "@/components/navbar";
import { Head } from "./head";
import { Image } from "@nextui-org/react";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { BsChevronUp } from "react-icons/bs";
import { TbChevronUp } from "react-icons/tb";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col h-screen">
			<Head />
			<Navbar />
			<main >
				{children}
			</main>
			<footer className="footer">
				<div className="page-up">
					<a onClick={() => {
						window.scrollTo({
							top: 0,
							behavior: 'smooth'
						});
					}} id="scrollToTopButton">
						<TbChevronUp className="icon w-full h-full flex justify-center items-center p-2"/>
					</a>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-lg-3">
							<div className="footer__logo flex gap-0 items-center">
								<Logo />
								{siteConfig?.name}
							</div>
						</div>
						<div className="col-lg-6">
							<div className="footer__nav">
								<ul>
									{siteConfig.navItems.map((item) => (
										<li key={item.href}>
											<Link href={item.href}>
												{item.label}
												</Link>
										</li>
									))}
									
								</ul>
							</div>
						</div>
						<div className="col-lg-3">
							<p>
								Copyright &copy;{new Date().getFullYear()} All rights reserved | made with 💖 by <Link href="https://uditvegad.vercel.app" target="_blank">Udit Vegad.</Link>
								</p>

						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
