import type React from "react";
import { Suspense } from "react";
import "../globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect unauthenticated users to sign-in
  if (!session) {
    redirect("/sign-in");
  }

  // Only allow users with the "admin" role
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          <Suspense fallback={null}>
            <SidebarProvider>
              <AdminSidebar />
              <SidebarInset>
                <AdminHeader />
                <div className="flex-1 p-6">{children}</div>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </Suspense>
        </NuqsAdapter>
      </body>
    </html>
  );
}
