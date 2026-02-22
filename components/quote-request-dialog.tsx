"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitQuoteRequest } from "@/dal/mutations/quote-request"
import type { QuoteRequestInput } from "@/dal/mutations/types"
import { toast } from "sonner"
import { Loader2, CheckCircle2 } from "lucide-react"
import { sendGTMEvent } from "@next/third-parties/google"

interface QuoteRequestDialogProps {
  /** Trigger element — defaults to a full-width button */
  children?: React.ReactNode
  /** Configuration data needed to persist the quote */
  configData: Omit<QuoteRequestInput, "firstName" | "lastName" | "email" | "phone">
}

export function QuoteRequestDialog({ children, configData }: QuoteRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const input: QuoteRequestInput = {
      ...configData,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || "",
    }

    startTransition(async () => {
      const result = await submitQuoteRequest(input)
      if (result.success) {
        sendGTMEvent({
          event: "quote_request_submitted",
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          phone: input.phone,
        })
        setSubmitted(true)
        toast.success("Quote request submitted! We'll be in touch shortly.")
      } else {
        toast.error(result.error || "Something went wrong. Please try again.")
      }
    })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!isPending) {
      setOpen(nextOpen)
      if (!nextOpen) {
        // Reset state when closing
        setSubmitted(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children ? undefined : <Button className="mt-4 w-full" size="lg" />}>
        {children ?? "Request Detailed Quote"}
      </DialogTrigger>

      <DialogContent className="max-w-xl mx-auto">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <DialogHeader>
              <DialogTitle className="text-base">Quote Request Received!</DialogTitle>
              <DialogDescription>
                Thank you for your interest. One of our certified installers will contact you
                within 24 hours with a detailed quote.
              </DialogDescription>
            </DialogHeader>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-base">Request a Detailed Quote</DialogTitle>
              <DialogDescription>
                Enter your details below and our team will get back to you with a personalised
                quote for your solar installation.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+27 12 345 6789"
                  disabled={isPending}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
