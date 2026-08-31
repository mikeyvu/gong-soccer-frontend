import type { Game, GameHistoryEntry } from "@/types";

export const mockNextGame: Game = {
  id: 'game-001',
  title: 'Tuesday Night Football',
  dateTime: '2026-06-03T19:45:00',
  venue: 'Riverside Park Field 2',
  status: 'upcoming',
  participantStatus: 'registered',
  participantSlot: 7,
};

export const mockGameHistory: GameHistoryEntry[] = [
  {
    id: 'h-001',
    title: 'Tuesday Night Football',
    date: '2026-05-27T19:45:00',
    venue: 'Riverside Park Field 2',
    result: 'Won',
  },
  {
    id: 'h-002',
    title: 'Sunday Kickabout',
    date: '2026-05-24T10:00:00',
    venue: 'Central Rec Ground',
    result: 'Draw',
  },
  {
    id: 'h-003',
    title: 'Tuesday Night Football',
    date: '2026-05-20T19:45:00',
    venue: 'Riverside Park Field 2',
    result: 'Lost',
  },
  {
    id: 'h-004',
    title: 'Corporate FC Friendly',
    date: '2026-05-17T15:00:00',
    venue: 'Corporate Sports Hub',
    result: 'Won',
  },
];
