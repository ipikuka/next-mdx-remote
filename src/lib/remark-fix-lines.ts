import type { Plugin, Transformer } from "unified";
import { visit, type Visitor } from "unist-util-visit";
import { u } from "unist-builder";
import type { HTML, Paragraph } from "mdast";
import type { Node } from "unist";

const isHtmlNode = (node: Node): node is HTML => {
  return "value" in node && node.type === "html";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const visitor: Visitor = (node, index, parent) => {
  if (!isHtmlNode(node)) return;

  const RE = /<hr\s*\/?>/i; // for detect <hr> <hr/> <hr /> <HR> <HR/> <HR /> with the <hr />

  if (!RE.test(node.value)) return;

  const value = node.value;

  // assign the RGEX match part to the nnode
  node.value.replace(RE, "<hr />").slice(0, 6);

  // get the rest of the value
  const nextValue = value.slice(6);

  // compose a paragragraph
  const paragraph = u("paragraph", [u("text", nextValue)]) as Paragraph;

  console.log(paragraph);

  // insert the paragraph into parent.children after the html Node
};

const transformer: Transformer = (tree) => {
  visit(tree, "html", visitor);
};

const plugin: Plugin = (): Transformer => {
  return transformer;
};

export default plugin;
