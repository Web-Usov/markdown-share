import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

export const CodeEditorBaseTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
    overflow: "auto",
  },
  ".cm-scroller": {
    overflow: "auto",
    height: "100%",
  },
  ".cm-content": {
    fontFamily: "monospace",
    padding: "1rem",
  },
  ".cm-line": {
    padding: "0",
    lineHeight: "1.6",
  },
  ".cm-gutters": {
    display: "none",
  },
});

const lightHighlightStyle = HighlightStyle.define([
  { tag: tags.heading1, color: "#0550F5", fontWeight: "bold" },
  { tag: tags.heading2, color: "#0550F5", fontWeight: "bold" },
  { tag: tags.heading3, color: "#0550F5", fontWeight: "bold" },
  { tag: tags.emphasis, color: "#9B4DFF", fontStyle: "italic" },
  { tag: tags.strong, color: "#CF222E", fontWeight: "bold" },
  { tag: tags.link, color: "#0969DA" },
  { tag: tags.content, color: "#24292F" },
  { tag: tags.monospace, color: "#0A3069" },
  { tag: tags.meta, color: "#0969DA" }, // Для маркеров списка
]);

export const lightTheme = [
  EditorView.theme({
    "&": {
      backgroundColor: "#eeeeee",
      color: "#24292F",
    },
    ".cm-content": {
      caretColor: "#24292F",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#24292F",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "#ADD6FF",
    },
    ".cm-activeLine": {
      backgroundColor: "#F6F8FA",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#F6F8FA",
    },
    ".cm-gutters": {
      backgroundColor: "#ffffff",
      color: "#57606A",
      borderRight: "1px solid #D0D7DE",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#F6F8FA",
      border: "none",
      color: "#57606A",
    },
    // Стили для списков через CSS
    ".cm-bullet, .cm-list-mark": {
      color: "#0969DA",
      fontWeight: "bold",
    },
  }),
  syntaxHighlighting(lightHighlightStyle),
];

export const getEditorTheme = (theme: "light" | "dark"): Extension => {
  return theme === "dark" ? oneDark : lightTheme;
};
