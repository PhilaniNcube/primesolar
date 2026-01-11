import type React from "react";
import { Suspense } from "react";
import "../globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
