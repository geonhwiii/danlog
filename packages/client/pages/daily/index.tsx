import { GetStaticProps, InferGetStaticPropsType } from 'next';

export default function DailyLayout({}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <div>DailyLayout</div>;
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
