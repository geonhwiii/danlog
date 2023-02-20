import MdxLayout from '@/components/templates/MdxLayout';
import { allDailies, Daily } from '@/contentlayer/generated';
import { InferGetStaticPropsType } from 'next';

const DEFAULT_LAYOUT = 'DailyLayout';

export default function DailyLayout({ daily }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <MdxLayout layout={DEFAULT_LAYOUT} content={daily} {...daily} />;
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
