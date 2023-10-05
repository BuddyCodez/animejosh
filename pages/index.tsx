
import Hero from "@/components/Hero";
import Toprated from "@/components/Toprated";
import Trending from "@/components/Trending";
import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import { useEffect } from "react";
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
export default function IndexPage() {
	const { data: session } = useSession();
	return (
		<DefaultLayout>
			<Head>

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
						type: 'website',
						url: 'https://animevite.vercel.app/',
						siteName: 'AnimeVite - All in one anime platform',
						
					}}
					twitter={{
						handle: '@handle',
						site: '@site',
						cardType: 'summary_large_image',
					}}
				/>
			</Head>
			<article>
				<Hero />
				<Trending />
				<Toprated />
			</article>
		</DefaultLayout>
	);
}
