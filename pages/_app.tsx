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
export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	const arr = ['Anime Vite', 'anime vite', 'ANIME VITE', 'AnimeVite', 'AnimeVite', 'Anime Josh', 'Anime Josh', 'udit vegad', 'Udit Vegad', 'Udit', 'udit', 'Vegad', 'vegad', 'Udit vegad Anime', 'Animetronix', 'animematrix', 'animematrix.vercel.app', 'Anime Avenue', 'Anime', 'anime', 'Avenue',
		"Anime streaming",
		"Watch anime online",
		"Anime episodes",
		"Anime series",
		"Anime shows",
		"Streaming platform",
		"Anime library",
		"Anime catalog",
		"Anime collection",
		"Watchlist",
		"Anime recommendations",
		"New releases",
		"Popular anime",
		"Exclusive anime",
		"Subbed anime",
		"Dubbed anime",
		"HD streaming",
		"Anime genres",
		"Fantasy anime",
		"Action anime",
		"Adventure anime",
		"Sci-fi anime",
		"Romance anime",
		"Drama anime",
		"Comedy anime",
		"Slice of life anime",
		"Mystery anime",
		"Thriller anime",
		"Horror anime",
		"Supernatural anime",
		"Historical anime",
		"Mecha anime",
		"Magical girl anime",
		"Shounen anime",
		"Shoujo anime",
		"Seinen anime",
		"Josei anime",
		"Anime fan community",
		"Anime discussions",
		"User reviews",
		"Ratings and reviews",
		"Anime forum",
		"Anime news",
		"Simulcast anime",
		"Binge-watching",
		"Anime marathon",
		"Offline viewing",
		"Download anime",
		"Parental controls",
		"Family-friendly anime",
		"Adult anime",
		"Original anime content",
		"Exclusive streaming rights",
		"Multi-device access",
		"Anime app",
		"User interface",
		"Personalized recommendations",
		"Anime trailers",
		"Character development",
		"Art style",
		"Animation quality",
		"Voice acting",
		"Soundtracks",
		"Subtitle options",
		"Dubbing quality",
		"In-app purchases",
		"Free trial",
		"Subscription plans",
		"Ad-free experience",
		"Anime merchandise",
		"Cosplay inspiration",
		"Events and conventions",
		"Anime community",
		"Social sharing",
		"Anime quizzes",
		"Anime trivia",
		"Behind-the-scenes",
		"Studio collaborations",
		"Classic anime",
		"Nostalgia",
		"Original manga adaptations",
		"Seasonal anime",
		"Ongoing series",
		"Quick access",
		"Multiple languages",
		"Watch history",
		"Personal profile",
		"User settings",
		"Cross-platform compatibility",
		"Streaming quality options",
		"Recommendations engine",
		"Custom playlists",
		"Anime marathons",
		"Fan art",
		"Voice actor profiles",
		"Interactive features",
		"Exclusive interviews",
		"Creator insights",
		"Watch parties",
		"Virtual events"
	];
	return (
		<>
			<Script src="https://kit.fontawesome.com/79101233a3.js" crossOrigin="anonymous"></Script>
			<DefaultSeo
				title={siteConfig.name}
				description='Welcome to Anime Vite - your ultimate destination for all things anime! Find the latest news, reviews, and recommendations for your favorite shows, as well as new discoveries. Join our passionate community of anime fans and explore the fascinating world of Japanese animation like never before. Start your journey on AnimeVite today!'
				canonical='https://animevite.vercel.app/'
				openGraph={{
					title: 'AnimeVite - All in one anime platform',
					description: 'Welcome to AnimeVite - your ultimate destination for all things anime! Find the latest news, reviews, and recommendations for your favorite shows, as well as new discoveries. Join our passionate community of anime fans and explore the fascinating world of Japanese animation like never before. Start your journey on AnimeVite today! ' + arr.join(", "),
					images: [
						{
							url: 'https://animevite.vercel.app/animevite.png',
							alt: 'AnimeVite'
						}
					],
					type: 'article',
					article: {
						tags: arr
					},
					url: 'https://animevite.vercel.app/',
					site_name: 'AnimeVite - All in one anime platform',

				}} />
			<NextUIProvider>
				<NextThemesProvider>
					<SessionProvider session={session}>
						<UserProvider>
							<Component {...pageProps} />
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
