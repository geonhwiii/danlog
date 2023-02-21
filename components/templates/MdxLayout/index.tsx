import MdxHeader from '@/components/organisms/MdxHeader';
import { DocumentTypes } from '@/contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import tw from 'twin.macro';

type Props = {
  readonly layout: string;
  readonly content: DocumentTypes;
  readonly [key: string]: unknown;
};

const MdxLayout = ({ layout, content, ...props }: Props) => {
  const Mdx = useMDXComponent(content.body.code);
  const { title, date, images } = props;
  return (
    <div css={tw`max-w-4xl px-4 pt-4 pb-20 mx-auto`}>
      <MdxHeader title={title as string} images={images as string[]} date={date as Date} />
      <Mdx layout={layout} components={{}} {...props} />
    </div>
  );
};

export default MdxLayout;
