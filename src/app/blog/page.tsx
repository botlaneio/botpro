import type { Metadata } from "next";
import { InsightsIndex } from "@/components/insights/insights-index";
import { SiteFooter, SiteHeader } from "@/components/site/site-header";
import { formatDate, postsByDate, readingMinutes } from "@/lib/insights";
import "@/components/insights/publication.css";

export const metadata: Metadata = {
  title: "Insights · Botlane",
  description:
    "Practical notes on websites, booking, automation, and the work behind them.",
};
export default function Blog() {
  const all = postsByDate();
  const posts = all.map((p) => ({
    slug: p.slug,
    title: p.title,
    dek: p.dek,
    topic: p.topic,
    date: formatDate(p.date),
    minutes: readingMinutes(p),
    cover: p.cover,
  }));
  return (
    <>
      <SiteHeader />
      <main className="publication-page">
        <header className="publication-masthead">
          <div>
            <span className="publication-kicker">
              <i aria-hidden="true" /> INSIGHTS / THE BOTLANE JOURNAL
            </span>
            <h1>
              Thought through.
              <br />
              <span>Written down.</span>
            </h1>
          </div>
          <div className="publication-intro">
            <p>
              Ideas, decisions, and practical guides.
              <br /> From the people doing the building.
            </p>
            <span>
              {all.length} NOTES · {new Set(all.map((p) => p.topic)).size}{" "}
              TOPICS
            </span>
          </div>
        </header>
        <section aria-label="Notes">
          <InsightsIndex posts={posts} />
        </section>
        <div className="publication-colophon">
          <span>INDEPENDENT THINKING. PRACTICAL WORK.</span>
          <span>BY THE BOTLANE STUDIO</span>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
