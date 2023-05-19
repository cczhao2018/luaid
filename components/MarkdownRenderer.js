import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const MarkdownRenderer = ({ content }) => {
  const renderers = {
    code: ({ language, value }) => {
      return <SyntaxHighlighter language={language} children={value} />;
    },
  };

  return <ReactMarkdown components={renderers}>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;
