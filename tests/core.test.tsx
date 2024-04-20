import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { MDXRemote } from "next-mdx-remote";
import { MDXProvider } from "@mdx-js/react";
import { VFile } from "vfile";
import dedent from "dedent";

import { serialize } from "../src/serialize";

import { renderStatic } from "./utils";

/**
 *
 * I used the same tests with `next-mdx-remote` in order to provide the same "serialize" functionality
 *
 */

describe("serialize", () => {
  // ******************************************
  test("minimal", async () => {
    const result = await renderStatic("foo **bar**");
    expect(result).toMatchInlineSnapshot(`"<p>foo <strong>bar</strong></p>"`);
  });

  // ******************************************
  test("with component", async () => {
    const result = await renderStatic('foo <Test name="test" />', {
      components: {
        Test: ({ name }: { name: string }) => <span>hello {name}</span>,
      },
    });
    expect(result).toMatchInlineSnapshot(
      `"<p>foo <span>hello test</span></p>"`,
    );
  });

  // ******************************************
  test("flexible paragraphs", async () => {
    const result = await renderStatic("~> hello");
    expect(result).toMatchInlineSnapshot(
      `"<p class="flexible-paragraph">hello</p>"`,
    );
  });

  // ******************************************
  test("with scope", async () => {
    const result = await renderStatic("<Test name={bar} />", {
      components: {
        Test: ({ name }: { name: string }) => <p>{name}</p>,
      },
      scope: {
        bar: "test",
      },
    });
    expect(result).toMatchInlineSnapshot(`"<p>test</p>"`);
  });

  // ******************************************
  test("with custom provider", async () => {
    const TestContext = React.createContext<null | string>(null);

    const mdxSource = await serialize("<Test />");

    const result = ReactDOMServer.renderToStaticMarkup(
      <TestContext.Provider value="provider-value">
        <MDXRemote
          {...mdxSource}
          components={{
            Test: () => (
              <TestContext.Consumer>
                {(value) => <p>{value}</p>}
              </TestContext.Consumer>
            ),
          }}
        />
      </TestContext.Provider>,
    );

    expect(result).toMatchInlineSnapshot(`"<p>provider-value</p>"`);
  });

  // ******************************************
  test("with MDXProvider providing custom components", async () => {
    const mdxSource = await serialize("<Test />");

    const result = ReactDOMServer.renderToStaticMarkup(
      <MDXProvider
        components={{
          Test: () => <p>Hello world</p>,
        }}
      >
        <MDXRemote {...mdxSource} />
      </MDXProvider>,
    );

    expect(result).toMatchInlineSnapshot(`"<p>Hello world</p>"`);
  });

  // ******************************************
  test("supports component names with a .", async () => {
    const mdxSource = await serialize("<motion.p />");

    const result = ReactDOMServer.renderToStaticMarkup(
      <MDXRemote
        {...mdxSource}
        components={{
          motion: { p: () => <p>Hello world</p> },
        }}
      />,
    );

    expect(result).toMatchInlineSnapshot(`"<p>Hello world</p>"`);
  });

  // ******************************************
  test("strips imports & exports", async () => {
    const input = dedent(`
      import foo from 'bar';

      foo **bar**
      
      export const bar = 'bar';
    `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(`"<p>foo <strong>bar</strong></p>"`);
  });

  // ******************************************
  test("fragments", async () => {
    const components = {
      Test: ({ content }: { content: string }) => <>{content}</>,
    };

    const result = await renderStatic(
      `<Test content={<>Rendering a fragment</>} />`,
      { components },
    );
    expect(result).toMatchInlineSnapshot(`"Rendering a fragment"`);
  });

  // ******************************************
  test("parses frontmatter - serialize result 1", async () => {
    const input = dedent(`
      ---
      hello: world
      ---
      # Hello
    `);

    const result = await serialize(input, {
      parseFrontmatter: true,
    });

    // Validating type correctness here, this should not error
    expect(<MDXRemote {...result} />).toBeTruthy();

    expect(result.frontmatter.hello).toEqual("world");
  });

  // ******************************************
  test("parses frontmatter - serialize result 2", async () => {
    const input = dedent(`
      ---
      tags:
        - javascript
        - html
      ---
      # Tags
    `);

    const result = await serialize(input, {
      parseFrontmatter: true,
    });

    // Validating type correctness here, this should not error
    expect(<MDXRemote {...result} />).toBeTruthy();

    expect(result.frontmatter.tags).toEqual(["javascript", "html"]);
  });

  test("parses frontmatter - serialize result - with type", async () => {
    type Frontmatter = {
      hello: string;
    };

    const input = dedent(`
      ---
      hello: world
      ---
      # Hello
    `);

    const result = await serialize<Record<string, unknown>, Frontmatter>(
      input,
      {
        parseFrontmatter: true,
      },
    );

    // Validating type correctness here, this should not error
    expect(<MDXRemote {...result} />).toBeTruthy();

    expect(result.frontmatter.hello).toEqual("world");
  });

  // ******************************************
  test("parses frontmatter - rendered result", async () => {
    const input = dedent(`
      ---
      hello: world
      ---
      Hi {frontmatter.hello}
    `);

    const result = await renderStatic(input, {
      parseFrontmatter: true,
    });

    expect(result).toMatchInlineSnapshot(`"<p>Hi world</p>"`);
  });

  // ******************************************
  test("prints helpful message from compile error", async () => {
    try {
      await serialize("This is very bad <GITHUB_USER>");
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`
        [Error: [next-mdx-remote] error compiling MDX:
        Expected a closing tag for \`<GITHUB_USER>\` (1:18-1:31) before the end of \`paragraph\`
        
        > 1 | This is very bad <GITHUB_USER>
            |                  ^
        
        More information: https://mdxjs.com/docs/troubleshooting-mdx]
      `);
    }
  });

  // ******************************************
  test("supports VFile", async () => {
    const result = await renderStatic(new VFile("foo **bar**"));
    expect(result).toMatchInlineSnapshot(`"<p>foo <strong>bar</strong></p>"`);
  });

  // ******************************************
  test("supports Buffer", async () => {
    const result = await renderStatic(Buffer.from("foo **bar**"));
    expect(result).toMatchInlineSnapshot(`"<p>foo <strong>bar</strong></p>"`);
  });

  // ******************************************
  test("infers the type of the frontmatter", async () => {
    const input = dedent(`
      ---
      title: The Title
      ---
      # Hello
    `);

    type Frontmatter = {
      title: string;
    };

    const { frontmatter } = await serialize<
      Record<string, unknown>,
      Frontmatter
    >(input, {
      parseFrontmatter: true,
    });

    expect(frontmatter).toHaveProperty("title");
    expect(frontmatter).toEqual({ title: "The Title" });
  });
});
