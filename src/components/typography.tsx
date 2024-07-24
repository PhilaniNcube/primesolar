import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Heading({children, className}:{children:ReactNode, className?:string}) {
  return <h1 className={cn(className,
    "font-bold text-3xl md:text-4xl lg:text-5xl"
  )}>{children}</h1>;
}

export function SubHeading({children, className}:{children:ReactNode, className?:string}) {
  return <h2 className={cn(className,
    "font-medium text-xl md:text-2xl"
  )}>{children}</h2>;
}
