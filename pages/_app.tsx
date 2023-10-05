import '@/styles/bootstrap.css';
import "@/styles/globals.css";
import '@/styles/home2.css';
// import '@/styles/episode.css';
// import '@/styles/home.css';
import '@/styles/style.css';
import '@/styles/others.css';
import "@/styles/index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import type { AppProps } from "next/app";
import { DefaultSeo, LogoJsonLd } from 'next-seo';
import { siteConfig } from '@/config/site';
import { SessionProvider } from "next-auth/react"
import { UserProvider } from '@/contex/User';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {

	return (
		<>
			<Script src="https://kit.fontawesome.com/79101233a3.js" crossOrigin="anonymous"></Script>
			<NextUIProvider>
				<NextThemesProvider>
					<SessionProvider session={session}>
						<UserProvider>
							<Component {...pageProps} />
							<Analytics />
						</UserProvider>
					</SessionProvider>
				</NextThemesProvider>
			</NextUIProvider>
		</>
	);
}

export const fonts = {
	sans: fontSans.style.fontFamily,
	mono: fontMono.style.fontFamily,
};
