// src/hooks/useCurrentUserRole.ts
import { useUser } from "@clerk/clerk-react";

export function useCurrentUserRole(): "admin" | "user" | "medibook" | null {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null; // Or a default role like UserRole.Viewer if appropriate for unauthenticated
  }

  // Ensure publicMetadata.role is typed correctly
  return (user.publicMetadata?.role as "admin" | "user" | "medibook") || null;
}
