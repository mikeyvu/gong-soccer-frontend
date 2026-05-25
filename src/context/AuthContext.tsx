import { createContext, useContext, useState } from "react";
import type { AuthState, UserProfile, ActiveWorkspaceState } from "@/types";
import { setTokenGetter } from "@/shared/services/api";
import { mockUser, mockWorkspace } from "@/mocks/authMocks";

const TOKEN_KEY = 'gong_token';
const USER_KEY = 'gong_user';
const WORKSPACE_KEY = 'gong_workspace';

interface LoginPayload {
  token: string;
}

interface AuthContextValue {
  auth: AuthState;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  switchTeam: (teamId: string) => void;
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
    };
  });

  // Keep the token getter in sync with current state via closure ref
  setTokenGetter(() => auth.token);

  function login(payload: LoginPayload): void {
    // Backend currently returns token only — enrich with mock profile/workspace
    const user = mockUser;
    const workspace = mockWorkspace;
    const next: AuthState = { token: payload.token, user, workspace };
    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
    setAuth(next);
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(WORKSPACE_KEY);
    setAuth({ token: null, user: null, workspace: null });
  }

  function switchTeam(teamId: string): void {
    if (!auth.workspace) return;
    const found = auth.workspace.memberships.find((m) => m.teamId === teamId);
    if (!found) return;
    const updated: ActiveWorkspaceState = { ...auth.workspace, activeMembership: found };
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(updated));
    setAuth((prev) => ({ ...prev, workspace: updated }));
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, switchTeam }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
