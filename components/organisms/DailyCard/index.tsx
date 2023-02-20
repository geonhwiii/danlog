import Typography from '@/components/atomics/Typography';
import { Daily } from '@/contentlayer/generated';
import Image from 'next/image';
import Link from 'next/link';
import tw from 'twin.macro';

type Props = {
  readonly daily: Daily;
};

const DailyCard = ({ daily }: Props) => {
  const { _raw, title, description, images } = daily;
  return (
    <Link href={_raw.flattenedPath} css={tw`relative px-4 cursor-pointer md:w-1/4`}>
      <div>
        <div css={tw`relative overflow-hidden rounded-md aspect-square md:mb-4`}>
          <Image src={images[0]} css={tw`h-full`} width={1000} height={1000} alt="post-cover" priority />
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
            <div>VIEW</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DailyCard;
