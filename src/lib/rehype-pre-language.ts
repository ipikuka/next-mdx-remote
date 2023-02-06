import type { Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { hasProperty } from "hast-util-has-property";

/**
 * Plugin to add `data-language` property into the pre elements which have a code element with className "language-*".
 */
const plugin: Plugin<void[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (node.tagName !== "code") return;

    if (parent?.type !== "element") return;

    if (parent.tagName !== "pre") return;

    if (node.properties && hasProperty(node, "className")) {
      const filtered = (node.properties.className as string[]).filter((name) =>
        name.startsWith("language-"),
      );

      if (filtered.length) {
        let language = filtered[0].slice(9);

        if (language.startsWith("diff-")) {
          language = language.slice(5);
        }

        if (parent.properties) {
          parent.properties["data-language"] = language;
        } else {
          parent.properties = { ["data-language"]: language };
        }
      }
    }
  });
};

export default plugin;
