import dedent from "dedent";
import * as prettier from "prettier";

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

describe("serialize - smartypants & textr", () => {
  // ******************************************
  test("smartypants & textr in MDX", async () => {
    const input = dedent(`
      (c)   2023  (C)  2023 (r) (R) Company (tm) Company (TM)

      a +- b -+ c add factor -+d

      ab (-) 2 = 3, 5(-)2b=3, xx(-)yy, 5(-) 2    =  3

      ab (+) 2 = 3, 5(+)2b=3, xx(+)yy, 5(+) 2    =  6

      ab (/) 2 = 3, 5(/)2b=3, xx(/)yy, 5(/) 2    =  6

      ab (÷) 2 = 3, 5(÷)2b=3, xx(÷)yy, 5(÷) 2    =  6

      ab (x) 2 = 3, 5(x)2b=3, xx(x)yy, 5(x) 2    =  6

      ab (X) 2 = 3, 5(X)2b=3, xx(X)yy, 5(X) 2    =  6

      x (+)y(x) z (÷) a (X) b   (/) xyz   (-) ipikuka     >=    0

      2 <= 5, a>=b, abc >= 34, 5<=a

      a (>>) b, 3(<<)c, a(>>)b, 3 (<<) c, << russian >>

      test. test.. test... test.....
      
      test?. test?.. test?... test?..... test!. test!.. test!... test!.....
      
      ! !! !!! !!!! !!!!! ? ?? ??? ????? ????? , ,, ,,, ,,,, ,,,,,

      My    aim is single    space  ,   always      .

      "double quotes" and 'single quotes' and <<russian>>

      dash (-), en dash (--), em dash (---), all types - -- ---
    `);

    const result = await renderStatic(input);

    expect(result).toMatchInlineSnapshot(`
      "<p>© 2023 © 2023 ® ® Company™ Company™</p>
      <p>a ± b ∓ c add factor ∓d</p>
      <p>ab − 2 = 3, 5 − 2b = 3, xx − yy, 5 − 2 = 3</p>
      <p>ab + 2 = 3, 5 + 2b = 3, xx + yy, 5 + 2 = 6</p>
      <p>ab ∕ 2 = 3, 5 ∕ 2b = 3, xx ∕ yy, 5 ∕ 2 = 6</p>
      <p>ab ÷ 2 = 3, 5 ÷ 2b = 3, xx ÷ yy, 5 ÷ 2 = 6</p>
      <p>ab × 2 = 3, 5 × 2b = 3, xx × yy, 5 × 2 = 6</p>
      <p>ab × 2 = 3, 5 × 2b = 3, xx × yy, 5 × 2 = 6</p>
      <p>x + y × z ÷ a × b ∕ xyz − ipikuka ≥ 0</p>
      <p>2 ≤ 5, a ≥ b, abc ≥ 34, 5 ≤ a</p>
      <p>a » b, 3 « c, a » b, 3 « c, « russian »</p>
      <p>test. test… test… test…</p>
      <p>test?. test?.. test?.. test?.. test!. test!.. test!.. test!..</p>
      <p>! !! !!! !!! !!! ? ?? ??? ??? ???,,,,,</p>
      <p>My aim is single space, always.</p>
      <p>“double quotes” and ‘single quotes’ and « russian »</p>
      <p>dash (-), en dash (–), em dash (—), all types - – —</p>"
    `);
  });

  // ******************************************
  test("smartypants & textr in markdown", async () => {
    const input = dedent(`
      (c)   2023  (C)  2023 (r) (R) Company (tm) Company (TM)

      a +- b -+ c add factor -+d

      ab (-) 2 = 3, 5(-)2b=3, xx(-)yy, 5(-) 2    =  6

      ab (+) 2 = 3, 5(+)2b=3, xx(+)yy, 5(+) 2    =  6

      ab (/) 2 = 3, 5(/)2b=3, xx(/)yy, 5(/) 2    =  6

      ab (÷) 2 = 3, 5(÷)2b=3, xx(÷)yy, 5(÷) 2    =  6

      ab (x) 2 = 3, 5(x)2b=3, xx(x)yy, 5(x) 2    =  6

      ab (X) 2 = 3, 5(X)2b=3, xx(X)yy, 5(X) 2    =  6
      
      x (+)y(x) z (÷) a (X) b   (/) xyz   (-) ipikuka     >=    0

      2 <= 5, a>=b, abc >= 34, 5<=a

      a (>>) b, 3(<<)c, a(>>)b, 3 (<<) c, << russian >>

      test.. test... test.....
      
      test?. test?.. test?... test?..... test!. test!.. test!... test!.....
      
      ! !! !!! !!!! !!!!! ? ?? ??? ????? ????? , ,, ,,, ,,,, ,,,,,

      My    aim is single    space  ,   always      .

      "double quotes" and 'single quotes' and <<russian>>

      dash (-), en dash (--), em dash (---), all types - -- ---
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
      "<p>© 2023 © 2023 ® ® Company™ Company™</p>
      <p>a ± b ∓ c add factor ∓d</p>
      <p>ab − 2 = 3, 5 − 2b = 3, xx − yy, 5 − 2 = 6</p>
      <p>ab + 2 = 3, 5 + 2b = 3, xx + yy, 5 + 2 = 6</p>
      <p>ab ∕ 2 = 3, 5 ∕ 2b = 3, xx ∕ yy, 5 ∕ 2 = 6</p>
      <p>ab ÷ 2 = 3, 5 ÷ 2b = 3, xx ÷ yy, 5 ÷ 2 = 6</p>
      <p>ab × 2 = 3, 5 × 2b = 3, xx × yy, 5 × 2 = 6</p>
      <p>ab × 2 = 3, 5 × 2b = 3, xx × yy, 5 × 2 = 6</p>
      <p>x + y × z ÷ a × b ∕ xyz − ipikuka ≥ 0</p>
      <p>2 ≤ 5, a ≥ b, abc ≥ 34, 5 ≤ a</p>
      <p>a » b, 3 « c, a » b, 3 « c, « russian »</p>
      <p>test… test… test…</p>
      <p>test?. test?.. test?.. test?.. test!. test!.. test!.. test!..</p>
      <p>! !! !!! !!! !!! ? ?? ??? ??? ???,,,,,</p>
      <p>My aim is single space, always.</p>
      <p>“double quotes” and ‘single quotes’ and « russian »</p>
      <p>dash (-), en dash (–), em dash (—), all types - – —</p>"
    `);
  });
});

describe("serialize - superscript subscript", () => {
  // ******************************************
  test("superscript subscript in MDX", async () => {
    const input = dedent(`
      - 19^th^ H~2~O
      - H~2~O 19^th^
      
      H~2~O 19^th^ H~2~O 19^th^
      
      _H~2~O 19^th^_ **H~2~O 19^th^**
      
      ##### H~2~O 19^th^
    `);

    const result = await renderStatic(input);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<ul>
        <li>
          19<sup>th</sup> H<sub>2</sub>O
        </li>
        <li>
          H<sub>2</sub>O 19<sup>th</sup>
        </li>
      </ul>
      <p>
        H<sub>2</sub>O 19<sup>th</sup> H<sub>2</sub>O 19<sup>th</sup>
      </p>
      <p>
        <em>
          H<sub>2</sub>O 19<sup>th</sup>
        </em>{" "}
        <strong>
          H<sub>2</sub>O 19<sup>th</sup>
        </strong>
      </p>
      <h5 id="h2o-19th">
        <a class="anchor-copylink" href="#h2o-19th">
          <icon class="copylink"></icon>
        </a>
        H<sub>2</sub>O 19<sup>th</sup>
      </h5>
      "
    `);
  });

  // ******************************************
  test("superscript subscript in markdown", async () => {
    const input = dedent(`
      - 19^th^ H~2~O
      - H~2~O 19^th^
      
      H~2~O 19^th^ H~2~O 19^th^
      
      _H~2~O 19^th^_ **H~2~O 19^th^**
      
      ##### H~2~O 19^th^
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<ul>
        <li>
          19<sup>th</sup> H<sub>2</sub>O
        </li>
        <li>
          H<sub>2</sub>O 19<sup>th</sup>
        </li>
      </ul>
      <p>
        H<sub>2</sub>O 19<sup>th</sup> H<sub>2</sub>O 19<sup>th</sup>
      </p>
      <p>
        <em>
          H<sub>2</sub>O 19<sup>th</sup>
        </em>{" "}
        <strong>
          H<sub>2</sub>O 19<sup>th</sup>
        </strong>
      </p>
      <h5 id="h2o-19th">
        <a class="anchor-copylink" href="#h2o-19th">
          <icon class="copylink"></icon>
        </a>
        H<sub>2</sub>O 19<sup>th</sup>
      </h5>
      "
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
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p
        class="flexible-paragraph flexiparaph-warning flexiparaph-align-justify"
        style="text-align:justify"
      >
        hello warning
      </p>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-success flexiparaph-align-left"
          style="text-align:left"
        >
          hello success
        </p>
      </div>
      "
    `);
  });

  // ******************************************
  test("flexible paragraphs in markdown", async () => {
    const input = dedent(`
      ~:w:> hello warning
      
      =:s> hello success
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p
        class="flexible-paragraph flexiparaph-warning flexiparaph-align-justify"
        style="text-align:justify"
      >
        hello warning
      </p>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-success flexiparaph-align-left"
          style="text-align:left"
        >
          hello success
        </p>
      </div>
      "
    `);
  });

  // ******************************************
  test("flexible paragraphs in MDX", async () => {
    const input = dedent(`
      ~> hello
      ~|> hello
      ~:> hello
      ~:|> hello
      => hello
      =|:> hello
      =:|:> hello
      =::> hello
    `);

    const result = await renderStatic(input);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p class="flexible-paragraph">hello</p>
      <p
        class="flexible-paragraph flexiparaph-align-center"
        style="text-align:center"
      >
        hello
      </p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">
        hello
      </p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">
        hello
      </p>
      <div class="flexible-paragraph-wrapper">
        <p class="flexible-paragraph">hello</p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-right"
          style="text-align:right"
        >
          hello
        </p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-justify"
          style="text-align:justify"
        >
          hello
        </p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-justify"
          style="text-align:justify"
        >
          hello
        </p>
      </div>
      "
    `);
  });

  // ******************************************
  test("flexible paragraphs in markdown", async () => {
    const input = dedent(`
      ~> hello
      ~|> hello
      ~:> hello
      ~:|> hello
      => hello
      =|:> hello
      =:|:> hello
      =::> hello
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p class="flexible-paragraph">hello</p>
      <p
        class="flexible-paragraph flexiparaph-align-center"
        style="text-align:center"
      >
        hello
      </p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">
        hello
      </p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">
        hello
      </p>
      <div class="flexible-paragraph-wrapper">
        <p class="flexible-paragraph">hello</p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-right"
          style="text-align:right"
        >
          hello
        </p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-justify"
          style="text-align:justify"
        >
          hello
        </p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-justify"
          style="text-align:justify"
        >
          hello
        </p>
      </div>
      "
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
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre class="language-js" data-language="js">
          <code class="language-js code-highlight"></code>
        </pre>
      </div>
      "
    `);
  });

  // ******************************************
  test("flexible code titles (file name) in markdown", async () => {
    const input = dedent(`
      \`\`\`js:title.js
      \`\`\`
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre class="language-js" data-language="js">
          <code class="language-js code-highlight"></code>
        </pre>
      </div>
      "
    `);
  });

  // ******************************************
  test("flexible code titles (file path) in MDX", async () => {
    const input = dedent(`
      \`\`\`js:C:\\users\\documents
      \`\`\`
    `);

    const result = await renderStatic(input);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<div class="remark-code-container">
        <div class="remark-code-title">C:\\users\\documents</div>
        <pre class="language-js" data-language="js">
          <code class="language-js code-highlight"></code>
        </pre>
      </div>
      "
    `);
  });

  // ******************************************
  test("flexible code titles (file path) in markdown", async () => {
    const input = dedent(`
      \`\`\`js:C:\\users\\documents
      \`\`\`
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<div class="remark-code-container">
        <div class="remark-code-title">C:\\users\\documents</div>
        <pre class="language-js" data-language="js">
          <code class="language-js code-highlight"></code>
        </pre>
      </div>
      "
    `);
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
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition
        class="remark-container warning"
        data-type="warning"
        data-title="Title"
      >
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("flexible containers --> admonitions with title in markdown", async () => {
    const input = dedent(`
      ::: warning title
      content
      :::
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition
        class="remark-container warning"
        data-type="warning"
        data-title="Title"
      >
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("flexible containers --> admonitions without title in MDX", async () => {
    const input = dedent(`
      ::: danger
      content
      :::
    `);

    const result = await renderStatic(input);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition
        class="remark-container danger"
        data-type="danger"
        data-title="Danger"
      >
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("flexible containers --> admonitions without title in markdown", async () => {
    const input = dedent(`
      ::: danger
      content
      :::
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition
        class="remark-container danger"
        data-type="danger"
        data-title="Danger"
      >
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("flexible markers --> marked or highlighted texts in MDX", async () => {
    const input = dedent(`
      == ==

      ==marked text==

      =r=marked text==
    `);

    const result = await renderStatic(input);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <mark class="flexible-marker flexible-marker-default flexible-marker-empty"></mark>
      </p>
      <p>
        <mark class="flexible-marker flexible-marker-default">marked text</mark>
      </p>
      <p>
        <mark class="flexible-marker flexible-marker-red">marked text</mark>
      </p>
      "
    `);
  });

  // ******************************************
  test("flexible markers --> marked or highlighted texts in markdown", async () => {
    const input = dedent(`
        == ==

        ==marked text==

        =r=marked text==
      `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <mark class="flexible-marker flexible-marker-default flexible-marker-empty"></mark>
      </p>
      <p>
        <mark class="flexible-marker flexible-marker-default">marked text</mark>
      </p>
      <p>
        <mark class="flexible-marker flexible-marker-red">marked text</mark>
      </p>
      "
    `);
  });

  // ******************************************
  test("remark ins --> inserted texts in MDX", async () => {
    const input = dedent(`
      ++ ++

      ++inserted text++

      ++ inserted text ++
    `);

    const result = await renderStatic(input);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <ins class="remark-ins-empty"></ins>
      </p>
      <p>
        <ins class="remark-ins">inserted text</ins>
      </p>
      <p>++ inserted text ++</p>
      "
    `);
  });

  // ******************************************
  test("remark ins --> inserted texts in markdown", async () => {
    const input = dedent(`
      ++ ++

      ++inserted text++

      ++ inserted text ++
    `);

    const result = await renderStatic(input, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <ins class="remark-ins-empty"></ins>
      </p>
      <p>
        <ins class="remark-ins">inserted text</ins>
      </p>
      <p>++ inserted text ++</p>
      "
    `);
  });
});
