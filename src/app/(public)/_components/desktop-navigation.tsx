import { logoutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/utils/queries/users";
import { SunIcon } from "lucide-react";
import Link from "next/link";


const DesktopNavigation = async () => {

  const user = await currentUser();

  return (
			<header className="hidden md:flex items-center w-full py-2">
				<div className="container px-6 lg:px-0 flex items-center justify-between">
					<Link
						href="/"
						className="font-semibold text-lg uppercase flex items-center"
					>
						<SunIcon className="mr-2" />
						Prime Solar
					</Link>
					<nav className="flex items-center gap-x-6 text-slate-700">
						<Link href="/batteries" className="font-semibold">
							Solar Batteries
						</Link>
						<Link href="/panels" className="font-semibold">
							Solar Panels
						</Link>
						<Link href="/inverters" className="font-semibold">
							Inverters
						</Link>
						<Link href="/systems" className="font-semibold">
							Complete Systems
						</Link>
						{user === null ? (
							<>
								<Link href="/login" className="font-semibold">
									<Button variant="outline" size="sm">
										Login
									</Button>
								</Link>
								<Link href="/sign-up" className="font-semibold">
									<Button variant="secondary" size="sm">
										Sign Up
									</Button>
								</Link>
							</>
						) : (
							<>
								<form action={logoutAction}>
									<Button variant="destructive" size="sm">
										Logout
									</Button>
								</form>
							</>
						)}
					</nav>
				</div>
			</header>
		);
};
export default DesktopNavigation;
