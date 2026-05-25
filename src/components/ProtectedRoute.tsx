import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  const { teamId } = useParams<{ teamId: string }>();

  if (!auth.token) {
    return <Navigate to="/auth" replace />;
  }

  const memberships = auth.workspace?.memberships ?? [];
  const activeTeamId = auth.workspace?.activeMembership.teamId;

  if (teamId && memberships.length > 0 && !memberships.find((m) => m.teamId === teamId)) {
    return <Navigate to={`/${activeTeamId}/dashboard`} replace />;
  }

  return <>{children}</>;
}
