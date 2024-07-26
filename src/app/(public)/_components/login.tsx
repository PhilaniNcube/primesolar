"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
	return (
		<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[calc(100vh-56px)] bg-slate-700">
			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid w-[350px] gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-3xl font-bold text-white">Login</h1>
						<p className="text-balance text-white">
							Enter your email below to login to your account
						</p>
					</div>
					<form className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email" className="text-white">Email</Label>
							<Input
								id="email"
								type="email"
                name="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password" className="text-white">Password</Label>
								<Link
									href="/forgot-password"
									className="ml-auto text-slate-400 inline-block text-sm underline"
								>
									Forgot your password?
								</Link>
							</div>
							<Input id="password" type="password" name="password" required />
						</div>
						<Button type="submit" className="w-full bg-green-700 text-white">
							Login
						</Button>

					</form>
					<div className="mt-4 text-center text-sm text-white">
						Don&apos;t have an account?{" "}
						<Link href="/sign-up" className="underline">
							Sign up
						</Link>
					</div>
				</div>
			</div>
			<div className="hidden bg-muted lg:block">
				<Image
					src="/images/roof.jpg"
					alt="Image"
					width="1920"
					height="1080"
					className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}
