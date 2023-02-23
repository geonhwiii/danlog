import Typography from '@/components/atomics/Typography';
import DailyCard, { DailyCardProps } from '@/components/organisms/DailyCard';
import tw from 'twin.macro';

type Props = {
  readonly dailies: DailyCardProps[];
};

const RecentDailies = ({ dailies }: Props) => {
  return (
    <div css={tw`py-4`}>
      <div css={tw`flex items-center justify-between px-4 mb-4`}>
        <Typography css={tw`text-xl font-bold text-black dark:text-white`}>최근 일상</Typography>
      </div>
      <div css={tw`flex flex-wrap`}>
        {dailies.map(daily => (
          <DailyCard key={daily.slug} {...daily} />
        ))}
      </div>
    </div>
  );
};

export default RecentDailies;
