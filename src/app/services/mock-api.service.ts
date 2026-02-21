import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map, retry, catchError, of } from 'rxjs';

import type { Author } from '../models/author';
import type { Chat } from '../models/chat';
import type { Feed } from '../models/feed';
import type { File } from '../models/file';
import type { Folder } from '../models/folder';
import type { Message } from '../models/message';
import type { Node } from '../models/node';
import type { Peer } from '../models/peer';
import type { Post } from '../models/post';
import { ApiService } from './api.service';

interface MockData {
  authors: Author[];
  chats: Chat[];
  feeds: Feed[];
  files: File[];
  folders: Folder[];
  messages: Message[];
  nodes: Node[];
  peers: Peer[];
  posts: Post[];
}

@Injectable()
export class MockApiService extends ApiService {
  private readonly data$: Observable<MockData>;

  constructor(private readonly http: HttpClient) {
    super();
    this.data$ = this.http.get<MockData>('/mock-data.json').pipe(
      retry({ count: 2, delay: 500 }),
      catchError((err) => {
        console.error('MockApiService: failed to load mock-data.json', err);
        return of<MockData>({
          authors: [], chats: [], feeds: [], files: [],
          folders: [], messages: [], nodes: [], peers: [], posts: [],
        });
      }),
      shareReplay(1),
    );
  }

  getAuthors(): Observable<Author[]> {
    return this.data$.pipe(map((d) => d.authors));
  }

  getAuthor(id: string): Observable<Author | undefined> {
    return this.data$.pipe(map((d) => d.authors.find((a) => a.id === id)));
  }

  getChats(): Observable<Chat[]> {
    return this.data$.pipe(map((d) => d.chats));
  }

  getChat(id: string): Observable<Chat | undefined> {
    return this.data$.pipe(map((d) => d.chats.find((c) => c.id === id)));
  }

  getMessages(chatId: string): Observable<Message[]> {
    return this.data$.pipe(map((d) => d.messages.filter((m) => m.chat === chatId)));
  }

  getMessage(id: string): Observable<Message | undefined> {
    return this.data$.pipe(map((d) => d.messages.find((m) => m.id === id)));
  }

  getFeeds(): Observable<Feed[]> {
    return this.data$.pipe(map((d) => d.feeds));
  }

  getFeed(id: string): Observable<Feed | undefined> {
    return this.data$.pipe(map((d) => d.feeds.find((f) => f.id === id)));
  }

  getPosts(feedId: string): Observable<Post[]> {
    return this.data$.pipe(map((d) => d.posts.filter((p) => p.feed === feedId)));
  }

  getPost(id: string): Observable<Post | undefined> {
    return this.data$.pipe(map((d) => d.posts.find((p) => p.id === id)));
  }

  getFolders(): Observable<Folder[]> {
    return this.data$.pipe(map((d) => d.folders));
  }

  getFolder(id: string): Observable<Folder | undefined> {
    return this.data$.pipe(map((d) => d.folders.find((f) => f.id === id)));
  }

  getFiles(folderId: string): Observable<File[]> {
    return this.data$.pipe(map((d) => d.files.filter((f) => f.folder === folderId)));
  }

  getFile(id: string): Observable<File | undefined> {
    return this.data$.pipe(map((d) => d.files.find((f) => f.id === id)));
  }

  getNodes(): Observable<Node[]> {
    return this.data$.pipe(map((d) => d.nodes));
  }

  getPeers(): Observable<Peer[]> {
    return this.data$.pipe(map((d) => d.peers));
  }
}
