import dedent from "dedent";

import { renderStatic } from "./utils";

/**
 *
 * This test file is designed to test the plugins that in the "serialize" wrapper
 *
 */

describe("serialize - horizontal lines", () => {
  // ******************************************
  test("horizontal lines in MDX", async () => {
    const input = dedent(`
      <hr>
      <hr/>
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
      <hr/>
      <hr/>"
    `);
  });

  // ******************************************
  test("horizontal lines in markdown", async () => {
    const input = dedent(`
      <hr/>
      <hr />
      <hr>

      ***
      ---
      ___
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
      "<hr/>
      <hr/>
      <hr/>
      <hr/>
      <hr/>
      <hr/>"
    `);
  });
});

describe("serialize - breaklines", () => {
  // ******************************************
  test("breaklines in MDX", async () => {
    const input = dedent(`
      <br>
      <br/>
      <br />
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "mdx" } });

    expect(result).toMatchInlineSnapshot(`
      "<br/>
      <br/>
      <br/>"
    `);
  });

  // ******************************************
  test("breaklines in markdown", async () => {
    const input = dedent(`
      <br>
      <br/>
      <br />
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
      "<br/>
      <br/>
      <br/>"
    `);
  });
});

describe("serialize - quotes & smartypants", () => {
  // ******************************************
  test("quotes in MDX", async () => {
    const input = dedent(`
      "double quotes" and 'single quotes' and <<russian>>  
    `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(
      `"<p>“double quotes” and ‘single quotes’ and « russian »</p>"`,
    );
  });

  // ******************************************
  test("quotes in markdown", async () => {
    const input = dedent(`
      "double quotes" and 'single quotes' and <<russian>>  
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(
      `"<p>“double quotes” and ‘single quotes’ and « russian »</p>"`,
    );
  });

  // ******************************************
  test("Smartypants in MDX", async () => {
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
  test("Smartypants in markdown", async () => {
    const input = dedent(`
      dash (-) en dash (--), em dash (---)  
      types - -- ---  
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
        "<p>dash (-) en dash (–), em dash (—)<br/>
        types - – —</p>"
      `);
  });
});

describe("serialize - flexible paragraphs", () => {
  // ******************************************
  test("flexible paragraphs in MDX", async () => {
    const input = dedent(`
      ~:w:> hello warning
      
      =:s> hello success
    `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(`
      "<p class="flexible-paragraph flexiparaph-warning flexiparaph-align-justify" style="text-align:justify">hello warning</p>
      <div class="flexible-paragraph-wrapper"><p class="flexible-paragraph flexiparaph-success flexiparaph-align-left" style="text-align:left">hello success</p></div>"
    `);
  });

  // ******************************************
  test("flexible paragraphs in markdown", async () => {
    const input = dedent(`
      ~:w:> hello warning
      
      =:s> hello success
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
      "<p class="flexible-paragraph flexiparaph-warning flexiparaph-align-justify" style="text-align:justify">hello warning</p>
      <div class="flexible-paragraph-wrapper"><p class="flexible-paragraph flexiparaph-success flexiparaph-align-left" style="text-align:left">hello success</p></div>"
    `);
  });

  // ******************************************
  test("flexible paragraphs in MDX", async () => {
    const input = dedent(`
      ~> hello
      ~|> hello
      ~:> hello
      ~:|> hello
      ~|:> hello
      ~:|:> hello
      ~::> hello
    `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(`
      "<p class="flexible-paragraph">hello</p>
      <p class="flexible-paragraph flexiparaph-align-center" style="text-align:center">hello</p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">hello</p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">hello</p>
      <p class="flexible-paragraph flexiparaph-align-right" style="text-align:right">hello</p>
      <p class="flexible-paragraph flexiparaph-align-justify" style="text-align:justify">hello</p>
      <p class="flexible-paragraph flexiparaph-align-justify" style="text-align:justify">hello</p>"
    `);
  });

  // ******************************************
  test("flexible paragraphs in markdown", async () => {
    const input = dedent(`
      ~> hello
      ~|> hello
      ~:> hello
      ~:|> hello
      ~|:> hello
      ~:|:> hello
      ~::> hello
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
      "<p class="flexible-paragraph">hello</p>
      <p class="flexible-paragraph flexiparaph-align-center" style="text-align:center">hello</p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">hello</p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">hello</p>
      <p class="flexible-paragraph flexiparaph-align-right" style="text-align:right">hello</p>
      <p class="flexible-paragraph flexiparaph-align-justify" style="text-align:justify">hello</p>
      <p class="flexible-paragraph flexiparaph-align-justify" style="text-align:justify">hello</p>"
    `);
  });
});

describe("serialize - flexible code titles", () => {
  // ******************************************
  test("flexible code titles (file name) in MDX", async () => {
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
  test("flexible code titles (file name) in markdown", async () => {
    const input = dedent(`
      \`\`\`js:title.js
      \`\`\`
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(
      `"<div class="remark-code-container"><div class="remark-code-title">title.js</div><pre data-language="js" class="language-js"><code class="language-js code-highlight"></code></pre></div>"`,
    );
  });

  // ******************************************
  test("flexible code titles (file path)in MDX", async () => {
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
  test("flexible code titles (file path) in markdown", async () => {
    const input = dedent(`
      \`\`\`js:C:\\users\\documents
      \`\`\`
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(
      `"<div class="remark-code-container"><div class="remark-code-title">C:\\users\\documents</div><pre data-language="js" class="language-js"><code class="language-js code-highlight"></code></pre></div>"`,
    );
  });
});

describe("serialize - flexible containers", () => {
  // ******************************************
  test("flexible containers --> admonitions with title in MDX", async () => {
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
  test("flexible containers --> admonitions with title in markdown", async () => {
    const input = dedent(`
      ::: warning title
      content
      :::
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(
      `"<admonition class="remark-container warning" data-type="warning" data-title="Title"><p>content</p></admonition>"`,
    );
  });

  // ******************************************
  test("flexible containers --> admonitions without title in MDX", async () => {
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

  // ******************************************
  test("flexible containers --> admonitions without title in markdown", async () => {
    const input = dedent(`
      ::: danger
      content
      :::
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(
      `"<admonition class="remark-container danger" data-type="danger"><p>content</p></admonition>"`,
    );
  });
});
