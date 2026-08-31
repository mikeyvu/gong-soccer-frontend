import { useAuth } from "@/context/AuthContext";
import { hasRole as checkRole } from "@/lib/rbac";
import type { Role } from "@/types";

interface UseRoleResult {
  role: Role | undefined;
  hasRole: (minRole: Role) => boolean;
  isCaptain: boolean;
}

export function useRole(): UseRoleResult {
  const { auth } = useAuth();
  const role = auth.workspace?.activeMembership.role;
  return {
    role,
    hasRole: (minRole: Role) => checkRole(role, minRole),
    isCaptain: role === "CAPTAIN",
  };
}
