import { getSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignOutButton } from "./sign-out-button"

export async function HeaderAuth({ mobile = false }: { mobile?: boolean }) {
  const session = await getSession()

  if (session) {
    if (mobile) {
      return (
        <SignOutButton
          className="justify-start text-muted-foreground"
          variant="ghost"
        />
      )
    }

    return (
      <SignOutButton
        className="text-muted-foreground hover:text-foreground"
        variant="ghost"
      />
    )
  }

  if (mobile) {
    return (
      <>
        <Button
          variant="ghost"
          className="justify-start text-muted-foreground"
          nativeButton={false}
          render={<Link href="/sign-in" />}
        >
          Sign In
        </Button>
        <Button
          className="bg-primary text-primary-foreground"
          nativeButton={false}
          render={<Link href="/sign-up" />}
        >
          Sign Up
        </Button>
      </>
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground"
        nativeButton={false}
        render={<Link href="/sign-in" />}
      >
        Sign In
      </Button>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        nativeButton={false}
        render={<Link href="/sign-up" />}
      >
        Sign Up
      </Button>
    </>
  )
}
