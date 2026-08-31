import type { ReactNode } from "react";
import { useRole } from "@/hooks/useRole";
import type { Role } from "@/types";

interface RoleGateProps {
  minRole: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGate({ minRole, children, fallback = null }: RoleGateProps) {
  const { hasRole } = useRole();
  if (!hasRole(minRole)) return <>{fallback}</>;
  return <>{children}</>;
}
