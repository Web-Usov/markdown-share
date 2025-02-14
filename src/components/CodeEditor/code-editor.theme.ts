import { EditorView } from "@codemirror/view";

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
