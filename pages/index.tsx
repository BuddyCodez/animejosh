
import Hero from "@/components/Hero";
import Toprated from "@/components/Toprated";
import Trending from "@/components/Trending";
import DefaultLayout from "@/layouts/default";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function IndexPage() {
	const { data: session } = useSession();
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
