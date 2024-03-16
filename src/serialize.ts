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
import remarkFlexibleMarkers, {
  type FlexibleMarkerOptions,
} from "remark-flexible-markers";
import remarkFlexibleToc, { type TocItem } from "remark-flexible-toc";
import remarkIns from "remark-ins";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings, {
  type Options as AutolinkHeadingsOptions,
} from "rehype-autolink-headings";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
import rehypePreLanguage from "rehype-pre-language";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { type CompileOptions, nodeTypes } from "@mdx-js/mdx";
import { h } from "hastscript";
import { type Compatible } from "vfile";
import { html } from "./lib/rehype-handlers";

import {
  trademarks,
  typographic,
  math,
  breakline,
  horizontalline,
  guillemets,
  orEqual,
} from "./lib/remark-textr-plugins.js";

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
// type Prettify<T> = { [K in keyof T]: T[K] } & {};

// eslint-disable-next-line @typescript-eslint/ban-types
// type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type OpinionatedMdxOptions = Pick<
  CompileOptions,
  "format" | "mdExtensions" | "mdxExtensions" | "baseUrl" | "development"
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
//   jsx?:
// }

export type OpinionatedSerializeOptions = {
  scope?: Record<string, unknown>;
  mdxOptions?: OpinionatedMdxOptions;
  parseFrontmatter?: boolean;
};

export { type MDXRemoteSerializeResult };

/**
 *
 * to console.log the tree as a plugin
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pluginLogTree = () => (tree: object) => {
  console.log(
    JSON.stringify(
      tree,
      function replacer(key, value) {
        if (key === "position") return undefined;
        else return value;
      },
      2,
    ),
  );
};

/**
 *
 * Opinionated serialize wrapper
 *
 */
const serializeWrapper = async <
  TScope = Record<string, unknown>,
  TFrontmatter = Record<string, unknown>,
>(
  source: Compatible,
  {
    scope = {},
    mdxOptions = {},
    parseFrontmatter = false,
  }: OpinionatedSerializeOptions = {},
): Promise<MDXRemoteSerializeResult<TScope, TFrontmatter>> => {
  const toc: TocItem[] = [];
  const format = mdxOptions.format ?? "mdx";

  async function fileToFile(rawfile: string) {
    return pipe<string>(
      breakline,
      horizontalline,
      orEqual,
      guillemets,
    )(rawfile);
  }

  const processedSource =
    format === "mdx" ? await fileToFile(String(source)) : source;

  return await serialize<TScope, TFrontmatter>(
    //@ts-ignore
    processedSource,
    {
      parseFrontmatter,
      scope: { toc, ...scope },
      mdxOptions: {
        ...mdxOptions,
        remarkPlugins: [
          ...(format === "md" ? [remarkFixGuillemets] : []),
          [
            smartypants,
            {
              dashes: "oldschool",
            },
          ],
          [
            remarkFlexibleMarkers,
            { doubleEqualityCheck: "=:=" } as FlexibleMarkerOptions,
          ],
          remarkIns,
          [
            remarkFlexibleToc,
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
              plugins:
                format === "md"
                  ? [orEqual, guillemets, trademarks, typographic, math] // order is matter
                  : [trademarks, typographic, math], // order is matter
            },
          ],
          remarkDefinitionList,
          remarkFlexibleParagraphs,
          remarkSuperSub,
          remarkGemoji,
          [
            remarkEmoji,
            {
              padSpaceAfter: false,
              emoticon: true,
            },
          ],
          [
            remarkFlexibleContainers,
            {
              title: () => null,
              containerTagName: "admonition",
              containerProperties: (type, title) => {
                return {
                  ["data-type"]: type?.toLowerCase(),
                  ["data-title"]: toTitleCase(title) ?? toTitleCase(type),
                };
              },
            } as FlexibleContainerOptions,
          ],
          remarkCodeTitles,
        ],
        rehypePlugins: [
          [rehypeRaw, { passThrough: nodeTypes }], // to allow HTML elements in "md" format, "passThrough" is for "mdx" works as well
          [rehypePreLanguage, "data-language"], // to add "data-language" property to pre elements
          rehypeSlug, // to add ids to headings.
          [
            rehypeAutolinkHeadings,
            {
              behavior: "prepend",
              properties: { className: "anchor-copylink" },
              content: () => [h("icon.copylink")],
            } as AutolinkHeadingsOptions,
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
            // code, // to add language of the code element into pre as className
            ...(format === "md" && { html }),
          },
        },
      },
    },
  );
};

export default serializeWrapper;
