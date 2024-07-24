import type { ReactNode } from "react";
import DesktopNavigation from "./_components/desktop-navigation";

const PublicLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main>
			<DesktopNavigation />
			{children}
		</main>
	);
};
export default PublicLayout;
