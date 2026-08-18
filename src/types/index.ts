export type Role = 'CAPTAIN' | 'PLAYER' | 'SPECTATOR';

export interface TeamMembership {
  teamId: string;
  teamName: string;
  role: Role;
  logoUrl?: string;
}

export interface ActiveWorkspaceState {
  memberships: TeamMembership[];
  activeMembership: TeamMembership;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  workspace: ActiveWorkspaceState | null;
  hasProfile: boolean;
}

export interface LoginResponse {
  token: string;
  hasProfile: boolean;
  user: UserProfile | null;
  memberships: TeamMembership[];
}

export type GameStatus = 'upcoming' | 'past' | 'cancelled';
export type ParticipantStatus = 'waitingList' | 'registered' | 'cancelled';

export interface Game {
  id: string;
  title: string;
  dateTime: string;
  venue: string;
  status: GameStatus;
  participantStatus: ParticipantStatus;
  participantSlot?: number;
}

export interface FinanceBalance {
  amount: number;
  currency: string;
  description: string;
}

export interface GameHistoryEntry {
  id: string;
  title: string;
  date: string;
  venue: string;
  result: string;
}
