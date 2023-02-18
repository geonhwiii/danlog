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
  const goPostDetail = () => router.push(post._raw.flattenedPath);
  return (
    <div css={tw`px-4 md:w-1/4`} onClick={goPostDetail}>
      <div>
        <div css={tw`overflow-hidden rounded-md md:mb-4`}>
          <Link href={'#'}>
            <Image src={TempImage} alt="post-cover" />
          </Link>
        </div>
        <div css={tw`flex flex-col items-center text-center`}>
          <Typography css={tw`mb-2 font-bold text-gray-800 dark:text-white`}>
            {'TypeScript 타입 시스템 뜯어보기: 타입 호환성'}
          </Typography>
          <Typography
            css={tw`mb-4 text-sm text-gray-600 dark:text-gray-200 text-ellipsis overflow-hidden [-webkit-line-clamp: 3] [display: -webkit-box] [-webkit-box-orient: vertical] `}
          >
            {
              '타입호환성은 무엇이며 왜 필요할까요? 타입호환이 지원되지 않는 경우가 존재한다는 것을 아셨나요? 평소 익숙했던 개념들에 대해 질문을 던져가며 TypeScript 타입 시스템에 관해 심도있게 알아보고자 합니다. '
            }
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
