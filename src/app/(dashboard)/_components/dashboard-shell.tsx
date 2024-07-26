import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReactNode } from "react";
import DashboardLink from "./dashboard-link";

const DashboardShell = ({ children }: { children: ReactNode }) => {
	return (
		<section className="grid grid-cols-[250px_1fr] h-[calc(100vh-50px)]">
			<aside className="border-r-2 p-2 h-full flex flex-col">
        <DashboardLink href="/dashboard">Dashboard</DashboardLink>
        <DashboardLink href="/dashboard/estimates">Solar Estimates</DashboardLink>
        <DashboardLink href="/dashboard/panels">Solar Panels</DashboardLink>
        <DashboardLink href="/dashboard/batteries">Solar Batteries</DashboardLink>
        <DashboardLink href="/dashboard/inverters">Inverters</DashboardLink>
      </aside>
			<main className="h-full">
        <ScrollArea className="w-full p-2 h-full">
          {children}
        </ScrollArea>
      </main>
		</section>
	);
};
export default DashboardShell;


