import { DefaultSeoProps } from 'next-seo';
import { configs } from '@/config';

const defaultSeoConfig: DefaultSeoProps = {
  titleTemplate: '%s | danlog.vercel.app',
  defaultTitle: configs.meta.title,
  description: configs.meta.description,
  canonical: configs.meta.url,
  additionalLinkTags: [{ rel: 'icon', href: '/favicon.ico' }],
  additionalMetaTags: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'google-site-verification', content: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION! },
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: configs.meta.url,
    siteName: configs.meta.title,
    images: [
      {
        url: configs.meta.image,
        width: 1280,
        height: 720,
        alt: 'danlog-logo',
      },
    ],
  },
  twitter: {
    handle: configs.meta.twitter,
    site: configs.meta.twitter,
    cardType: 'summary_large_image',
  },
};

export default defaultSeoConfig;
