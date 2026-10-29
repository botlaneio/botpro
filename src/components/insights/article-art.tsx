import { Stamp } from "@/components/lab/dqnamo/Stamp";

/** Editorial diagrams, not screenshots or measured customer outcomes. */
export function ArticleArt({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const kind = slug.includes("fixed-price")
    ? "scope"
    : slug.includes("cloudflare")
      ? "edge"
      : slug.includes("appointment")
        ? "calendar"
        : slug.includes("requirements")
          ? "intake"
          : slug.includes("cost")
            ? "budget"
            : slug.includes("chatbot")
              ? "compare"
              : slug.includes("after-hours")
                ? "night"
                : slug.includes("fixed-scope")
                  ? "plan"
                  : "local";
  return (
    <div aria-hidden="true" className={`insight-art art-${kind} ${className}`}>
      <div className="art-grid" />
      {kind === "scope" ? (
        <div className="scope-sheet">
          <span className="art-eyebrow">THE PROJECT AGREEMENT</span>
          <div className="scope-title">
            Clarity.
            <br />
            Before code.
          </div>
          <div className="scope-line">
            <span>01 / Deliverables</span>
            <b>✓</b>
          </div>
          <div className="scope-line">
            <span>02 / Timeline</span>
            <b>✓</b>
          </div>
          <div className="scope-line">
            <span>03 / One agreed price</span>
            <b>✓</b>
          </div>
          <span className="sheet-seal">
            FIXED
            <br />
            SCOPE
          </span>
        </div>
      ) : kind === "edge" ? (
        <svg viewBox="0 0 480 270" fill="none">
          <g stroke="currentColor" opacity=".22">
            {[70, 105, 140, 175, 210].map((y) => (
              <path key={y} d={`M0 ${y} Q240 ${270 - y},480 ${y}`} />
            ))}
            {[70, 150, 240, 330, 410].map((x) => (
              <ellipse
                key={x}
                cx="240"
                cy="135"
                rx={Math.abs(x - 240) + 20}
                ry="108"
              />
            ))}
          </g>
          <g className="art-light" fill="currentColor">
            {[
              [84, 117],
              [155, 79],
              [302, 86],
              [365, 166],
              [180, 196],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="4" />
            ))}
          </g>
          <rect
            x="184"
            y="101"
            width="112"
            height="68"
            rx="12"
            className="art-node"
          />
          <text
            x="240"
            y="132"
            textAnchor="middle"
            fill="currentColor"
            fontSize="13"
          >
            BOTLANE
          </text>
          <text
            x="240"
            y="150"
            textAnchor="middle"
            fill="currentColor"
            fontSize="9"
            opacity=".5"
          >
            AT THE EDGE
          </text>
        </svg>
      ) : kind === "calendar" ? (
        <div className="calendar-art">
          <div className="calendar-head">
            <span>BOOKING FLOW</span>
            <span>↗</span>
          </div>
          <div className="calendar-days">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
            {Array.from({ length: 21 }, (_, i) => (
              <span className={i === 10 ? "chosen-day" : ""} key={i + 7}>
                {i + 1 === 11 ? "✓" : i + 1}
              </span>
            ))}
          </div>
          <span className="calendar-confirm">
            Enquiry → availability → confirmation
          </span>
        </div>
      ) : kind === "intake" ? (
        <div className="intake-art">
          <span className="art-eyebrow">A BETTER FIRST QUESTION</span>
          {[
            "What do you need?",
            "When do you need it?",
            "Who should take it from here?",
          ].map((s, i) => (
            <div key={s}>
              <span>0{i + 1}</span>
              {s}
              <b>↗</b>
            </div>
          ))}
        </div>
      ) : kind === "budget" ? (
        <div className="budget-art">
          <span className="art-eyebrow">THE WHOLE PICTURE</span>
          <div className="budget-stack">
            <span>Build</span>
            <span>Hosting & tools</span>
            <span>Care & changes</span>
          </div>
          <span className="art-caption">Plan beyond launch day.</span>
        </div>
      ) : kind === "compare" ? (
        <div className="compare-art">
          <div>
            <span className="art-eyebrow">A FORM</span>
            <span className="form-line" />
            <span className="form-line" />
            <span className="form-line short" />
          </div>
          <span className="compare-vs">/</span>
          <div>
            <span className="art-eyebrow">A CONVERSATION</span>
            <span className="chat-line">How can we help?</span>
            <span className="chat-line reply">Let’s find a time.</span>
          </div>
        </div>
      ) : kind === "night" ? (
        <div className="night-art">
          <div className="night-clock">
            23<span>:</span>48
          </div>
          <span className="night-message">
            <i /> A new enquiry. After closing time.
          </span>
          <span className="art-caption">
            The next step shouldn’t wait until morning.
          </span>
        </div>
      ) : kind === "plan" ? (
        <div className="stamp-art">
          <Stamp
            paper="var(--neutral-4)"
            ink="var(--foreground)"
            className="scope-stamp"
            padding={22}
          >
            <div className="stamp-body">
              <span className="art-eyebrow">STUDIO FIELD NOTES</span>
              <span className="stamp-number">01—03</span>
              <span>
                Scope.
                <br />
                Review.
                <br />
                Launch.
              </span>
              <span className="stamp-footer">BOTLANE / BUILD WITH CLARITY</span>
            </div>
          </Stamp>
        </div>
      ) : (
        <svg viewBox="0 0 480 270" fill="none">
          <g stroke="currentColor" opacity=".18">
            {[0, 80, 160, 240, 320, 400, 480].map((x) => (
              <path key={x} d={`M${x} 0 L${x - 80} 270`} />
            ))}
            {[40, 100, 160, 220].map((y) => (
              <path key={y} d={`M0 ${y} L480 ${y + 28}`} />
            ))}
          </g>
          <circle
            cx="252"
            cy="126"
            r="65"
            stroke="currentColor"
            opacity=".16"
          />
          <circle
            cx="252"
            cy="126"
            r="100"
            stroke="currentColor"
            opacity=".08"
          />
          <path
            d="M252 159s30-25 30-48a30 30 0 0 0-60 0c0 23 30 48 30 48Z"
            className="art-node"
            stroke="currentColor"
          />
          <circle cx="252" cy="111" r="10" stroke="currentColor" />
          <rect
            x="174"
            y="183"
            width="156"
            height="27"
            rx="13.5"
            className="art-node"
          />
          <text
            x="252"
            y="201"
            textAnchor="middle"
            fill="currentColor"
            fontSize="11"
          >
            BE FOUND. BE CHOSEN.
          </text>
        </svg>
      )}
    </div>
  );
}
