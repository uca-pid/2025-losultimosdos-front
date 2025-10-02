"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { columns as baseColumns } from "@/components/users/columns";
import type { User } from "@/types";
import { Badge } from "@/components/ui/badge";

const useIsMobile = (query = "(max-width: 640px)") => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    onChange(mql);
    mql.addEventListener?.("change", onChange as any);
    return () => mql.removeEventListener?.("change", onChange as any);
  }, [query]);
  return isMobile;
};

interface AdminUserTableProps {
  users: User[];
}

const AdminUserTable = ({ users }: AdminUserTableProps) => {
  const isMobile = useIsMobile();

  const getDisplayName = (u: any) =>
    [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
    u.username ||
    u.email ||
    "Usuario";

  const getFirstName = (u: any) => {
    const f =
      u.firstName ??
      u.given_name ??
      u.givenName ??
      (u.fullName ?? u.name
        ? String(u.fullName ?? u.name).trim().split(/\s+/)[0]
        : undefined);
    return f && String(f).trim() ? String(f).trim() : "-";
  };

  const getLastName = (u: any) => {
    const l = u.lastName ?? u.family_name ?? u.familyName;
    if (l && String(l).trim()) return String(l).trim();
    const src = u.fullName ?? u.name;
    if (src && String(src).trim()) {
      const parts = String(src).trim().split(/\s+/);
      return parts.length > 1 ? parts.slice(1).join(" ") : "-";
    }
    return "-";
  };

  const getEmail = (u: any) => u.email ?? u.emailAddress ?? "-";
  const getRole = (u: any) => u.role ?? u.userRole ?? "-";

  const getCreatedAt = (u: any) =>
    u.createdAt
      ? new Date(u.createdAt).toLocaleDateString("es-AR", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "-";

  return (
    <>
      <div className="hidden sm:block">
        <DataTable
          columns={baseColumns}
          data={users}
          headerClassName="first:w-[80px] first:min-w-[80px] first:justify-center first:items-center"
        />
      </div>

      <div className="sm:hidden space-y-3">
        {users.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No hay usuarios.
              </p>
            </CardContent>
          </Card>
        ) : (
          users.map((u: any) => (
            <Card key={u.id ?? getEmail(u)} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{getDisplayName(u)}</CardTitle>

                <CardAction className="mt-2">
                  {u.id ? (
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href={`/admin/user/${u.id}`} prefetch={false}>
                        Ver
                      </Link>
                    </Button>
                  ) : null}
                </CardAction>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Nombre</div>
                  <div className="text-right text-gray-900 dark:text-gray-100 break-all">
                    {getFirstName(u)}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">Apellido</div>
                  <div className="text-right text-gray-900 dark:text-gray-100 break-all">
                    {getLastName(u)}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">Email</div>
                  <div className="text-right text-gray-900 dark:text-gray-100 break-all">
                    {getEmail(u)}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">Rol</div>
                  <div className="flex justify-end">
                    <Badge
                      variant="outline"
                      className={`${
                        (getRole(u) || "").toLowerCase() === "admin"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {(getRole(u) || "-").replace(/^\w/, (c: string) => c.toUpperCase())}
                    </Badge>
                  </div>
                </div>

                {u.note || u.bio ? (
                  <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 line-clamp-4">
                    {u.note ?? u.bio}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default AdminUserTable;
