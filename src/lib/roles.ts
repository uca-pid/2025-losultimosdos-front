// src/lib/roles.ts
export const UserRole = {
  Admin: "admin",
  Editor: "editor",
  Viewer: "viewer",
} as const;

export const ALL_ROLES = Object.values(UserRole);
