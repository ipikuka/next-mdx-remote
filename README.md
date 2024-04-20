# @ipikuka/next-mdx-remote

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]

This package is an opinionated wrapper of the [next-mdx-remote][next-mdx-remote].

## When should I use this?

The `@ipikuka/next-mdx-remote` provides a `serialize` function. The `serialize` function is an opinionated wrapper of the `serialize` function of the `next-mdx-remote` which is a set of light utilities allowing MDX to be loaded within `getStaticProps` or `gerServerSideProps` and hydrated correctly on the client.

The **plugins** used in the `@ipikuka/next-mdx-remote` comes from [**`@ipikuka/plugins`**](https://github.com/ipikuka/plugins/).

**`@ipikuka/plugins`** provides **`remarkPlugins`**, **`rehypePlugins`**, **`recmaPlugins`**, and **`remarkRehypeOptions`**.

Thanks to `@ipikuka/plugins`, the markdown/mdx content will support **table of contents**, **containers**, **markers**, **aligned paragraphs**, **gfm syntax** (tables, strikethrough, task lists, autolinks etc.), **inserted texts**, **highlighted code fences**, **code titles**, **autolink for headers**, **definition lists** etc. in addition to standard markdown syntax like **bold texts**, **italic texts**, **lists**, **blockquotes**, **headings** etc.

For other `mdxOptions` see https://github.com/hashicorp/next-mdx-remote#apis.

## Installation

This package is suitable for ESM module only. In Node.js (16.0+), install with npm:

```bash
npm install @ipikuka/next-mdx-remote
```

or

```bash
yarn add @ipikuka/next-mdx-remote
```

## Usage

This package is peer dependant with `react`, `react-dom`; so it is assumed that you have already installed.

```js
import { MDXRemote } from "@ipikuka/next-mdx-remote";
import { serialize } from "@ipikuka/next-mdx-remote/serialize";

import * as components from "../components/mdxcomponents";

export default function TestPage({ mdxSource }) {
  return (
    <div className="mdx-wrapper">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}

export async function getStaticProps() {
  // the source can be from a local file, database, anywhere
  const source = "Some mdx content with a component <Test />";
  const mdxSource = await serialize(source);

  return { props: { mdxSource } };
}
```

## Options

The `@ipikuka/next-mdx-remote` **serialize** function accepts the same options with `next-mdx-remote`.

All options are _optional_.

```typescript
type SerializeOptions = {
  /**
   * Pass-through variables for use in the MDX content
   */
  scope?: Record<string, unknown>;
  /**
   * These options are passed to the MDX compiler.
   * See [the MDX docs.](https://github.com/mdx-js/mdx/blob/master/packages/mdx/index.js).
   */
  mdxOptions?: Omit<CompileOptions, "outputFormat" | "providerImportSource"> & {
    useDynamicImport?: boolean;
  };
  /**
   * Indicate whether or not frontmatter should be parsed out of the MDX. Defaults to false
   */
  parseFrontmatter?: boolean;
};
```

For example, you can specify the source is markdown `md`. (Default is MDX `mdx`).

```js
const source = "Some **bold text** and ==marked text==";
const mdSource = await serialize(source, { mdxOptions: { format: "md" } });
```

## Examples:

Need a playground with single page web application. _(PR is wellcome)_

## Types

This package is fully typed with [TypeScript][typeScript] and exposes the types as the official `next-mdx-remote` does.

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
[npm-url]: https://www.npmjs.com/package/@ipikuka/next-mdx-remote
[npm-image]: https://img.shields.io/npm/v/@ipikuka/next-mdx-remote
[github-license]: https://img.shields.io/github/license/ipikuka/next-mdx-remote
[github-license-url]: https://github.com/ipikuka/next-mdx-remote/blob/master/LICENSE
[github-build]: https://github.com/ipikuka/next-mdx-remote/actions/workflows/publish.yml/badge.svg
[github-build-url]: https://github.com/ipikuka/next-mdx-remote/actions/workflows/publish.yml
[npm-typescript]: https://img.shields.io/npm/types/next-mdx-remote
