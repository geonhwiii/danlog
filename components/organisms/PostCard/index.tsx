import Image from 'next/image';
import Link from 'next/link';
import TempImage from '@/assets/images/temp.png';
import tw from 'twin.macro';
import Typography from '@/components/atomics/Typography';
import { Routes } from '@/constants/routes';
import { Post } from '@/.contentlayer/generated';
import { useRouter } from 'next/router';

type Props = {
  readonly post: Post;
};

const PostCard = ({ post }: Props) => {
  const router = useRouter();
  const { _raw, title, images, description } = post;
  const goPostDetail = () => router.push(_raw.flattenedPath);
  return (
    <div css={tw`relative px-4 md:w-1/4`} onClick={goPostDetail}>
      <div>
        <div css={tw`relative overflow-hidden rounded-md md:mb-4`}>
          <Link href={'#'}>
            <Image src={images[0]} width={1000} height={1000} alt="post-cover" priority />
          </Link>
        </div>
        <div css={tw`flex flex-col items-center text-center`}>
          <Typography css={tw`mb-2 font-bold text-gray-800 dark:text-white`}>{title}</Typography>
          <Typography
            css={tw`mb-4 text-sm text-gray-600 dark:text-gray-200 text-ellipsis overflow-hidden [-webkit-line-clamp: 3] [display: -webkit-box] [-webkit-box-orient: vertical] `}
          >
            {description}
          </Typography>
          <div
            css={tw`px-2 py-1 text-[13px] font-extrabold text-gray-400 border border-gray-300 rounded-md dark:text-gray-200`}
          >
            <Link href={Routes.POST}>Read More</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
