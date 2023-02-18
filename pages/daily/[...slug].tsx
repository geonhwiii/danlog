import { allDailies, Daily } from '@/contentlayer/generated';
import { InferGetStaticPropsType } from 'next';

export default function DailyLayout({ daily }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <div>{'dailies'}</div>;
}

export const getStaticProps = ({ params }: { params: { slug: string[] } }) => {
  const slug = params.slug.join('/');
  const daily = allDailies.find(daily => daily.slug === slug) as Daily;
  return {
    props: {
      daily,
    },
  };
};

export async function getStaticPaths() {
  return {
    paths: allDailies.map(p => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  };
}
