import { ComputedFields, defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismPlus from 'rehype-prism-plus';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import remarkGfm from 'remark-gfm';

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: doc => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
};

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `post/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
  },
  computedFields,
}));

export const Daily = defineDocumentType(() => ({
  name: 'Daily',
  filePathPattern: `daily/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the daily',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the daily',
      required: true,
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Post, Daily],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypePresetMinify, [rehypePrismPlus, { ignoreMissing: true }], rehypeAccessibleEmojis],
  },
});
