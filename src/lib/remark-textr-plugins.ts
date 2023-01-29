/* eslint-disable require-unicode-regexp */

/**
 * Textr plugin: a function that replaces below.
 *
 * (c) (C) → ©
 * (tm) (TM) → ™
 * (r) (R) → ®
 *
 * inspired from https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function scoped(input: string): string {
  const SCOPED_ABBR_RE = /\((c|tm|r)\)/gi;

  if (!SCOPED_ABBR_RE.test(input)) return input;

  const SCOPED_ABBR = {
    c: "©",
    r: "®",
    tm: "™",
  };

  function replaceFn(match: string, name: string): string {
    return SCOPED_ABBR[name.toLowerCase() as keyof typeof SCOPED_ABBR];
  }

  return input.replace(SCOPED_ABBR_RE, replaceFn);
}

/**
 * Textr plugin: a function that replaces below.
 *
 * +- → ±
 * ... → … (also ?.... → ?.., !.... → !..)
 * ???????? → ???, !!!!! → !!!, `,,` → `,`
 * -- → &ndash;, --- → &mdash;
 *
 * inspired from https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function rare(input: string): string {
  const RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

  if (!RARE_RE.test(input)) return input;

  return (
    input
      // gender
      .replace(/\+-/g, "±")
      // .., ..., ....... -> …
      // ?..... & !..... -> ?.. & !..
      .replace(/\.{2,}/g, "…")
      .replace(/([!?])…/g, "$1..")
      .replace(/([!?]){4,}/g, "$1$1$1")
      // doble comma `,,` → `,`
      .replace(/,{2,}/g, ",")
      // em-dash --- → &mdash;
      .replace(/(^|[^-])---(?=[^-]|$)/gm, "$1\u2014")
      // en-dash -- → &ndash;
      .replace(/(^|\s)--(?=\s|$)/gm, "$1\u2013")
      .replace(/(^|[^\s-])--(?=[^\s-]|$)/gm, "$1\u2013")
  );
}

/**
 * Textr plugin: a function that replaces triple dots with ellipses.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function ellipses(input: string): string {
  return input.replace(/\.{3}/g, "…");
}

/**
 * Textr plugin: a function that replaces (c) or (R) with the © mark.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function copyright(input: string): string {
  return input.replace(/\(c\)/gi, "©");
}

/**
 * Textr plugin: a function that replaces (r) or (R) with the ® mark.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function companymark(input: string): string {
  return input.replace(/\(r\)/gi, "®");
}

/**
 * Textr plugin: a function that replaces (tm) or (TM) with the ™ mark.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function trademark(input: string): string {
  return input.replace(/\(tm\)/gi, "™");
}

/**
 * Textr plugin: a function that replaces +- with the ± mark.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function gender(input: string): string {
  return input.replace(/\+-/gimu, "±");
}

/**
 * Textr plugin: a function that replaces <br> <br/> <br /> <BR> <BR/> <BR /> with the <br /> mark.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function breakline(input: string): string {
  return input.replace(/<br\s*\/?>/gi, "<br />");
}

/**
 * Textr plugin: a function that replaces <hr> <hr/> <hr /> <HR> <HR/> <HR /> with the <hr /> mark.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function horizontalline(input: string): string {
  return input.replace(/<hr\s*\/?>/gi, "<hr />");
}

/**
 * Textr plugin: a function that replaces << >> with the « » mark.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function guillemets(input: string): string {
  const leftMark = "\u00AB";
  const rightMark = "\u00BB";
  const spaceChar = "\u202F";

  const leftAnglePattern = /<<\s*/gm;
  const rightAnglePattern = /\s*>>/gm;

  return input
    .replace(leftAnglePattern, leftMark.concat(spaceChar))
    .replace(rightAnglePattern, spaceChar.concat(rightMark));
}

export { scoped, rare, breakline, horizontalline, ellipses, copyright, companymark, trademark, gender, guillemets };

/* eslint-enable require-unicode-regexp */
