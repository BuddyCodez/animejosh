
import Hero from "@/components/Hero";
import Toprated from "@/components/Toprated";
import Trending from "@/components/Trending";
import DefaultLayout from "@/layouts/default";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function IndexPage() {
	const { data: session } = useSession();
	const fetchUser = async () => {
		const { data } = await axios.post("/api/user/find", {
			email: session?.user?.email,
		});
		return data || false;
	};
	const createUser = async () => {
		const { data } = await axios.post("/api/users/create", {
			email: session?.user?.email,
			name: session?.user?.name,
			image: session?.user?.image,
		});
		return data || false;
	};
	useEffect(() => {
		if (session) {
			fetchUser().then((r) => {
				const userId = String(r.userId);
				if (!userId || userId == "null") {
					createUser().then((r) => {
						console.log(r);
					});
				}
			});
		}

	}, [session])
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
