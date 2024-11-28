"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,

} from "@/components/ui/card";
import { sendEmailAction } from "@/actions/email-action";
import { useFormState } from "react-dom";

export default function ContactForm() {

  const [state, formAction] = useFormState(sendEmailAction, null);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Fill out the form below to get in touch with us if you would like a more accurate quote.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="first_name"
              required
              aria-describedby="firstName-error"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="last_name"
              required
              aria-describedby="lastName-error"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              aria-describedby="email-error"
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
          {state && (
            <div
              className={`${
                state.status === 200
                  ? "bg-green-100 text-green-900"
                  : "bg-red-100 text-red-900"
              } p-4 rounded-md`}
            >
              {state.message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
