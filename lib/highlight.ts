import { codeToHtml } from "shiki";

/** Build-time syntax highlighting with light and dark themes (switched in CSS). */
export function highlight(code: string, lang = "tsx") {
  return codeToHtml(code.replace(/^\n+|\s+$/g, ""), {
    lang,
    themes: { light: "github-light-default", dark: "github-dark-default" },
    defaultColor: false,
  });
}
