import Typography from '@/components/atomics/Typography';
import PostCard, { PostCardProps } from '@/components/organisms/PostCard';
import tw from 'twin.macro';

type Props = {
  readonly posts: PostCardProps[];
};

const RecentPosts = ({ posts }: Props) => {
  return (
    <div css={tw`py-4`}>
      <div css={tw`flex items-center justify-between px-4 mb-4`}>
        <Typography css={tw`text-xl font-bold text-black dark:text-white`}>최근 포스트</Typography>
      </div>
      <div css={tw`flex flex-wrap`}>
        {posts.map(post => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;
