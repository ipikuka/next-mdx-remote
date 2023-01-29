/**
 * Returns the Title Case of a given string
 * https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
function toTitleCase(str: string) {
  return str.replace(/\b\w+('\w{1})?/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export { toTitleCase };
