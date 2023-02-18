import { allPosts, Post } from '@/.contentlayer/generated';
import MdxLayout from '@/components/templates/MdxLayout';
import { InferGetStaticPropsType } from 'next';

const DEFAULT_LAYOUT = 'PostLayout';

export default function PostLayout({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <MdxLayout layout={DEFAULT_LAYOUT} content={post} {...post} />
    </div>
  );
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
