import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    // Headings
    h1: ({ children }) => (
      <h1 className="mb-3 mt-4 text-xl font-bold text-foreground">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-2 mt-3 text-lg font-bold text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-3 text-base font-semibold text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-1 mt-2 text-sm font-semibold text-foreground">{children}</h4>
    ),
    // Paragraphs
    p: ({ children }) => (
      <p className="mb-2 leading-relaxed text-foreground">{children}</p>
    ),
    // Strong/Bold
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic text-foreground">{children}</em>
    ),
    // Lists
    ul: ({ children }) => (
      <ul className="mb-3 ml-4 list-disc space-y-1 text-foreground">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-3 ml-4 list-decimal space-y-1 text-foreground">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed text-foreground">{children}</li>
    ),
    // Code
    code: ({ inline, children, ...props }: any) =>
      inline ? (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground" {...props}>
          {children}
        </code>
      ) : (
        <code className="block rounded bg-muted p-3 font-mono text-sm text-foreground" {...props}>
          {children}
        </code>
      ),
    pre: ({ children }) => (
      <pre className="mb-3 overflow-x-auto rounded bg-muted p-3">{children}</pre>
    ),
    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="mb-3 border-l-4 border-primary pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80"
      >
        {children}
      </a>
    ),
    // Horizontal Rule
    hr: () => <hr className="my-4 border-border" />,
    // Tables
    table: ({ children }) => (
      <div className="mb-3 overflow-x-auto">
        <table className="min-w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-border">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2 text-foreground">{children}</td>
    ),
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
