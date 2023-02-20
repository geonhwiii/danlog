import Typography from '@/components/atomics/Typography';
import Image from 'next/image';
import time from 'dayjs';
import tw from 'twin.macro';

type Props = {
  readonly title: string;
  readonly images: string[];
  readonly date: Date;
};

const MdxHeader = ({ title, images, date }: Props) => {
  return (
    <div css={tw`pt-4 pb-10`}>
      <Image css={tw`w-full mx-auto rounded-md`} src={images[0]} width={600} height={400} alt="head-image" />
      <div css={tw`mt-8 md:mt-10`}>
        <Typography css={tw`text-3xl font-bold text-black md:text-5xl dark:text-white`}>{title}</Typography>
      </div>
      <div css={tw`mt-6 md:mt-8`}>
        <Typography css={tw`text-gray-600 dark:text-gray-400`}>{time(date).format('YYYY-MM-DD')}</Typography>
      </div>
    </div>
  );
};

export default MdxHeader;
