import { ConfigStoreProvider } from "@/providers/solar-config-provider";
import "../styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Prime Solar",
  description:
    "Get the up to date information on solar nergy products, trends and services.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["solar", "energy", "renewable", "power", "electricity"],
  verification: {
    google: "MBVeZ9Tt4smHxsJKEh7w0J5eAWqCG7kw2lqxNYkB-qM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ConfigStoreProvider>{children}</ConfigStoreProvider>
      </body>
      <Toaster />
    </html>
  );
}
