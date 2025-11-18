import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";

const MedibookLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) return redirect("/sign-in");

  if (user?.publicMetadata.role !== "medibook") return redirect("/");

  return (
    <div className="bg-background h-screen overflow-y-auto">
      <header className="flex flex-col shrink-0 transition-[width,height] ease-linear ">
        <div className="flex h-16 items-center gap-2 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <Badge className="border-transparent bg-gradient-to-r from-blue-500 to-teal-500 [background-size:105%] bg-center text-white text-base">
              Medibook
            </Badge>
            <div className="ml-4">
              <PageBreadcrumb />
            </div>
          </div>
          <div className="flex items-center gap-2 px-4">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto space-y-4 p-4">{children}</main>
      <Toaster />
    </div>
  );
};

export default MedibookLayout;
