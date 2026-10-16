export type Role = 'CAPTAIN' | 'PLAYER' | 'SPECTATOR';

export interface TeamMembership {
  teamId: string;
  teamName: string;
  role: Role;
  logoUrl?: string;
}

// Shape actually returned by the backend for each membership entry.
export interface ApiTeamMembership {
  team: { id: number; name: string };
  role: string;
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
  hasProfile?: boolean;
  user?: UserProfile | null;
  memberships?: ApiTeamMembership[];
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

// Shape returned by GET /api/user/balance
export interface UserBalance {
  userId: number;
  balance: number;
}

// Shape expected from GET /api/captain/team/fund-balance (planned, not built on the backend yet)
export interface TeamFundBalance {
  teamId: number;
  fundBalance: number;
}

// Shape expected from GET /api/captain/team/players (planned, not built on the backend yet)
export interface TeamPlayer {
  userId: number;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  balance: number;
}

export type TopUpStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Shape returned by POST/GET /api/user/top-ups
export interface TopUpRequest {
  id: number;
  amount: number;
  status: TopUpStatus;
  createdAt: string;
}

// Shape returned by GET /api/captain/top-ups and POST /api/captain/top-ups/{id}/approve|reject
export interface CaptainTopUpRequest {
  id: number;
  userId: number;
  userEmail: string;
  amount: number;
  status: TopUpStatus;
  createdAt: string;
  reviewedAt: string | null;
}

// Paginated list shape returned by the backend (zero-based page)
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface GameHistoryEntry {
  id: string;
  title: string;
  date: string;
  venue: string;
  result: string;
}
