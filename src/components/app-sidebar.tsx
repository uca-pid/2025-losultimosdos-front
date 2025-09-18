import * as React from "react";
import { IconBook } from "@tabler/icons-react";
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
import { useUser } from "@clerk/react-router";
import { useAuth } from "@clerk/clerk-react";
import { Skeleton } from "./ui/skeleton";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Clases",
      url: "/clases",
      icon: IconBook,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { isLoaded } = useAuth();

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
        {isLoaded ? (
          <NavMain items={data.navMain} />
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
        {isLoaded ? (
          <NavUser user={userData} />
        ) : (
          <Skeleton className="h-12 w-full rounded-md" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
