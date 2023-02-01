import React from "react";
import ReactDOMServer from "react-dom/server";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote";
import { type VFileCompatible } from "vfile";

import serialize from "../src";

export async function renderStatic(
  mdx: VFileCompatible,
  {
    components,
    scope,
  }: {
    components?: MDXRemoteProps["components"];
    scope?: Record<string, unknown>;
  } = {},
): Promise<string> {
  const mdxSource = await serialize(mdx);

  return ReactDOMServer.renderToStaticMarkup(
    <MDXRemote {...mdxSource} components={components} scope={scope} />,
  );
}
