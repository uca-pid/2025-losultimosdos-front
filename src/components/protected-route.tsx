// src/components/ProtectedRoute.tsx
import React, { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { type UserRole } from "../lib/roles";
import { useCurrentUserRole } from "../hooks/use-current-user-role";

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
    return <div>Loading authentication...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to={`/login?redirect_url=${location.pathname}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUserRole!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
