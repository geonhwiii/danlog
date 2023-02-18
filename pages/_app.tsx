import type { AppProps } from 'next/app';
import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import GlobalStyles from '@/styles/GlobalStyles';
import Layout from '@/components/templates/Layout';

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
