/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, forwardRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { MarkdownEditorProps } from "./markdown-editor.types";

export const MarkdownEditor = forwardRef<HTMLDivElement, MarkdownEditorProps>(
  ({ content, className = "", onScroll }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (wrapperRef.current && onScroll) {
        console.debug("MarkdownEditor: Adding scroll listener");
        wrapperRef.current.addEventListener("scroll", onScroll);
        return () => {
          console.debug("MarkdownEditor: Removing scroll listener");
          wrapperRef.current?.removeEventListener("scroll", onScroll);
        };
      }
    }, [onScroll]);

    return (
      <div
        ref={(el) => {
          wrapperRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        className={`prose prose-sm max-w-none h-full overflow-auto bg-base-100 p-4 ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-5xl font-bold mb-4" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-4xl font-bold mb-3" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-3xl font-bold mb-2" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-2xl font-bold mb-2" {...props} />
            ),
            h5: ({ node, ...props }) => (
              <h5 className="text-xl font-bold mb-2" {...props} />
            ),
            h6: ({ node, ...props }) => (
              <h6 className="text-lg font-bold mb-2" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-4 text-sm" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 mb-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 mb-4" {...props} />
            ),
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-primary pl-4 italic my-4"
                {...props}
              />
            ),
            code: ({ node, ...props }) => (
              <code
                className="p-1 rounded overflow-x-auto bg-base-300 text-xs font-normal font-mono"
                {...props}
              />
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-base-300 text-base-content p-4" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto mb-4">
                <table className="table table-zebra w-full" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th className="px-4 py-2 border" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-2 border" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
);
