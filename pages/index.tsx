import { allDailies, allPosts, Daily, Post } from '@/contentlayer/generated';
import RecentPosts from '@/components/templates/RecentPosts';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import RecentDailies from '@/components/templates/RecentDailies';

export default function Home({ posts, dailies }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Danlog</title>
        <meta name="description" content="danlog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecentPosts posts={posts} />
      <RecentDailies dailies={dailies} />
    </>
  );
}

export const getStaticProps: GetStaticProps<{ posts: Post[]; dailies: Daily[] }> = () => {
  return {
    props: {
      posts: allPosts,
      dailies: allDailies,
    },
  };
};
