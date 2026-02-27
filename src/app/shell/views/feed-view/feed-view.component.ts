import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { UiStateService } from '../../../services/ui-state.service';
import type { Author } from '../../../models/author';
import type { Post } from '../../../models/post';

interface PostRow extends Post {
  authorNick: string;
  dateLabel: string;
  snippet: string;
  reactionEntries: { emoji: string; count: number }[];
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

function buildRows(posts: Post[], authors: Author[]): PostRow[] {
  const authorMap = new Map(authors.map((a) => [a.id, a.nick]));
  return posts.map((p) => ({
    ...p,
    authorNick: authorMap.get(p.author) ?? p.author,
    dateLabel: formatDate(p.published ?? p.created),
    snippet: p.content.length > 120 ? p.content.slice(0, 120) + '…' : p.content,
    reactionEntries: Object.entries(p.reactions).map(([emoji, users]) => ({ emoji, count: users.length })),
  }));
}

@Component({
  selector: 'app-feed-view',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="feed-view">
        <!-- Feed header -->
        <div class="feed-view__header">
          <span class="feed-view__icon">{{ vm.feed?.icon ?? '!' }}</span>
          <span class="feed-view__name">{{ vm.feed?.name }}</span>
          @if (vm.feed?.description) {
            <span class="feed-view__sep">|</span>
            <span class="feed-view__desc">{{ vm.feed?.description }}</span>
          }
        </div>

        <!-- Post list -->
        <div class="feed-view__posts">
          @if (vm.posts.length === 0) {
            <p class="feed-view__empty">No posts yet.</p>
          }
          @for (post of vm.posts; track post.id) {
            <div class="feed-view__card">
              <div class="feed-view__card-header">
                <span class="feed-view__card-title">{{ post.title }}</span>
                @if (post.status === 'draft') {
                  <span class="feed-view__draft-badge">[draft]</span>
                }
                @if (post.pinned) {
                  <span class="feed-view__pinned-badge">[pinned]</span>
                }
              </div>
              @if (post.subtitle) {
                <div class="feed-view__card-subtitle">{{ post.subtitle }}</div>
              }
              <div class="feed-view__card-meta">
                <span class="feed-view__card-nick">{{ post.authorNick }}</span>
                <span class="feed-view__card-date">{{ post.dateLabel }}</span>
              </div>
              <div class="feed-view__card-snippet">{{ post.snippet }}</div>
              @if (post.reactionEntries.length > 0) {
                <div class="feed-view__card-reactions">
                  @for (r of post.reactionEntries; track r.emoji) {
                    <span class="feed-view__reaction">{{ r.emoji }} {{ r.count }}</span>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="feed-view__empty-state">Select a feed to start reading.</div>
    }
  `,
  styles: `
    .feed-view {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .feed-view__header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      background-color: var(--color-surface);
      overflow: hidden;
    }

    .feed-view__icon {
      color: var(--color-user-yellow);
      font-weight: 700;
      flex-shrink: 0;
    }

    .feed-view__name {
      font-weight: 700;
      font-size: var(--font-size-header);
      color: var(--color-text-primary);
      flex-shrink: 0;
    }

    .feed-view__sep {
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .feed-view__desc {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .feed-view__posts {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .feed-view__empty {
      color: var(--color-text-muted);
      text-align: center;
      margin-top: var(--space-8);
    }

    .feed-view__empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
    }

    .feed-view__card {
      border: 1px solid var(--color-border);
      background-color: var(--color-surface);
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .feed-view__card:hover {
      border-color: var(--color-border-hover);
    }

    .feed-view__card-header {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .feed-view__card-title {
      font-size: var(--font-size-header);
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .feed-view__draft-badge {
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
    }

    .feed-view__pinned-badge {
      font-size: var(--font-size-small);
      color: var(--color-user-yellow);
    }

    .feed-view__card-subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      font-style: italic;
    }

    .feed-view__card-meta {
      display: flex;
      gap: var(--space-3);
      font-size: var(--font-size-small);
    }

    .feed-view__card-nick {
      color: var(--color-terminal-green);
      font-weight: 500;
    }

    .feed-view__card-date {
      color: var(--color-text-muted);
    }

    .feed-view__card-snippet {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-base);
    }

    .feed-view__card-reactions {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
      margin-top: var(--space-1);
    }

    .feed-view__reaction {
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
      background-color: var(--color-background);
      padding: 0 var(--space-1);
      border: 1px solid var(--color-border);
    }
  `,
})
export class FeedViewComponent {
  private readonly api = inject(ApiService);
  private readonly uiState = inject(UiStateService);

  readonly vm$ = this.uiState.state.pipe(
    map((s) => (s.activeItemType === 'feed' ? s.activeItemId : null)),
    switchMap((feedId) => {
      if (!feedId) {
        return of(null);
      }
      return combineLatest({
        feed: this.api.getFeed(feedId),
        posts: this.api.getPosts(feedId),
        authors: this.api.getAuthors(),
      }).pipe(
        map(({ feed, posts, authors }) => ({
          feed,
          posts: buildRows(posts, authors),
        })),
      );
    }),
  );
}
