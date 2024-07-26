"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

const DashboardLink = ({href, children}:{href:string, children:ReactNode}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // get the active link
  const isActive = href !== '/dashboard' && pathname.startsWith(href);

  return (
			<Link
				href={href}
				className={cn(
					isActive ? "bg-slate-200" : "hover:bg-slate-100",
					"rounded-sm text-slate-800 text-md font-medium my-1 w-[200px] p-2",
					pathname === '/dashboard' && href === '/dashboard'
						? "bg-slate-200"
						: "hover:bg-slate-100",
				)}
				prefetch={false}
			>
				{children}
			</Link>
		);
};
export default DashboardLink;
