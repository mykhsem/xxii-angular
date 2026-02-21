export type PostStatus = 'draft' | 'published' | 'archived';

export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  feed: string;
  author: string;
  created: string;
  edited?: string;
  published?: string;
  deleted?: string;
  status: PostStatus;
  reactions: Record<string, string[]>;
  pinned: boolean;
  attachments: string[];
}
