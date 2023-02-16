import Typography from '@/components/atomics/Typography';
import PostCard from '@/components/organisms/PostCard';
import tw from 'twin.macro';

const RecentPosts = () => {
  return (
    <div css={tw`my-4`}>
      <div css={tw`flex items-center justify-between px-4 mb-4`}>
        <Typography css={tw`text-xl font-bold`}>최근 포스트</Typography>
      </div>
      <div css={tw`flex flex-wrap`}>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </div>
  );
};

export default RecentPosts;
