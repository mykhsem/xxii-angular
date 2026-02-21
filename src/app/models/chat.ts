export interface Chat {
  id: string;
  name: string;
  owner: string;
  icon?: string;
  description?: string;
  created: string;
  lastActivity: string;
  members: string[];
  admins: string[];
  moderators: string[];
  mute: string[];
  ban: string[];
  pinned: string[];
}
