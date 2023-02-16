import PostCard from '@/components/organisms/PostCard';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

export default function PostLayout({}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
