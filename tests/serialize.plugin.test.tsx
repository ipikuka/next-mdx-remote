import dedent from "dedent";

import { renderStatic } from "./utils";

/**
 *
 * This test file is designed to test the plugins in the "serialize" wrapper
 *
 */

describe("serialize", () => {
  // ******************************************
  test("horizontal lines", async () => {
    const input = dedent(`
      <hr>
      <hr />
      ***
      ---
      ___
    `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(`
      "<hr/>
      <hr/>
      <hr/>
      <hr/>
      <hr/>"
    `);
  });

  // ******************************************
  test("breaklines", async () => {
    const input = dedent(`
      <br>
      <br />
    `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(`
      "<br/>
      <br/>"
    `);
  });

  // ******************************************
  test("quotes", async () => {
    const input = dedent(`
            "double quotes" and 'single quotes' and <<russian>>  
          `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(
      `"<p>“double quotes” and ‘single quotes’ and « russian »</p>"`,
    );
  });

  // ******************************************
  test("Smartypants", async () => {
    const input = dedent(`
            dash (-) en dash (--), em dash (---)  
            types - -- ---  
          `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(`
      "<p>dash (-) en dash (–), em dash (—)<br/>
      types - – —</p>"
    `);
  });

  // ******************************************
  test("paragraph custom alerts", async () => {
    const input = dedent(`
      => hello success

      -> hello info

      ~> hello warning

      !> hello danger
    `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(`
      "<div class="alert alert-success g-type-body"><p>hello success</p></div>
      <div class="alert alert-info g-type-body"><p>hello info</p></div>
      <div class="alert alert-warning g-type-body"><p>hello warning</p></div>
      <div class="alert alert-danger g-type-body"><p>hello danger</p></div>"
    `);
  });

  // ******************************************
  test("flexible code titles", async () => {
    const input = dedent(`
          \`\`\`js:title.js
          \`\`\`
        `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(
      `"<div class="remark-code-container"><div class="remark-code-title">title.js</div><pre data-language="js" class="language-js"><code class="language-js code-highlight"></code></pre></div>"`,
    );
  });

  // ******************************************
  test("flexible code titles", async () => {
    const input = dedent(`
            \`\`\`js:C:\\users\\documents
            \`\`\`
          `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(
      `"<div class="remark-code-container"><div class="remark-code-title">C:\\users\\documents</div><pre data-language="js" class="language-js"><code class="language-js code-highlight"></code></pre></div>"`,
    );
  });

  // ******************************************
  test("custom container --> admonitions with title", async () => {
    const input = dedent(`
        ::: warning title

        content

        :::
      `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(
      `"<admonition class="remark-container warning" data-type="warning" data-title="Title"><p>content</p></admonition>"`,
    );
  });

  // ******************************************
  test("custom container --> admonitions without title", async () => {
    const input = dedent(`
          ::: danger
  
          content
  
          :::
        `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(
      `"<admonition class="remark-container danger" data-type="danger"><p>content</p></admonition>"`,
    );
  });
});
