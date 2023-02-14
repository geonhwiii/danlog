import { PropsWithChildren } from 'react';
import tw from 'twin.macro';

type Props = PropsWithChildren & {};

const Layout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default Layout;
