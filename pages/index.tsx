import { allDailies, allPosts, Daily, Post } from '@/contentlayer/generated';
import RecentPosts from '@/components/templates/RecentPosts';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import RecentDailies from '@/components/templates/RecentDailies';

export default function Home({ posts, dailies }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
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
