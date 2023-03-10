# @ipikuka/next-mdx-remote

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]

This package is an opinionated wrapper (only `serialize` function) for the [next-mdx-remote][next-mdx-remote] package that written by hashicorp.

## When should I use this?

The `@ipikuka/next-mdx-remote` provides a `serialize` function. The `serialize` function is an opinionated wrapper of the `serialize` function of the `next-mdx-remote` which is a set of light utilities allowing MDX to be loaded within `getStaticProps` or `gerServerSideProps` and hydrated correctly on the client.

The **remark plugins** used in the `@ipikuka/next-mdx-remote` are:

- remark-definition-list
- remark-emoji
- remark-fix-guillemets
- remark-flexible-code-titles
- remark-flexible-containers
- remark-flexible-markers
- remark-flexible-paragraphs
- remark-gemoji
- remark-gfm
- remark-ins
- remark-smartypants
- remark-supersub
- remark-textr
- remark-textr-plugins (custom)
- remark-toc-headings (custom)

The **rehype plugins** used in the `@ipikuka/next-mdx-remote` are:

- rehype-autolink-headings
- rehype-prism-plus
- rehype-slug
- rehype-raw
- rehype-pre-language (custom)

## Installation

This package is suitable for ESM module only. In Node.js (16.0+), install with npm:

```bash
npm install next-mdx-remote @ipikuka/next-mdx-remote
```

or

```bash
yarn add next-mdx-remote @ipikuka/next-mdx-remote
```

If you installed the `next-mdx-remote` already, then install only:

```bash
npm install @ipikuka/next-mdx-remote
```

or

```bash
yarn add @ipikuka/next-mdx-remote
```

## Usage

This package is peer dependant with `react`, `react-dom` and `next-mdx-remote` (by hashicorp). So, it is assumed that you have already installed them in your `nextjs` project.

```js
import { MDXRemote } from "next-mdx-remote";
import serialize from "@ipikuka/next-mdx-remote";

import MdxComponents from "../components/mdxcomponents";

const components = { MdxComponents };

export default function TestPage({ source }) {
  return (
    <div className="wrapper">
      <MDXRemote {...source} components={components} />
    </div>
  );
}

export async function getStaticProps() {
  // the source can be from a local file, database, anywhere
  const source = "Some mdx content with a component <Test />";
  const mdxSource = await serialize(source);

  return { props: { source: mdxSource } };
}
```

## Options

The `@ipikuka/next-mdx-remote` **serialize** function accepts the `OpinionatedSerializeOptions` which is similar `SerializeOptions` of the `next-mdx-remote`, _but a little bit opinionated_.

All options are _optional_.

```typescript
export type OpinionatedSerializeOptions = {
  scope?: Record<string, unknown>;
  parseFrontmatter?: boolean;
  mdxOptions?: {
    format?: "mdx" | "md" | "detect";
    jsx?: boolean;
    mdExtensions?: string[];
    mdxExtensions?: string[];
    useDynamicImport?: boolean;
    baseUrl?: string;
  };
};
```

For example, you can specify the source is markdown `md`. (Default is MDX `mdx`).

```js
const source = "Some **bold text** and ==marked text==";
const mdSource = await serialize(source, { mdxOptions: { format: "md" } });
```

Some `mdxOptions` are omitted from the official `mdxOptions` (See https://github.com/hashicorp/next-mdx-remote#apis). This is why the `@ipikuka/next-mdx-remote` is opinionated, providing some pre-selected plugins. The omitted options are:

```typescript
{
  recmaPlugins?: PluggableList | undefined;
  remarkPlugins?: PluggableList | undefined;
  rehypePlugins?: PluggableList | undefined;
  remarkRehypeOptions?: Options | undefined;
  pragma?: string | undefined;
  pragmaFrag?: string | undefined;
  pragmaImportSource?: string | undefined;
  jsxImportSource?: string | undefined;
  jsxRuntime?: "automatic" | "classic" | undefined;
  SourceMapGenerator?: typeof SourceMapGenerator | undefined;
  development?: boolean | undefined;
}
```

If you think that an omitted option is needed, you are wellcome to open an issue.

## Examples:

Need a playground with single page web application. _(PR is wellcome)_

## Types

This package is fully typed with [TypeScript][typeScript]. The `serialize` function of the `@ipikuka/next-mdx-remote` accepts `OpinionatedSerializeOptions` and returns `Promise<MDXRemoteSerializeResult>` as the official `next-mdx-remote` does.

## Compatibility

It is a `Nextjs` compatible package.

## Security

## License

[MIT][license] © ipikuka

### Keywords

[unified][unifiednpm] [remark][remarknpm] [remark-plugin][remarkpluginnpm] [next-mdx-remote][next-mdx-remote]

[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[remarknpm]: https://www.npmjs.com/search?q=keywords:remark
[remarkpluginnpm]: https://www.npmjs.com/search?q=keywords:remark%20plugin
[next-mdx-remote]: https://github.com/hashicorp/next-mdx-remote
[typescript]: https://www.typescriptlang.org/
[license]: https://github.com/ipikuka/
[npm-url]: https://www.npmjs.com/package/next-mdx-remote
[npm-image]: https://img.shields.io/npm/v/next-mdx-remote
[github-license]: https://img.shields.io/github/license/ipikuka/next-mdx-remote
[github-license-url]: https://github.com/ipikuka/next-mdx-remote/blob/master/LICENSE
[github-build]: https://github.com/ipikuka/next-mdx-remote/actions/workflows/publish.yml/badge.svg
[github-build-url]: https://github.com/ipikuka/next-mdx-remote/actions/workflows/publish.yml
[npm-typescript]: https://img.shields.io/npm/types/next-mdx-remote
