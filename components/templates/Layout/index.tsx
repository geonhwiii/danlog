import Navbar from '@/components/molcules/Navbar';
import { localFont } from '@/utils/local-font';
import { PropsWithChildren } from 'react';
import { Fira_Mono as FiraMono } from '@next/font/google';
import cx from 'classnames';
import tw from 'twin.macro';

const firaMono = FiraMono({ weight: ['400', '500'], variable: '--font-firamono', subsets: ['latin'] });

type Props = PropsWithChildren & {};

const Layout = ({ children }: Props) => {
  return (
    <div className={cx(localFont.className, firaMono)}>
      <Navbar />
      <main css={tw`min-h-screen dark:bg-black`}>{children}</main>
    </div>
  );
};

export default Layout;
