"use client"

import { signOut } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SignOutButton({
  className,
  variant = "ghost",
}: {
  className?: string
  variant?: "ghost" | "default"
}) {
  const router = useRouter()
  

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Button variant={variant} className={className} onClick={handleSignOut}>
      Log Out
    </Button>
  )
}
