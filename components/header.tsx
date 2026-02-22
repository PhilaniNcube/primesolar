import { Suspense } from "react"
import { Sun } from "lucide-react"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { HeaderAuth } from "@/components/header-auth"
import { HeaderAuthFallback } from "@/components/header-auth-fallback"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sun className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PrimeSolar</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Suspense fallback={<HeaderAuthFallback />}>
              <HeaderAuth />
            </Suspense>
          </div>

          <MobileNav
            authSlot={
              <Suspense fallback={<HeaderAuthFallback mobile />}>
                <HeaderAuth mobile />
              </Suspense>
            }
          />
        </div>
      </div>
    </header>
  )
}
