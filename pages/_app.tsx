import type { AppProps } from 'next/app';
import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import Layout from '@/components/templates/Layout';
import GlobalStyles from '@/styles/GlobalStyles';
import '@/styles/prism.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={cache}>
      <Layout>
        <GlobalStyles />
        <Component {...pageProps} />
      </Layout>
    </CacheProvider>
  );
}
