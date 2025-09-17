// src/hooks/useCurrentUserRole.ts
import { useUser } from "@clerk/clerk-react";
import { type UserRole } from "../lib/roles";

export function useCurrentUserRole(): typeof UserRole | null {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null; // Or a default role like UserRole.Viewer if appropriate for unauthenticated
  }

  // Ensure publicMetadata.role is typed correctly
  return (user.publicMetadata?.role as typeof UserRole) || null;
}
