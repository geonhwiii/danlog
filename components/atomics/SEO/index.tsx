import { NextSeo, NextSeoProps } from 'next-seo';

type Props = NextSeoProps;

const SEO = ({ title, description, ...props }: Props) => {
  return <NextSeo title={title} description={description} {...props} />;
};

export default SEO;
