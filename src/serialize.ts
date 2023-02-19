import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkEmoji from "remark-emoji";
import remarkTextr from "remark-textr";
import remarkSuperSub from "remark-supersub";
import smartypants from "remark-smartypants";
import remarkCodeTitles from "remark-flexible-code-titles";
import remarkFixGuillemets from "remark-fix-guillemets";
import remarkFlexibleContainers, {
  type FlexibleContainerOptions,
} from "remark-flexible-containers";
import {
  remarkDefinitionList,
  defListHastHandlers,
} from "remark-definition-list";
import remarkFlexibleParagraphs from "remark-flexible-paragraphs";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings, { type Options } from "rehype-autolink-headings";
import rehypePrismPlus from "rehype-prism-plus";
import { serialize } from "next-mdx-remote/serialize";
import type {
  MDXRemoteSerializeResult,
  SerializeOptions,
} from "next-mdx-remote/dist/types";
import { h } from "hastscript";
import { type VFileCompatible } from "vfile";
import { type Root } from "mdast";

import {
  rare,
  scoped,
  guillemets,
  breakline,
  horizontalline,
} from "./lib/remark-textr-plugins.js";
import remarkFixBreaks from "./lib/remark-fix-breaks.js";
import rehypePreLanguage from "./lib/rehype-pre-language.js";
import remarkTocHeadings from "./lib/remark-toc-headings.js";

type HeadingTocItem = {
  value: string;
  url: string;
  depth: number;
  parent?: string;
  level?: number[];
};

/**
 * Returns the Title Case of a given string
 * https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
function toTitleCase(str: string | undefined) {
  if (!str) return;

  return str.replace(/\b\w+('\w{1})?/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

/**
 * Constructs a pipe function
 */
const pipe =
  <T>(...fns: ((param: T) => T)[]) =>
  (x: T) =>
    fns.reduce((v, f) => f(v), x);

// eslint-disable-next-line @typescript-eslint/ban-types
type Prettify<T> = { [K in keyof T]: T[K] } & {};

type OpinionatedMdxOptions = Pick<
  // eslint-disable-next-line @typescript-eslint/ban-types
  SerializeOptions["mdxOptions"] & {},
  | "format"
  | "mdExtensions"
  | "mdxExtensions"
  | "jsx"
  | "useDynamicImport"
  | "baseUrl"
>;

// excluded mdxOptions --> {
//   recmaPlugins?: PluggableList | undefined;
//   remarkPlugins?: PluggableList | undefined;
//   rehypePlugins?: PluggableList | undefined;
//   remarkRehypeOptions?: Options | undefined;
//   pragma?: string | undefined;
//   pragmaFrag?: string | undefined;
//   pragmaImportSource?: string | undefined;
//   jsxImportSource?: string | undefined;
//   jsxRuntime?: "automatic" | "classic" | undefined;
//   SourceMapGenerator?: typeof SourceMapGenerator | undefined;
//   development?: boolean | undefined;
// }

export type OpinionatedSerializeOptions = Prettify<
  Pick<SerializeOptions, "scope" | "parseFrontmatter"> & {
    mdxOptions?: Prettify<OpinionatedMdxOptions>;
  }
>;

export { type MDXRemoteSerializeResult };

/**
 * Opinionated serialize wrapper
 *
 */
const serializeWrapper = async (
  source: VFileCompatible,
  {
    scope = {},
    mdxOptions = {},
    parseFrontmatter = false,
  }: OpinionatedSerializeOptions = {},
  rsc = false,
): Promise<MDXRemoteSerializeResult> => {
  const toc: HeadingTocItem[] = [];

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

  async function fileToFile(rawfile: string) {
    return pipe<string>(breakline, horizontalline, guillemets)(rawfile);
  }

  // const processedSource = await markdownToMarkdown(source);
  const processedSource = await fileToFile(String(source));

  return await serialize(
    processedSource,
    {
      parseFrontmatter,
      scope: { toc, ...scope },
      mdxOptions: {
        ...mdxOptions,
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
          [
            remarkFlexibleContainers,
            {
              title: null,
              containerTagName: "admonition",
              containerProperties: (type, title) => {
                return {
                  ["data-type"]: type?.toLowerCase(),
                  ["data-title"]: toTitleCase(title),
                };
              },
            } as FlexibleContainerOptions,
          ],
          remarkFlexibleParagraphs,
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
            ...defListHastHandlers,
          },
        },
      },
    },
    rsc,
  );
};

export default serializeWrapper;
