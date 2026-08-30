import { createContext, useContext, useState } from "react";
import type { AuthState, UserProfile, ActiveWorkspaceState, LoginResponse, ApiTeamMembership, TeamMembership, Role } from "@/types";
import { setTokenGetter } from "@/shared/services/api";

function toTeamMembership(membership: ApiTeamMembership): TeamMembership {
  return {
    teamId: String(membership.team.id),
    teamName: membership.team.name,
    role: membership.role.replace(/^ROLE_/, "") as Role,
  };
}

const TOKEN_KEY = 'gong_token';
const USER_KEY = 'gong_user';
const WORKSPACE_KEY = 'gong_workspace';
const HAS_PROFILE_KEY = 'gong_has_profile';

interface AuthContextValue {
  auth: AuthState;
  login: (payload: LoginResponse) => AuthState;
  logout: () => void;
  switchTeam: (teamId: string) => void;
  setProfileComplete: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    const rawWorkspace = localStorage.getItem(WORKSPACE_KEY);
    return {
      token,
      user: rawUser ? (JSON.parse(rawUser) as UserProfile) : null,
      workspace: rawWorkspace ? (JSON.parse(rawWorkspace) as ActiveWorkspaceState) : null,
      hasProfile: localStorage.getItem(HAS_PROFILE_KEY) === 'true',
    };
  });

  // Keep the token getter in sync with current state via closure ref
  setTokenGetter(() => auth.token);

  function login(payload: LoginResponse): AuthState {
    // Fall back to cached profile/workspace info if the backend omits
    // hasProfile/user/memberships on a given response.
    const hasProfile = payload.hasProfile ?? true;
    const user = payload.user !== undefined ? payload.user : auth.user;
    const workspace: ActiveWorkspaceState | null =
      payload.memberships && payload.memberships.length > 0
        ? (() => {
            const memberships = payload.memberships!.map(toTeamMembership);
            return { memberships, activeMembership: memberships[0] };
          })()
        : auth.workspace;

    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(HAS_PROFILE_KEY, String(hasProfile));
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (workspace) localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));

    const nextAuth: AuthState = { token: payload.token, user, workspace, hasProfile };
    setAuth(nextAuth);
    return nextAuth;
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(WORKSPACE_KEY);
    localStorage.removeItem(HAS_PROFILE_KEY);
    setAuth({ token: null, user: null, workspace: null, hasProfile: false });
  }

  function switchTeam(teamId: string): void {
    if (!auth.workspace) return;
    const found = auth.workspace.memberships.find((m) => m.teamId === teamId);
    if (!found) return;
    const updated: ActiveWorkspaceState = { ...auth.workspace, activeMembership: found };
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(updated));
    setAuth((prev) => ({ ...prev, workspace: updated }));
  }

  function setProfileComplete(user: UserProfile): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(HAS_PROFILE_KEY, 'true');
    setAuth((prev) => ({ ...prev, user, hasProfile: true }));
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, switchTeam, setProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
