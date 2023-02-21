import { DefaultSeoProps } from 'next-seo';

const defaultSeoConfig: DefaultSeoProps = {
  titleTemplate: '%s | danlog.vercel.app',
  defaultTitle: 'Danlog',
  description: '단님의 블로그 | 개발과 일상 그리고 취미',
  canonical: 'https://danlog.vercel.app/',
  additionalLinkTags: [{ rel: 'icon', href: '/favicon.io' }],
  additionalMetaTags: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://danlog.vercel.app',
    siteName: 'Danlog',
    images: [
      {
        url: `https://user-images.githubusercontent.com/44767362/212044505-03e425c3-2849-46ab-94bd-52007e52a015.png`,
        width: 1280,
        height: 720,
        alt: 'danlog-logo',
      },
    ],
  },
  twitter: {
    handle: '@gunw_dan',
    site: '@gunw_dan',
    cardType: 'summary_large_image',
  },
};

export default defaultSeoConfig;
