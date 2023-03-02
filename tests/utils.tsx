import React from "react";
import ReactDOMServer from "react-dom/server";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote";
import { type VFileCompatible } from "vfile";

import serialize, { type OpinionatedSerializeOptions } from "../src";

export async function renderStatic(
  source: VFileCompatible,
  {
    components,
    scope = {},
    mdxOptions,
    parseFrontmatter,
  }: Partial<
    OpinionatedSerializeOptions & Pick<MDXRemoteProps, "components">
  > = {},
): Promise<string> {
  const mdxSource = await serialize(source, {
    mdxOptions,
    parseFrontmatter,
  });

  return ReactDOMServer.renderToStaticMarkup(
    <MDXRemote {...mdxSource} components={components} scope={scope} />,
  );
}
