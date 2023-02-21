import type { AppProps } from 'next/app';
import Layout from '@/components/templates/Layout';
import GlobalStyles from '@/styles/GlobalStyles';
import { DefaultSeo } from 'next-seo';
import defaultSeoConfig from '@/next-seo.config';
import '@/styles/prism.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <DefaultSeo {...defaultSeoConfig} />
      <GlobalStyles />
      <Component {...pageProps} />
    </Layout>
  );
}
