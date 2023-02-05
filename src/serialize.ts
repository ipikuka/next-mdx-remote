import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkEmoji from "remark-emoji";
import remarkTextr from "remark-textr";
import remarkSuperSub from "remark-supersub";
// import remarkBreaks from "remark-breaks";
import smartypants from "remark-smartypants";
import remarkCodeTitles from "remark-flexible-code-titles";
import remarkFixGuillemets from "remark-fix-guillemets";
// import remarkFlexibleContainers, {
//   type FlexibleContainerOptions,
// } from "remark-flexible-containers";
import {
  remarkDefinitionList,
  defListHastHandlers,
} from "remark-definition-list";
import { paragraphCustomAlerts } from "@hashicorp/remark-plugins";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings, { type Options } from "rehype-autolink-headings";
import rehypePrismPlus from "rehype-prism-plus";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote/dist/types";
import { h } from "hastscript";
import { type VFileCompatible } from "vfile";

// import { toTitleCase } from "./util";

import {
  rare,
  scoped,
  guillemets,
  breakline,
  horizontalline,
} from "./lib/remark-textr-plugins";
import remarkFixBreaks from "./lib/remark-fix-breaks";
import rehypePreLanguage from "./lib/rehype-pre-language";
import remarkTocHeadings from "./lib/remark-toc-headings";
import { type IHeading } from "./types";
import { type Root } from "mdast";

const serializeWrapper = async (
  rawfile: VFileCompatible,
): Promise<MDXRemoteSerializeResult> => {
  const toc: IHeading[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function markdownToMarkdown(rawf: string) {
    const file = await unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter, ["yaml", "toml"])
      .use(remarkFixGuillemets)
      .use(remarkTextr, {
        plugins: [guillemets],
      })
      .use(remarkFixBreaks)
      .use(() => (tree: Root) => {
        console.dir(tree);
      })
      .process(rawf);

    return file;
  }

  const pipe =
    <T>(...fns: ((param: T) => T)[]) =>
    (x: T) =>
      fns.reduce((v, f) => f(v), x);

  async function fileToFile(rawf: string) {
    return pipe<string>(breakline, horizontalline, guillemets)(rawf);
  }

  // const processedRawFile = await markdownToMarkdown(rawfile);
  const processedRawFile = await fileToFile(String(rawfile));

  return await serialize(processedRawFile, {
    parseFrontmatter: true,
    scope: { toc },
    mdxOptions: {
      format: "mdx",
      remarkPlugins: [
        [
          smartypants,
          {
            dashes: "oldschool",
          },
        ],
        [
          remarkTocHeadings,
          {
            exportRef: toc,
          },
        ],
        [
          remarkGfm, // Github Flavored Markup
          {
            singleTilde: false,
          },
        ],
        [
          remarkTextr,
          {
            plugins: [scoped, rare],
          },
        ],
        // remarkBreaks, // each "enter" becomes <br>
        remarkDefinitionList,
        remarkSuperSub,
        // [
        //   remarkFlexibleContainers,
        //   {
        //     title: null,
        //     containerTagName: "admonition",
        //     containerProperties: (type, title) => {
        //       return {
        //         ["data-type"]: type?.toLowerCase(),
        //         ["data-title"]: toTitleCase(title),
        //       };
        //     },
        //   } as FlexibleContainerOptions,
        // ],
        paragraphCustomAlerts,
        remarkGemoji,
        [
          remarkEmoji,
          {
            padSpaceAfter: false,
            emoticon: true,
          },
        ],
        remarkCodeTitles,
      ],
      rehypePlugins: [
        rehypePreLanguage, // to add "data-language" property to pre elements.
        rehypeSlug, // to add ids to headings.
        [
          rehypeAutolinkHeadings,
          {
            behavior: "prepend",
            properties: { className: "anchor-copylink" },
            content: () => [h("icon.copylink")],
          } as Options,
        ], // to add links to headings with ids back to themselves.
        [
          rehypePrismPlus,
          {
            ignoreMissing: true,
          },
        ],
      ],
      remarkRehypeOptions: {
        handlers: {
          // any other handlers
          ...defListHastHandlers,
        },
      },
    },
  });
};

export default serializeWrapper;
