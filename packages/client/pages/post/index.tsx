import { GetStaticProps, InferGetStaticPropsType } from 'next';

export default function PostLayout({}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <div>PostLayout</div>;
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
