import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { toYmd } from '@lib/markdown';

// Build-time search index: minimal post metadata (title/description/tags),
// emitted as /search-index.json and fetched client-side by the search palette.
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const index = posts.map((post) => ({
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    date: toYmd(post.data.date),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
