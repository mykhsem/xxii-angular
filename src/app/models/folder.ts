export type FolderVisibility = 'public' | 'unlisted';

export interface Folder {
  id: string;
  name: string;
  owner: string;
  parent?: string;
  icon?: string;
  description?: string;
  visibility: FolderVisibility;
}
