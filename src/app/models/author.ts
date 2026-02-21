export type AuthorStatus = 'online' | 'away' | 'dnd' | 'offline' | 'unknown';

export interface Author {
  id: string;
  nick: string;
  name: string;
  bio: string;
  icon: string;
  photo?: string;
  status: AuthorStatus;
  created: string;
  updated: string;
  settings: Record<string, unknown>;
  nodes: string[];
}
