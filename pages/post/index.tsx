import tw from 'twin.macro';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { allPosts, Post } from '@/contentlayer/generated';
import PostCard from '@/components/organisms/PostCard';

export default function PostHomeLayout({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(posts);
  return (
    <div css={tw`py-4`}>
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
export const getStaticProps: GetStaticProps<{ posts: Post[] }> = () => {
  return {
    props: {
      posts: allPosts,
    },
  };
};
