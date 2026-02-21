export type FileVisibility = 'public' | 'unlisted';

export interface File {
  id: string;
  name: string;
  owner: string;
  folder: string;
  icon?: string;
  description?: string;
  mime: string;
  size: number;
  checksum: string;
  created: string;
  modified: string;
  visibility: FileVisibility;
}
