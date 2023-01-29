import { type Plugin } from "unified";
import { type Root } from "mdast";
import { visit } from "unist-util-visit";
import { slug } from "github-slugger";
import { toString } from "mdast-util-to-string";

import { type IHeading } from "types";

const plugin: Plugin<[{ exportRef: IHeading[] }], Root> = (options) => {
  return (tree) =>
    visit(tree, "heading", (node, index, parent) => {
      const textContent = toString(node);
      const parentType = parent?.type;

      options.exportRef.push({
        value: textContent,
        url: `#${slug(textContent)}`,
        depth: node.depth,
        parent: parentType,
      });
    });
};

export default plugin;
