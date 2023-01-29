import type { Plugin, Transformer } from "unified";
import { visit, type Visitor } from "unist-util-visit";
import type { HTML } from "mdast";
import type { Node } from "unist";

const isHtmlNode = (node: Node): node is HTML => {
  return "value" in node && node.type === "html";
};

const visitor: Visitor = (node) => {
  if (!isHtmlNode(node)) return;

  const RE = /<br\s*\/?>/giu; // for detect <br> <br/> <br /> <BR> <BR/> <BR /> with the <br />

  if (RE.test(node.value)) {
    node.value.replace(RE, "<br />");
  }
};

const transformer: Transformer = (tree) => {
  visit(tree, "html", visitor);
};

const plugin: Plugin = (): Transformer => {
  return transformer;
};

export default plugin;
