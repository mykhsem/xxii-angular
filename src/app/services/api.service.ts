import { Observable } from 'rxjs';

import type { Author } from '../models/author';
import type { Chat } from '../models/chat';
import type { Feed } from '../models/feed';
import type { File } from '../models/file';
import type { Folder } from '../models/folder';
import type { Message } from '../models/message';
import type { Node } from '../models/node';
import type { Peer } from '../models/peer';
import type { Post } from '../models/post';

export abstract class ApiService {
  abstract getAuthors(): Observable<Author[]>;
  abstract getAuthor(id: string): Observable<Author | undefined>;

  abstract getChats(): Observable<Chat[]>;
  abstract getChat(id: string): Observable<Chat | undefined>;

  abstract getMessages(chatId: string): Observable<Message[]>;
  abstract getMessage(id: string): Observable<Message | undefined>;

  abstract getFeeds(): Observable<Feed[]>;
  abstract getFeed(id: string): Observable<Feed | undefined>;

  abstract getPosts(feedId: string): Observable<Post[]>;
  abstract getPost(id: string): Observable<Post | undefined>;

  abstract getFolders(): Observable<Folder[]>;
  abstract getFolder(id: string): Observable<Folder | undefined>;

  abstract getFiles(folderId: string): Observable<File[]>;
  abstract getFile(id: string): Observable<File | undefined>;

  abstract getNodes(): Observable<Node[]>;
  abstract getPeers(): Observable<Peer[]>;
}
