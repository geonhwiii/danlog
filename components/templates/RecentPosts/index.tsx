import { Post } from '@/contentlayer/generated';
import Typography from '@/components/atomics/Typography';
import PostCard from '@/components/organisms/PostCard';
import tw from 'twin.macro';

type Props = {
  readonly posts: Post[];
};

const RecentPosts = ({ posts }: Props) => {
  return (
    <div css={tw`py-4`}>
      <div css={tw`flex items-center justify-between px-4 mb-4`}>
        <Typography css={tw`text-xl font-bold text-black dark:text-white`}>최근 포스트</Typography>
      </div>
      <div css={tw`flex flex-wrap`}>
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;
