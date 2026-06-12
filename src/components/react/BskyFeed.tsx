import { useEffect, useState } from 'react';
import { cn } from '@lib/utils';
import { type BskyPost, getListFeed } from '@lib/bsky';

interface BskyFeedProps {
  /** at://<did>/app.bsky.graph.list/<rkey> */
  listUri: string;
  limit?: number;
  className?: string;
}

const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffSec = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(Math.round(diffSec), 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), 'day');
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function BskyFeed({ listUri, limit = 30, className }: BskyFeedProps) {
  const [posts, setPosts] = useState<BskyPost[]>([]);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus('loading');
    getListFeed(listUri, limit, ctrl.signal)
      .then((feed) => {
        setPosts(feed);
        setStatus('ok');
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        console.error('BskyFeed:', err);
        setStatus('error');
      });
    return () => ctrl.abort();
  }, [listUri, limit]);

  if (status === 'loading') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-hairline bg-surface-card p-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-canvas-soft" />
              <div className="h-3 w-32 rounded bg-canvas-soft" />
            </div>
            <div className="mt-4 h-3 w-full rounded bg-canvas-soft" />
            <div className="mt-2 h-3 w-2/3 rounded bg-canvas-soft" />
          </div>
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={cn('rounded-lg border border-hairline bg-surface-card p-6 text-center', className)}>
        <p className="body-sm text-muted">피드를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {posts.map((post) => (
        <Post key={post.uri} post={post} />
      ))}
    </div>
  );
}

function Post({ post }: { post: BskyPost }) {
  const { author } = post;
  return (
    <article className="rounded-lg border border-hairline bg-surface-card p-5 transition-colors hover:border-hairline-strong">
      {post.repostedBy && (
        <p className="code-type mb-2 flex items-center gap-1.5 text-muted-soft">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {post.repostedBy.displayName ?? post.repostedBy.handle} 님이 리포스트
        </p>
      )}

      <div className="flex items-center gap-3">
        <a href={`https://bsky.app/profile/${author.handle}`} target="_blank" rel="noopener noreferrer">
          {author.avatar ? (
            <img src={author.avatar} alt="" className="size-9 rounded-full object-cover" loading="lazy" />
          ) : (
            <div className="size-9 rounded-full bg-canvas-soft" />
          )}
        </a>
        <div className="min-w-0">
          <a
            href={`https://bsky.app/profile/${author.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="body-sm block truncate font-medium text-body-strong hover:underline"
          >
            {author.displayName ?? author.handle}
          </a>
          <span className="code-type text-muted-soft">@{author.handle}</span>
        </div>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="code-type ml-auto shrink-0 text-muted-soft hover:text-muted"
        >
          {timeAgo(post.createdAt)}
        </a>
      </div>

      {post.text && <p className="body-sm mt-3 whitespace-pre-wrap text-body">{post.text}</p>}

      {post.images.length > 0 && (
        <div className={cn('mt-3 grid gap-2', post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
          {post.images.map((img) => (
            <a key={img.fullsize} href={img.fullsize} target="_blank" rel="noopener noreferrer">
              <img
                src={img.thumb}
                alt={img.alt}
                loading="lazy"
                className="w-full rounded-md border border-hairline object-cover"
              />
            </a>
          ))}
        </div>
      )}

      {post.external && (
        <a
          href={post.external.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block overflow-hidden rounded-md border border-hairline hover:border-hairline-strong"
        >
          {post.external.thumb && (
            <img src={post.external.thumb} alt="" loading="lazy" className="aspect-[1.91/1] w-full object-cover" />
          )}
          <div className="p-3">
            <p className="body-sm line-clamp-1 font-medium text-body-strong">{post.external.title}</p>
            {post.external.description && (
              <p className="caption mt-1 line-clamp-2 text-muted">{post.external.description}</p>
            )}
          </div>
        </a>
      )}

      <div className="code-type mt-4 flex items-center gap-5 text-muted-soft">
        <span>💬 {post.replyCount}</span>
        <span>🔁 {post.repostCount}</span>
        <span>♡ {post.likeCount}</span>
      </div>
    </article>
  );
}
