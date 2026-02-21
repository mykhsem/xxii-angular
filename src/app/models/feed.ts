import { Message } from "./message";

export type FeedVisibility = 'public' | 'private' | 'unlisted';
export type FeedJoinPolicy = 'open' | 'invite' | 'request';

export interface Feed {
  id: string;
  name: string;
  owner: string;
  icon?: string;
  description?: string;
  created: string;
  visibility: FeedVisibility;
  joinPolicy: FeedJoinPolicy;
  // NOTE: xxii-schema defines pinned as { many: 'Message' }, likely a schema
  // bug — feeds pin Posts, not Messages. Mapped as Post IDs here intentionally.
  pinned: Message[];
}
