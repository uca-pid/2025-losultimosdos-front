import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = await auth();
  const user = await currentUser();

  if (!isAuthenticated || user?.publicMetadata.role !== "user")
    return redirect("/");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-2 px-4">
            <ModeToggle />
          </div>
        </header>
        <main className="container mx-auto space-y-4 p-4">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
