import type { Role } from "@/types";

export const ROLE_RANK: Record<Role, number> = {
  SPECTATOR: 0,
  PLAYER: 1,
  CAPTAIN: 2,
};

export function hasRole(currentRole: Role | null | undefined, minRole: Role): boolean {
  if (!currentRole) return false;
  return ROLE_RANK[currentRole] >= ROLE_RANK[minRole];
}
