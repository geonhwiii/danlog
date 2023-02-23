import Typography from '@/components/atomics/Typography';
import { Routes } from '@/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import tw from 'twin.macro';

export type DailyCardProps = {
  readonly slug: string;
  readonly title: string;
  readonly images: string[];
  readonly description: string;
};

const DailyCard = ({ title, slug, description, images }: DailyCardProps) => {
  return (
    <Link href={`${Routes.DAILY}/${slug}`} css={tw`relative px-4 cursor-pointer md:w-1/4`} prefetch={false}>
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
