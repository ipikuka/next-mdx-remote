import React from "react";
import ReactDOMServer from "react-dom/server";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote";
import { type Compatible } from "vfile";

import { serialize, type SerializeOptions } from "../../src/serialize";

export async function renderStatic(
  source: Compatible,
  {
    components,
    scope = {},
    mdxOptions,
    parseFrontmatter,
  }: Partial<SerializeOptions & Pick<MDXRemoteProps, "components">> = {},
): Promise<string> {
  const mdxSource = await serialize(source, {
    mdxOptions,
    parseFrontmatter,
    scope,
  });

  return ReactDOMServer.renderToStaticMarkup(
    <MDXRemote {...mdxSource} components={components} />,
  );
}
