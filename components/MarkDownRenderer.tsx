/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Headings
        h1: (props) => (
          <h1
            className="text-3xl font-extrabold mb-4 mt-6 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        h2: (props) => (
          <h2
            className="text-2xl font-bold mb-3 mt-5 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        h3: (props) => (
          <h3
            className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        h4: (props) => (
          <h4
            className="text-lg font-medium mb-2 mt-3 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        h5: (props) => (
          <h5
            className="text-base font-medium mb-1 mt-2 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        h6: (props) => (
          <h6
            className="text-sm font-medium mb-1 mt-2 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),

        // Paragraphs
        p: (props) => (
          <p
            className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"
            {...props}
          />
        ),

        // Links
        a: (props) => (
          <a
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            {...props}
          />
        ),

        // Lists
        ul: (props) => (
          <ul className="mb-4 ml-6 list-disc space-y-1" {...props} />
        ),
        ol: (props) => (
          <ol className="mb-4 ml-6 list-decimal space-y-1" {...props} />
        ),
        li: (props) => (
          <li className="text-gray-700 dark:text-gray-300" {...props} />
        ),

        // Blockquotes
        blockquote: (props) => (
          <blockquote
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800"
            {...props}
          />
        ),

        // Code blocks
        code: ({
          inline,
          className,
          children: codeChildren,
          ...props
        }: {
          inline?: boolean;
          className?: string;
          children?: React.ReactNode;
          [key: string]: any;
        }) => {
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <SyntaxHighlighter
              style={dracula}
              PreTag="div"
              language={match[1]}
              className="rounded-lg mb-4"
              {...props}
            >
              {String(codeChildren).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400"
              {...props}
            >
              {codeChildren}
            </code>
          );
        },

        // Pre blocks
        pre: (props) => <pre className="mb-4 overflow-x-auto" {...props} />,

        // Tables
        table: (props) => (
          <table
            className="w-full border-collapse border border-gray-300 dark:border-gray-600 mb-4"
            {...props}
          />
        ),
        th: (props) => (
          <th
            className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left"
            {...props}
          />
        ),
        td: (props) => (
          <td
            className="border border-gray-300 dark:border-gray-600 px-4 py-2"
            {...props}
          />
        ),

        // Horizontal rule
        hr: (props) => (
          <hr
            className="my-6 border-gray-300 dark:border-gray-600"
            {...props}
          />
        ),

        // Strong and emphasis
        strong: (props) => (
          <strong
            className="font-semibold text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        em: (props) => (
          <em className="italic text-gray-800 dark:text-gray-200" {...props} />
        ),
      }}
    >
      {children}
    </Markdown>
  );
}
