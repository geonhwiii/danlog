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
  return (
    <div css={tw`max-w-5xl p-4 mx-auto`}>
      <Mdx layout={layout} components={[]} {...props} />
    </div>
  );
};

export default MdxLayout;
