// src/lib/roles.ts
export const UserRole = {
  Admin: "admin",
  User: "user",
} as const;

export const ALL_ROLES = Object.values(UserRole);
