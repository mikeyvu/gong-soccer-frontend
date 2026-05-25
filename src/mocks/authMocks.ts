import type { ActiveWorkspaceState, UserProfile } from "@/types";

export const mockWorkspace: ActiveWorkspaceState = {
  memberships: [
    { teamId: 'fc-riverside', teamName: 'FC Riverside', role: 'CAPTAIN' },
  ],
  activeMembership: { teamId: 'fc-riverside', teamName: 'FC Riverside', role: 'CAPTAIN' },
};

export const mockUser: UserProfile = {
  id: 'u-001',
  fullName: 'David Rodriguez',
  email: '',
};
