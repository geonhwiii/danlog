import Navbar from '@/components/molcules/Navbar';
import { PropsWithChildren } from 'react';
import tw from 'twin.macro';

type Props = PropsWithChildren & {};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      <main css={tw`min-h-screen dark:bg-black`}>{children}</main>
    </div>
  );
};

export default Layout;
