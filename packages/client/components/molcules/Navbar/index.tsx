import tw from 'twin.macro';

const Navbar = () => {
  return (
    <div css={tw`h-[60px]`}>
      <header
        css={tw`fixed top-0 left-0 right-0 border-b border-b-gray-100 dark:border-b-gray-700 h-[60px] bg-white dark:bg-black`}
      >
        <div css={tw`flex items-center justify-between h-full px-4`}>
          <div css={tw`dark:text-white`}>로고</div>
          <div css={tw`dark:text-white`}>메뉴가 들어갈 부분</div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
