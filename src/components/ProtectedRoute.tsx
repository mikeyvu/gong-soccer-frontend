import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasRole } from "@/lib/rbac";
import type { Role } from "@/types";

interface Props {
  children: React.ReactNode;
  requireProfile?: boolean;
  minRole?: Role;
}

export default function ProtectedRoute({ children, requireProfile = true, minRole }: Props) {
  const { auth } = useAuth();
  const { teamId } = useParams<{ teamId: string }>();

  if (!auth.token) {
    return <Navigate to="/auth" replace />;
  }

  if (requireProfile && !auth.hasProfile) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (!requireProfile && auth.hasProfile) {
    const activeTeamId = auth.workspace?.activeMembership.teamId ?? "";
    return <Navigate to={`/${activeTeamId}/dashboard`} replace />;
  }

  const memberships = auth.workspace?.memberships ?? [];
  const activeTeamId = auth.workspace?.activeMembership.teamId;

  if (teamId && memberships.length > 0 && !memberships.find((m) => m.teamId === teamId)) {
    return <Navigate to={`/${activeTeamId}/dashboard`} replace />;
  }

  if (minRole && !hasRole(auth.workspace?.activeMembership.role, minRole)) {
    return <Navigate to={`/${activeTeamId}/dashboard`} replace />;
  }

  return <>{children}</>;
}
