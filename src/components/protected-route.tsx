// src/components/ProtectedRoute.tsx
import React, { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { type UserRole } from "../lib/roles";
import { useCurrentUserRole } from "../hooks/use-current-user-role";
import Layout from "./layout";
import { Skeleton } from "./ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: (typeof UserRole)[]; // Optional: if not provided, only authenticated users can access
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded } = useUser();
  const currentUserRole = useCurrentUserRole();
  const location = useLocation();

  const clerkLoaded = authLoaded && userLoaded;

  if (!clerkLoaded) {
    return (
      <Layout>
        {" "}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
            <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
            <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <Skeleton className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </Layout>
    );
  }

  if (!isSignedIn) {
    return <Navigate to={`/login?redirect_url=${location.pathname}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUserRole!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
