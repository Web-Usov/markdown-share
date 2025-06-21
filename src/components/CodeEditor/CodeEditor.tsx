import { useRef, forwardRef, useEffect } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { CodeEditorProps } from "./code-editor.types";
import { CodeEditorBaseTheme, getEditorTheme } from "./code-editor.theme";
import { useTheme } from "../../context/ThemeContext";

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  ({ value, onChange, className = "", onScroll }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const codeEditorRef = useRef<EditorView>(null);
    const scrollListenerRef = useRef<((e: Event) => void) | null>(null);
    const { theme } = useTheme();

    // Создаем редактор только один раз
    useEffect(() => {
      if (!wrapperRef.current || codeEditorRef.current) return;

      const codeEditorInstance = new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: [
            markdown(),
            keymap.of([indentWithTab]),
            keymap.of(defaultKeymap),
            getEditorTheme(theme),
            CodeEditorBaseTheme,
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                onChange(update.state.doc.toString());
              }
            }),
            EditorView.lineWrapping,
          ],
        }),

        parent: wrapperRef.current,
      });

      codeEditorRef.current = codeEditorInstance;

      return () => {
        codeEditorInstance.destroy();
        codeEditorRef.current = null;
      };
    }, []); // Пустой массив зависимостей

    // Обновляем содержимое редактора при изменении value
    useEffect(() => {
      if (
        !codeEditorRef.current ||
        codeEditorRef.current.state.doc.toString() === value
      )
        return;

      codeEditorRef.current.dispatch({
        changes: {
          from: 0,
          to: codeEditorRef.current.state.doc.length,
          insert: value,
        },
      });
    }, [value]);

    // Обновляем тему при её изменении
    useEffect(() => {
      if (!codeEditorRef.current) return;

      const newState = EditorState.create({
        doc: codeEditorRef.current.state.doc,
        extensions: [
          markdown(),
          keymap.of([indentWithTab]),
          keymap.of(defaultKeymap),
          getEditorTheme(theme),
          CodeEditorBaseTheme,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          }),
          EditorView.lineWrapping,
        ],
      });

      codeEditorRef.current.setState(newState);
    }, [theme, onChange]);

    // Управляем обработчиком прокрутки отдельно
    useEffect(() => {
      if (!wrapperRef.current || !onScroll) return;

      const scroller = wrapperRef.current.querySelector(".cm-scroller");
      if (!scroller) return;

      // Удаляем предыдущий обработчик, если он есть
      if (scrollListenerRef.current) {
        scroller.removeEventListener("scroll", scrollListenerRef.current);
      }

      scrollListenerRef.current = onScroll;
      scroller.addEventListener("scroll", onScroll);

      return () => {
        if (scrollListenerRef.current) {
          scroller.removeEventListener("scroll", scrollListenerRef.current);
          scrollListenerRef.current = null;
        }
      };
    }, [onScroll]);

    return (
      <div
        ref={(el) => {
          wrapperRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        className={className}
      />
    );
  }
);
