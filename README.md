# do not install yet the `@ipikuka/next-mdx-remote`, it is in alpha stage (you will be able to install it when it is beta)

# @ipikuka/next-mdx-remote

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]

This package is an opinionated wrapper (only `serialize` function) for the [next-mdx-remote][next-mdx-remote] package that written by hashicorp.

## When should I use this?

The `@ipikuka/next-mdx-remote` provides you a `serialize` function. The `serialize` function is an opinionated wrapper of the `serialize` function of the `next-mdx-remote` (by hashicorp).

The remark plugins that the `@ipikuka/next-mdx-remote` uses are:

- remark-breaks (disabled for now)
- remark-definition-list
- remark-emoji
- remark-fix-guillemets
- remark-flexible-code-titles
- remark-flexible-containers
- remark-gemoji
- remark-gfm
- remark-smartypants
- remark-supersub
- remark-textr
- remark-fix-breaks (custom)
- remark-textr-plugins (custom)
- remark-toc-headings (custom)

The rehype plugins that the `@ipikuka/next-mdx-remote` uses are:

- rehype-autolink-headings
- rehype-prism-plus
- rehype-slug
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
  // MDX text - can be from a local file, database, anywhere
  const source = "Some **mdx** text, with a component <Test />";
  const mdxSource = await serialize(source);

  return { props: { source: mdxSource } };
}
```

## Options

The `@ipikuka/next-mdx-remote` is opinionated as I said, so it is **not** going to be planned to provide an option.

## Examples:

Need a playground with single page web application. (a PR is wellcome :))

## Types

This package is fully typed with [TypeScript][typeScript]. The `serialize` function of the `@ipikuka/next-mdx-remote` returns `Promise<MDXRemoteSerializeResult>` as the official `next-mdx-remote` do.

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
