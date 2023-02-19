// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePresetMinify from "rehype-preset-minify";
import rehypePrismPlus from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, "")
  }
};
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `post/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true
    }
  },
  computedFields
}));
var Daily = defineDocumentType(() => ({
  name: "Daily",
  filePathPattern: `daily/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the daily",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the daily",
      required: true
    }
  },
  computedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "data",
  documentTypes: [Post, Daily],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePresetMinify, [rehypePrismPlus, { ignoreMissing: true }]]
  }
});
export {
  Daily,
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-IP7LJF72.mjs.map
