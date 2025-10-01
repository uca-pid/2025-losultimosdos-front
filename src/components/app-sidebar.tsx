import * as React from "react";
import { IconBook, IconHome, IconUsers } from "@tabler/icons-react";
import { Dumbbell } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { currentUser } from "@clerk/nextjs/server";
import { Skeleton } from "./ui/skeleton";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  const data = {
    user: {
      name: user?.fullName || "",
      email: user?.emailAddresses[0].emailAddress || "",
      avatar: user?.imageUrl || "",
    },
    navMain: [
      {
        title: "Clases",
        url: "/" + user?.publicMetadata?.role + "/classes",
        icon: IconBook,
        roles: ["admin", "user"],
      },
      {
        title: "Usuarios",
        url: "/" + user?.publicMetadata?.role + "/users",
        icon: IconUsers,
        roles: ["admin"],
      },
    ],
  };

  const userData = {
    name: user?.fullName || "",
    email: user?.emailAddresses[0].emailAddress || "",
    avatar: user?.imageUrl || "",
  };
  return (
    <Sidebar variant="inset" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Dumbbell />
                <span className="text-base font-semibold">GymCloud</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {user ? (
          <NavMain
            items={data.navMain.filter((item) =>
              item.roles.includes(user.publicMetadata.role as string)
            )}
          />
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={userData} />
        ) : (
          <Skeleton className="h-12 w-full rounded-md" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
