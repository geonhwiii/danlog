import { Global } from '@emotion/react';
import tw, { css, GlobalStyles as TwinStyles } from 'twin.macro';

const customStyles = css({
  ['*']: {
    ...tw`box-border p-0 m-0`,
  },
  ['html,body']: {
    ...tw`max-w-full overflow-x-hidden font-sans`,
  },
  html: {
    ...tw`dark:[color-scheme: dark] text-gray-50 dark:text-black`,
  },
  body: {
    ...tw`antialiased`,
  },
  a: {
    ...tw`no-underline text-inherit`,
  },
  h1: {
    ...tw`font-bold [letter-spacing:-0.025em] md:text-5xl text-4xl [line-height: 1.25] [word-break: keep-all] break-words`,
  },
  h2: {
    ...tw`mt-4 mb-1 text-xl font-semibold md:text-2xl [line-height: 1.4] [margin-block-start: 0.83rem] [margin-block-end: 0.83rem] [margin-inline-start: 0] [margin-inline-end: 0]`,
  },
  p: {
    ...tw`mx-0 my-4 [margin-block-start: 1rem] [margin-block-end: 1rem] [margin-inline-start: 0px] [margin-inline-end: 0px] text-base md:[font-size: 18px] [line-height: 1.7] [word-break: keep-all] break-words`,
  },
  li: {
    wordBreak: 'break-all',
  },
  ['ol li::marker']: {
    ...tw`font-semibold text-gray-500`,
  },
  ['ul li::marker']: {
    ...tw`bg-gray-500`,
  },
  strong: {
    ...tw`font-bold text-gray-600`,
  },
  pre: {
    ...tw`overflow-x-auto font-firamono rounded-xl`,
  },
  hr: {
    ...tw`my-8 border-none w-full h-[1px] bg-gray-200 dark:bg-gray-700`,
  },
  blockquote: {
    ...tw`py-2 pl-4 pr-6 my-4 text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-800 [border-top-right-radius: 4px] [border-bottom-right-radius: 4px] border-l-4 border-l-blue-400 dark:border-l-blue-600`,
  },
  code: {
    ...tw`text-blue-600 bg-gray-100 dark:text-blue-400 dark:bg-gray-800 px-1 py-0.5 mr-0.5 rounded-sm break-all before:content-none after:content-none`,
  },
  ['::-webkit-scrollbar']: {
    ...tw`w-3 bg-gray-300 dark:bg-gray-700`,
  },
  ['::-webkit-scrollbar-thumb']: {
    ...tw`[background-clip: padding-box] [border: 2px solid transparent] bg-gray-500 dark:bg-gray-300 rounded-lg`,
  },
  ['p > img']: {
    ...tw`block h-auto max-w-full mx-auto my-12`,
  },
  'code::before': {
    content: 'none',
  },
  'code::after': {
    content: 'none',
  },
  ['.code-highlight']: {
    // ...tw`float-left min-w-full`,
  },
  ['.code-line']: {
    ...tw`block px-4 -mx-4 border-l-4 border-transparent`,
  },
  ['.code-line.inserted']: {
    ...tw`[background-color: rgba(16,185,129,0.2)]`,
  },
  ['.code-line.deleted']: {
    ...tw`[background-color: rgba(239,68,68,0.2)]`,
  },
  ['.highlight-line']: {
    ...tw`-mx-4 border-l-4 [background-color: rgba(55,65,81,0.5)] [border-left-color: rgb(59,130,246)] 
    before:inline-block before:w-4 before:text-left before:mr-4 before:-ml-2 before:[color: rgb(156,163,175)] [content: attr(line)]`,
  },
  ['.line-number::before']: {
    ...tw`inline-block [content: attr(line)] mr-4 -ml-2 w-4 text-right text-gray-400`,
  },
});

const GlobalStyles = () => (
  <>
    <TwinStyles />
    <Global styles={customStyles} />
  </>
);

export default GlobalStyles;
