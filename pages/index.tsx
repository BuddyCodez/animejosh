
import Hero from "@/components/Hero";
import Toprated from "@/components/Toprated";
import Trending from "@/components/Trending";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
	return (
		<DefaultLayout>
			<article>
				<Hero />
				<Trending />
				<Toprated />
			</article>
		</DefaultLayout>
	);
}
