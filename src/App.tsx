import { ThemeProvider } from "./context/ThemeContext";
import { MarkdownProvider, useMarkdown } from "./context/MarkdownContext";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { CodeEditor } from "./components/CodeEditor/CodeEditor";
import { Toolbar } from "./components/Toolbar";
import { useRef, useCallback, useEffect } from "react";
import { calculateScrollPercentage, setScrollPercentage } from "./utils";
import { Splitter } from "./components/Splitter/Splitter";
import logo from "./assets/logo.svg";

function AppContent() {
  const { content, setContent } = useMarkdown();
  const markdownRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLDivElement>(null);
  const scrollingSource = useRef<string | null>(null);
  const rafId = useRef<number | null>(null);
  const lastPercentage = useRef<number>(0);

  const syncScroll = useCallback((source: string, percentage: number) => {
    if (scrollingSource.current === source) return;

    // Проверяем, есть ли реальное изменение
    if (Math.abs(lastPercentage.current - percentage) < 0.001) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    scrollingSource.current = source;
    lastPercentage.current = percentage;

    rafId.current = requestAnimationFrame(() => {
      if (source === "code" && markdownRef.current) {
        setScrollPercentage(markdownRef.current, percentage);
      } else if (source === "markdown") {
        const scroller = codeEditorRef.current?.querySelector(".cm-scroller");
        if (scroller) {
          setScrollPercentage(scroller as HTMLElement, percentage);
        }
      }

      rafId.current = null;
      scrollingSource.current = null;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const handleCodeEditorScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLElement;
      syncScroll("code", calculateScrollPercentage(target));
    },
    [syncScroll]
  );

  const handleMarkdownScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLElement;
      syncScroll("markdown", calculateScrollPercentage(target));
    },
    [syncScroll]
  );

  return (
    <div className="  bg-base-100 text-base-content flex flex-col h-screen">
      <div className="navbar bg-base-200 p-4">
        <div className="flex-1 flex items-center gap-4">
          <img src={logo} alt="Markdown Share" className="h-12 w-12" />

          <span className="text-4xl font-bold text-primary hidden md:block">
            Markdown Share
          </span>
        </div>
        <Toolbar />
      </div>
      <Splitter>
        <CodeEditor
          value={content}
          onChange={setContent}
          className="h-full w-full"
          ref={codeEditorRef}
          onScroll={handleCodeEditorScroll}
        />
        <MarkdownEditor
          content={content}
          className="h-full w-full"
          ref={markdownRef}
          onScroll={handleMarkdownScroll}
        />
      </Splitter>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MarkdownProvider>
        <AppContent />
      </MarkdownProvider>
    </ThemeProvider>
  );
}

export default App;
