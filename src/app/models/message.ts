export interface Message {
  id: string;
  chat: string;
  author: string;
  content: string;
  created: string;
  edited?: string;
  deleted?: string;
  replyTo?: string;
  forwarded?: string;
  reactions: Record<string, string[]>;
  pinned: boolean;
  attachments: string[];
}
