import SEO from '@/components/atomics/SEO';
import MdxHeader from '@/components/organisms/MdxHeader';
import { configs } from '@/config';
import { DocumentTypes } from '@/contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import tw from 'twin.macro';

type Props = Readonly<{
  layout: string;
  content: DocumentTypes;
  [key: string]: unknown;
}>;

type PostArgs = Readonly<{
  title: string;
  description: string;
  images: string[];
  date: Date;
  slug: string;
  type: string;
  tags: string[];
  _raw: {
    flattenedPath: string;
  };
}>;

const MdxLayout = ({ layout, content, ...args }: Props) => {
  const Mdx = useMDXComponent(content.body.code);
  const { title, date, images, description, type, tags, _raw } = args as PostArgs;
  const url = `${configs.meta.url}/${_raw.flattenedPath}`;
  return (
    <div css={tw`max-w-4xl px-4 pt-4 pb-20 mx-auto`}>
      <SEO
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          type,
          url,
          article: {
            publishedTime: new Date(date).toISOString(),
            tags,
          },
          images: [
            {
              url: images[0],
              width: 850,
              height: 650,
              alt: title,
            },
          ],
        }}
      />
      <MdxHeader title={title} images={images} date={date} />
      <Mdx layout={layout} components={{}} {...args} />
    </div>
  );
};

export default MdxLayout;
