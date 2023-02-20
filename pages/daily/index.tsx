import { allDailies, Daily } from '@/contentlayer/generated';
import DailyCard from '@/components/organisms/DailyCard';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import tw from 'twin.macro';

export default function DailyLayout({ dailies }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div css={tw`py-4`}>
      {dailies.map(daily => (
        <DailyCard key={daily._id} daily={daily} />
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<{ dailies: Daily[] }> = () => {
  return {
    props: {
      dailies: allDailies,
    },
  };
};
