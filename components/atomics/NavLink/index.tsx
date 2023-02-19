import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { forwardRef } from 'react';
import { UrlObject } from 'url';
import tw from 'twin.macro';

export type LinkProps = PropsWithChildren & {
  readonly to?: string | UrlObject;
};

const NavLink = forwardRef<HTMLAnchorElement, LinkProps>(({ children, to = '#' }, ref) => {
  return (
    <div css={tw`px-2`}>
      <Link ref={ref} href={to} css={tw`font-bold hover:text-blue-600`}>
        {children}
      </Link>
    </div>
  );
});

export default NavLink;

NavLink.displayName = 'NavLink';
