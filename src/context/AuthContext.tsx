import { createContext, useContext, useState } from "react";
import type { AuthState, UserProfile, ActiveWorkspaceState, LoginResponse } from "@/types";
import { setTokenGetter } from "@/shared/services/api";

const TOKEN_KEY = 'gong_token';
const USER_KEY = 'gong_user';
const WORKSPACE_KEY = 'gong_workspace';
const HAS_PROFILE_KEY = 'gong_has_profile';

interface AuthContextValue {
  auth: AuthState;
  login: (payload: LoginResponse) => void;
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

  function login(payload: LoginResponse): void {
    const workspace: ActiveWorkspaceState | null = payload.memberships.length > 0
      ? { memberships: payload.memberships, activeMembership: payload.memberships[0] }
      : null;

    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(HAS_PROFILE_KEY, String(payload.hasProfile));
    if (payload.user) localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    if (workspace) localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));

    setAuth({ token: payload.token, user: payload.user, workspace, hasProfile: payload.hasProfile });
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
