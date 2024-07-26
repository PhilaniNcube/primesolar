import type { ReactNode } from "react";
import DesktopNavigation from "./_components/desktop-navigation";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Prime Solar",
	description:
		"Get the up to date inormation on solar nergy products, trends and services.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};


const PublicLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className={`${GeistSans.variable}`}>
			<DesktopNavigation />
			{children}
		</main>
	);
};
export default PublicLayout;
