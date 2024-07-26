"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/utils/validation/auth";
import type { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useFormState } from "react-dom";
import { loginAction } from "@/actions/auth-actions";
import { useTransition } from "react";
import { toast } from "sonner";

const initialState = {
	errors: {
		email: [],
		password: [],
	},
	user: undefined,
};

export function Login() {
	const [state, formAction] = useFormState(loginAction, initialState);
	const [pending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
		reValidateMode: "onSubmit",
	});

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
					<Form {...form}>
						<form
							className="grid gap-4"
							action={(formData: FormData) => {
								startTransition(() => {
									formAction(formData);
									toast("Logging in...");
								});
							}}
						>
							<div className="grid gap-2">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Link
										href="/forgot-password"
										className="ml-auto text-slate-400 inline-block text-sm underline"
									>
										Forgot your password?
									</Link>
								</div>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input type="password" placeholder="" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button
								aria-disabled={pending}
                disabled={pending}
								type="submit"
								className="w-full bg-green-700 text-white"
							>
								{pending ? "Please wait..." : "Login"}
							</Button>
						</form>
					</Form>
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
