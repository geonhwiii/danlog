import DailyCard from '@/components/organisms/DailyCard';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

export default function DailyLayout({}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <DailyCard />
      <DailyCard />
      <DailyCard />
      <DailyCard />
      <DailyCard />
    </div>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
