import Navbar from '@/components/molcules/Navbar';
import { localFont } from '@/utils/local-font';
import { PropsWithChildren } from 'react';
import tw from 'twin.macro';

type Props = PropsWithChildren & {};

const Layout = ({ children }: Props) => {
  return (
    <div className={localFont.className}>
      <Navbar />
      <main css={tw`min-h-screen dark:bg-black`}>{children}</main>
    </div>
  );
};

export default Layout;
