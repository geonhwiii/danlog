import Head from 'next/head';
import { Button } from '@danlog/common';

export default function Home() {
  return (
    <>
      <Head>
        <title>Danlog</title>
        <meta name="description" content="danlog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Button>버튼버튼</Button>
      </main>
    </>
  );
}
