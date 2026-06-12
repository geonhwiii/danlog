/**
 * Bluesky(AT Protocol) 공개 AppView 클라이언트.
 *
 * 인증/토큰 불필요 — `public.api.bsky.app`는 공개 데이터에 한해
 * 누구나, CORS 허용 상태로 호출할 수 있습니다.
 * 여러 메인테이너를 묶으려면 bsky.app에서 List를 하나 만들고
 * 그 List의 AT-URI를 getListFeed에 넘기면 됩니다.
 *
 * List AT-URI 찾는 법:
 *   1) bsky.app에서 리스트를 연다 → URL이
 *      https://bsky.app/profile/<handle>/lists/<rkey> 형태
 *   2) AT-URI는 at://<did>/app.bsky.graph.list/<rkey>
 *      - <handle>의 did는 resolveHandle()로 얻을 수 있음(아래 헬퍼).
 */

const APPVIEW = 'https://public.api.bsky.app/xrpc';

export interface BskyAuthor {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
}

export interface BskyImage {
  thumb: string;
  fullsize: string;
  alt: string;
}

export interface BskyExternal {
  uri: string;
  title: string;
  description: string;
  thumb?: string;
}

export interface BskyPost {
  /** at:// URI */
  uri: string;
  cid: string;
  author: BskyAuthor;
  text: string;
  createdAt: string;
  replyCount: number;
  repostCount: number;
  likeCount: number;
  images: BskyImage[];
  external?: BskyExternal;
  /** 리포스트인 경우, 리포스트한 사람 */
  repostedBy?: BskyAuthor;
  /** bsky.app 웹 퍼머링크 */
  url: string;
}

interface RawFeedItem {
  post: {
    uri: string;
    cid: string;
    author: BskyAuthor;
    record: { text?: string; createdAt?: string };
    embed?: {
      $type: string;
      images?: { thumb: string; fullsize: string; alt: string }[];
      external?: { uri: string; title: string; description: string; thumb?: string };
    };
    replyCount?: number;
    repostCount?: number;
    likeCount?: number;
    indexedAt?: string;
  };
  reason?: {
    $type: string;
    by?: BskyAuthor;
  };
}

interface FeedResponse {
  feed: RawFeedItem[];
  cursor?: string;
}

/** at:// URI를 bsky.app 웹 링크로 변환 */
function postUrl(uri: string, handle: string): string {
  const rkey = uri.split('/').pop() ?? '';
  return `https://bsky.app/profile/${handle}/post/${rkey}`;
}

function normalize(item: RawFeedItem): BskyPost {
  const { post, reason } = item;
  const embed = post.embed;

  // 이미지 임베드($type: app.bsky.embed.images#view 또는 recordWithMedia)
  const images: BskyImage[] =
    embed?.images?.map((i) => ({
      thumb: i.thumb,
      fullsize: i.fullsize,
      alt: i.alt ?? '',
    })) ?? [];

  const external: BskyExternal | undefined = embed?.external
    ? {
        uri: embed.external.uri,
        title: embed.external.title,
        description: embed.external.description,
        thumb: embed.external.thumb,
      }
    : undefined;

  const repostedBy = reason?.$type?.includes('reasonRepost') ? reason.by : undefined;

  return {
    uri: post.uri,
    cid: post.cid,
    author: post.author,
    text: post.record.text ?? '',
    createdAt: post.record.createdAt ?? post.indexedAt ?? '',
    replyCount: post.replyCount ?? 0,
    repostCount: post.repostCount ?? 0,
    likeCount: post.likeCount ?? 0,
    images,
    external,
    repostedBy,
    url: postUrl(post.uri, post.author.handle),
  };
}

/** handle → did 변환 (List AT-URI를 손으로 만들 때 사용) */
export async function resolveHandle(handle: string): Promise<string> {
  const url = `${APPVIEW}/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`resolveHandle ${handle} failed: ${res.status}`);
  const data = (await res.json()) as { did: string };
  return data.did;
}

/**
 * List의 피드를 시간순으로 가져온다.
 * @param listUri at://<did>/app.bsky.graph.list/<rkey>
 */
export async function getListFeed(listUri: string, limit = 30, signal?: AbortSignal): Promise<BskyPost[]> {
  const url = `${APPVIEW}/app.bsky.feed.getListFeed?list=${encodeURIComponent(listUri)}&limit=${limit}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`getListFeed failed: ${res.status}`);
  const data = (await res.json()) as FeedResponse;
  return data.feed.map(normalize);
}

/** 단일 계정 피드 (List 안 쓸 때) */
export async function getAuthorFeed(actor: string, limit = 20, signal?: AbortSignal): Promise<BskyPost[]> {
  const url = `${APPVIEW}/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(actor)}&limit=${limit}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`getAuthorFeed failed: ${res.status}`);
  const data = (await res.json()) as FeedResponse;
  return data.feed.map(normalize);
}
