import { renderStatic } from "./utils";

describe("serialize", () => {
  test("minimal", async () => {
    const result = await renderStatic("foo **bar**");
    expect(result).toMatchInlineSnapshot(`"<p>foo <strong>bar</strong></p>"`);
  });

  test("minimal", async () => {
    const result = await renderStatic("# h1");
    expect(result).toMatchInlineSnapshot(
      `"<h1 id="h1"><a class="anchor-copylink" href="#h1"><icon class="copylink"></icon></a>h1</h1>"`,
    );
  });
});
