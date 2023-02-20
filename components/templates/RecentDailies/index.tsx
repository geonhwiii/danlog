import { Daily } from '@/contentlayer/generated';
import Typography from '@/components/atomics/Typography';
import tw from 'twin.macro';
import DailyCard from '@/components/organisms/DailyCard';

type Props = {
  readonly dailies: Daily[];
};

const RecentDailies = ({ dailies }: Props) => {
  return (
    <div css={tw`py-4`}>
      <div css={tw`flex items-center justify-between px-4 mb-4`}>
        <Typography css={tw`text-xl font-bold text-black dark:text-white`}>최근 일상</Typography>
      </div>
      <div css={tw`flex flex-wrap`}>
        {dailies.map(daily => (
          <DailyCard key={daily._id} daily={daily} />
        ))}
      </div>
    </div>
  );
};

export default RecentDailies;
