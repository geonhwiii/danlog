import { DocumentTypes } from '@/contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';

type Props = {
  readonly layout: string;
  readonly content: DocumentTypes;
  readonly [key: string]: unknown;
};

const MdxLayout = ({ layout, content, ...props }: Props) => {
  const Mdx = useMDXComponent(content.body.code);
  return <Mdx layout={layout} components={[]} {...props} />;
};

export default MdxLayout;
