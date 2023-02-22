/* eslint-disable require-unicode-regexp */

// U+00A0 NO-BREAK SPACE
// U+202F NARROW NO-BREAK SPACE
// U+0020 SPACE

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
function trademarks(input: string): string {
  const REGEX = /\((c|tm|r)\)/gi;

  if (!REGEX.test(input)) return input;

  const copyright = "\u00A9"; // © copyright
  const trademark = "\u2122"; // ™ trademark
  const registeredTrademark = "\u00AE"; // ® registered trademark

  const ABBR = {
    c: copyright,
    tm: trademark,
    r: registeredTrademark,
  };

  function replaceFn(match: string, name: string): string {
    return ABBR[name.toLowerCase() as keyof typeof ABBR];
  }

  const _middle = input.replace(REGEX, replaceFn);

  const output = _middle
    .replace(/© *(\d)/g, "© $1") // single space before copyright
    .replace(/ *(™)/g, "$1"); // remove spaces before trademark

  return output;
}

/**
 * Textr plugin: a function that replaces below.
 *
 * inspired from https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function typographic(input: string): string {
  const REGEX = /\+-|\.\.|\?\?\?\?|!!!!|,,| +| [.,]/;

  if (!REGEX.test(input)) return input;

  return (
    input
      // .. ... ....... -> …
      .replace(/\.{2,}/g, "…")
      // ?..... & !..... -> ?.. & !..
      .replace(/([!?])…/g, "$1..")
      // ???? & !!!!!! -> ??? & !!!
      .replace(/([!?]){4,}/g, "$1$1$1")
      // ,, ,,, ,,,,, → ,
      .replace(/,{2,}/g, ",")
      // single space
      .replace(/ +/g, " ")
      // remove the space before comma or dot
      .replace(/ ([.,])/g, "$1")
  );
}

/**
 * Textr plugin: a function that replaces math equations.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function math(input: string): string {
  const REGEX = /.+ *\+-|\([-/+÷xX]\)/;

  if (!REGEX.test(input)) return input;

  const nnbspace = "\u202F"; // narrow non-breaking space

  /***
   *
   * plus in parenthesis (+) turns into U+002B + PLUS SIGN
   * dash in parenthesis (-) turns into U+2212 − MINUS SIGN
   * x in parenthesis (x) turns into U+00D7 × MULTIPLICATION SIGN
   * X in parenthesis (X) turns into U+00D7 × MULTIPLICATION SIGN
   * slash in parenthesis (/) turns into U+2215 ∕ DIVISION SLASH
   * U+00F7 ÷ in parenthesis (÷) turns into U+00F7 ÷ DIVISION SIGN
   *
   */

  return (
    input
      // +- -> ±    -+ -> ∓
      .replace(/\+-/g, "±")
      .replace(/-\+/g, "∓")
      // signs in paranthesis, (x) (X) (+) (-) (/) (÷) -> × + − ∕ ÷
      .replace(/(\w+) *\(x\) *(\w+)/g, `$1${nnbspace}×${nnbspace}$2`)
      .replace(/(\w+) *\(X\) *(\w+)/g, `$1${nnbspace}×${nnbspace}$2`)
      .replace(/(\w+) *\(-\) *(\w+)/g, `$1${nnbspace}−${nnbspace}$2`)
      .replace(/(\w+) *\(÷\) *(\w+)/g, `$1${nnbspace}÷${nnbspace}$2`)
      .replace(/(\w+) *\([/]\) *(\w+)/g, `$1${nnbspace}∕${nnbspace}$2`)
      .replace(/(\w+) *\([+]\) *(\w+)/g, `$1${nnbspace}+${nnbspace}$2`)
      .replace(/ *= */g, `${nnbspace}=${nnbspace}`)
  );
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
  const leftMark = "\u00AB"; // «
  const rightMark = "\u00BB"; // »
  const nnbspace = "\u202F"; // narrow non-breaking space

  const leftAnglePattern = /<</g;
  const rightAnglePattern = />>/g;

  const _fixed = input
    .replace(leftAnglePattern, leftMark)
    .replace(rightAnglePattern, rightMark);

  const leftMarkPattern = /(?<![(])«(?![)]) */g;
  const rightMarkPattern = / *(?<![(])»(?![)])/g;

  const _space_fixed = _fixed
    .replace(leftMarkPattern, `${leftMark}${nnbspace}`)
    .replace(rightMarkPattern, `${nnbspace}${rightMark}`);

  const leftMathPattern = / *\(«\) */g;
  const rightMathPattern = / *\(»\) */g;

  const _math_fixed = _space_fixed
    .replace(leftMathPattern, `${nnbspace}${leftMark}${nnbspace}`)
    .replace(rightMathPattern, `${nnbspace}${rightMark}${nnbspace}`);

  return _math_fixed;
}

/**
 * Textr plugin: a function that replaces <= and => with the ≤ and ≥ marks.
 *
 * @type {import('remark-textr').TextrPlugin}
 */
function orEqual(input: string): string {
  const greaterOrEqualThanPattern = /(\w) *>= *(\w)/g;
  const smallerOrEqualThanPattern = /(\w) *<= *(\w)/g;

  const nnbspace = "\u202F";

  return input
    .replace(greaterOrEqualThanPattern, `$1${nnbspace}≥${nnbspace}$2`)
    .replace(smallerOrEqualThanPattern, `$1${nnbspace}≤${nnbspace}$2`);
}

export {
  trademarks,
  typographic,
  math,
  orEqual,
  breakline,
  horizontalline,
  guillemets,
};

/* eslint-enable require-unicode-regexp */
