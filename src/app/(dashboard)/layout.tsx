import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import DashboardHeader from "./_components/dashboard-header";
import DashboardShell from "./_components/dashboard-shell";

export const metadata: Metadata = {
	title: "Prime Solar | Dashboard",
	description:
		"Get the up to date inormation on solar nergy products, trends and services.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body>
				<DashboardHeader />
				<DashboardShell>{children}</DashboardShell>
			</body>
		</html>
	);
}
