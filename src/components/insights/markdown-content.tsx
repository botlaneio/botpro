import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { anchor } from "@/lib/insights"

/** Render imported Markdown with the existing Insights typography. Raw HTML stays disabled. */
export function MarkdownContent({ text }: { text: string }) {
  return (
    <div className="grid min-w-0 gap-6 text-[17px] leading-[1.75] text-foreground/85">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{
        p: ({ children }) => <p className="text-pretty">{children}</p>,
        h3: ({ children }) => <h3 id={anchor(String(children))} className="mt-3 scroll-mt-[calc(var(--header-h)+2rem)] text-xl font-medium tracking-tight text-foreground">{children}</h3>,
        ul: ({ children }) => <ul className="grid list-disc gap-2.5 pl-6 marker:text-foreground/55">{children}</ul>,
        ol: ({ children }) => <ol className="grid list-decimal gap-2.5 pl-6 marker:text-foreground/65">{children}</ol>,
        li: ({ children }) => <li className="pl-1 [&>p+p]:mt-3 [&>ul]:mt-3 [&>ol]:mt-3">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        blockquote: ({ children }) => <blockquote className="my-2 border-l-2 border-(--brand) py-1 pl-6 text-xl leading-relaxed font-medium text-foreground">{children}</blockquote>,
        a: ({ href, children }) => {
          const external = /^https?:\/\//.test(href ?? "") && !/^https:\/\/(www\.)?botlane\.io(?:\/|$)/.test(href ?? "")
          return <a href={href} rel={external ? "noopener noreferrer" : undefined} className="rounded-sm text-foreground underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4">{children}</a>
        },
        table: ({ children }) => <div className="min-w-0 overflow-x-auto rounded-xl border border-border/70" role="region" aria-label="Article comparison table" tabIndex={0}><table className="w-full min-w-[36rem] border-collapse text-left text-sm leading-relaxed">{children}</table></div>,
        th: ({ children }) => <th scope="col" className="border-b border-border bg-foreground/[0.04] px-4 py-3 align-top font-medium text-foreground">{children}</th>,
        td: ({ children }) => <td className="border-b border-border/60 px-4 py-3 align-top last:border-r-0">{children}</td>,
        code: ({ children }) => <code className="rounded bg-foreground/[0.06] px-1 py-0.5 font-mono text-[0.9em]">{children}</code>,
      }}>{text}</ReactMarkdown>
    </div>
  )
}
