import NavLink from '@/components/atomics/NavLink';
import { Routes } from '@/constants/routes';
import NextImage from 'next/image';
import LightLogo from '@/assets/icons/logo-light.svg';
import DarkLogo from '@/assets/icons/logo-dark.svg';
import tw from 'twin.macro';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const Navbar = () => {
  const { theme, resolvedTheme } = useTheme();
  return (
    <div css={tw`h-[60px]`}>
      <header
        css={tw`fixed top-0 left-0 right-0 border-b border-b-gray-100 dark:border-b-gray-700 h-[60px] z-50 bg-white dark:bg-black`}
      >
        <div css={tw`flex items-center justify-between h-full px-4`}>
          <Link href={Routes.HOME}>
            <div css={tw`relative font-bold w-28 dark:text-white`}>
              <NextImage src={theme === 'dark' || resolvedTheme === 'dark' ? DarkLogo : LightLogo} alt="logo" />
            </div>
          </Link>

          <div css={tw`flex dark:text-white`}>
            <NavLink to={Routes.POST}>개발</NavLink>
            <NavLink to={Routes.DAILY}>일상</NavLink>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
