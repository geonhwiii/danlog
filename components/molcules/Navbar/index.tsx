import NavLink from '@/components/atomics/NavLink';
import { Routes } from '@/constants/routes';
import Image from 'next/image';
import tw from 'twin.macro';

const Navbar = () => {
  return (
    <div css={tw`h-[60px]`}>
      <header
        css={tw`fixed top-0 left-0 right-0 border-b border-b-gray-100 dark:border-b-gray-700 h-[60px] bg-white dark:bg-black`}
      >
        <div css={tw`flex items-center justify-between h-full px-4`}>
          <NavLink to={Routes.HOME}>
            <div css={tw`relative w-20 h-6 font-bold dark:text-white`}>
              <Image src={'/logo.png'} fill alt="logo" />
            </div>
          </NavLink>

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
