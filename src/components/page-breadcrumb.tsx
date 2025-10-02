"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const CLICKABLE_SEGMENTS = ["classes", "exercises", "routines", "users"];

const generateBreadcrumbs = (pathname: string) => {
  // Remove trailing slash
  const path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  // Split path into segments
  const segments = path.split("/").filter(Boolean);

  // Generate breadcrumb items
  return segments.map((segment, index) => {
    // Build the URL for this segment
    const url = `/${segments.slice(0, index + 1).join("/")}`;

    // Clean up the segment name
    const name = segment
      .split("-")
      .map(capitalizeFirstLetter)
      .join(" ")
      .replace(/\[|\]/g, ""); // Remove Next.js dynamic route brackets

    // Check if this segment should be clickable
    const isClickable =
      CLICKABLE_SEGMENTS.includes(segment.toLowerCase()) &&
      !segment.includes("[");

    return {
      name,
      url,
      isLast: index === segments.length - 1,
      isClickable,
    };
  });
};

export function PageBreadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs
          .filter((b) => b.name !== "User" && b.name !== "Admin")
          .map((breadcrumb, index) => (
            <BreadcrumbItem key={breadcrumb.url}>
              {breadcrumb.isLast || !breadcrumb.isClickable ? (
                <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={breadcrumb.url}>{breadcrumb.name}</Link>
                  </BreadcrumbLink>
                </>
              )}
              {!breadcrumb.isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
