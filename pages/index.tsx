import { allPosts, Post } from '@/contentlayer/generated';
import RecentPosts from '@/components/templates/RecentPosts';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Danlog</title>
        <meta name="description" content="danlog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecentPosts posts={posts} />
    </>
  );
}

export const getStaticProps: GetStaticProps<{ posts: Post[] }> = () => {
  return {
    props: {
      posts: allPosts,
    },
  };
};
