import { allDailies, allPosts } from '@/contentlayer/generated';
import RecentPosts from '@/components/templates/RecentPosts';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import RecentDailies from '@/components/templates/RecentDailies';
import { formatDailyToDailyCard, formatPostToPostCard } from '@/utils/format';
import { PostCardProps } from '@/components/organisms/PostCard';
import { DailyCardProps } from '@/components/organisms/DailyCard';

export default function Home({ posts, dailies }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <RecentPosts posts={posts} />
      <RecentDailies dailies={dailies} />
    </>
  );
}

export const getStaticProps: GetStaticProps<{ posts: PostCardProps[]; dailies: DailyCardProps[] }> = () => {
  const posts = formatPostToPostCard(allPosts);
  const dailies = formatDailyToDailyCard(allDailies);
  return {
    props: {
      posts,
      dailies,
    },
  };
};
