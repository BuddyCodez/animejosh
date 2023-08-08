export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "AnimeVite",
	description: "Make beautiful websites regardless of your design experience.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Trending",
			href: "/trending",
		},
		{
			label: "Popular",
			href: "/popular",
		},
		{
			label: "Blog",
			href: "/blog",
		},
		{
			label: "About",
			href: "/about",
		}
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Trending",
			href: "/trending",
		},
		{
			label: "Popular",
			href: "/popular",
		},
		{
			label: "Blog",
			href: "/blog",
		},
		{
			label: "About",
			href: "/about",
		}
	],
	links: {
		github: "https://github.com/BuddyCodez",
		twitter: "https://twitter.com/getnextui",
		docs: "/",
		discord: "https://discord.gg/9Ab7pzwxjh",
		sponsor: "https://www.patreon.com/UditVegad"
	},
	apiUrl: "https://cosumetinstance.vercel.app",
	geners: [
		"Action",
		"Adventure",
		"Comedy",
		"Drama",
		"Fantasy",
		"Horror",
		"Mecha",
		"Mystery",
		"Psychological",
		"Romance",
		"Sci-Fi",
		"Slice of Life",
		"Sports",
		"Supernatural",
		"Thriller",
	]
};
