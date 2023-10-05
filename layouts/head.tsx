import React from "react";
import NextHead from "next/head";
import { siteConfig } from "@/config/site";

export const Head = () => {
	return (
		<NextHead>
			<title>{siteConfig.name}</title>
			<meta key="title" content={siteConfig.name} property="og:title" />
			<meta content={siteConfig.description} property="og:description" />
			<meta content={siteConfig.description} name="description" />
			{/* Flat Icon */}
			<link rel="shortcut icon" href="/animevite.png" />
			<meta
				key="viewport"
				content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
				name="viewport"
			/>
			<meta name="google-site-verification" content="d8Q9bSGyoBL8RSathwiLAJd3qbQhUcl_au7udJd5XZo" />
			<link
				rel="preconnect"
				href={siteConfig.apiUrl}
			/>
			<link
				rel="shortcut icon"
				href="images/logo-no-background.png"
				type="image/svg+xml"
			/>
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="use-credentials" />
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
				rel="stylesheet"
			></link>
			<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5084862153214604"
				crossOrigin="anonymous"></script>
		</NextHead>
	);
};
