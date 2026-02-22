"use client"

import { useState, type ReactNode } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export function MobileNav({ authSlot }: { authSlot: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        className="p-2 text-muted-foreground"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {isMenuOpen && (
        <div className="fixed left-0 right-0 top-16 bg-background/95 backdrop-blur-md border-b border-border z-50">
          <nav className="flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {authSlot}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
