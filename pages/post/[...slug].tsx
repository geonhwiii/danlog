import { allPosts, Post } from '@/.contentlayer/generated';
import { InferGetStaticPropsType } from 'next';

export default function PostLayout({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(post);
  return <div>{'posts'}</div>;
}

export const getStaticProps = ({ params }: { params: { slug: string[] } }) => {
  const slug = params.slug.join('/');
  const post = allPosts.find(post => post.slug === slug) as Post;
  return {
    props: {
      post: post ?? null,
    },
  };
};

export async function getStaticPaths() {
  return {
    paths: allPosts.map(p => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  };
}
