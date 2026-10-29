"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  GitBranch,
  Mail,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { HOME_PRODUCTS } from "@/lib/home-copy";
import { LANES, type LaneId } from "@/lib/lanes";
import "./product-worlds.css";

const ICONS = { syncc: CalendarDays, scriblane: FileText, flowlane: Workflow };
const SUBTITLES = {
  syncc: "Make room for a good conversation.",
  scriblane: "A little less paperwork. A lot more clarity.",
  flowlane: "Let the next step take care of itself.",
};

function BookingScene() {
  const [selected, setSelected] = useState("10:00");
  return (
    <div className="world-booking">
      <div className="world-window-bar">
        <span className="world-window-dot" />
        <span>syncc / your booking page</span>
        <span>
          <ShieldCheck size={12} /> Your domain. Your experience.
        </span>
      </div>
      <div className="booking-layout">
        <div className="booking-profile">
          <div className="world-avatar">
            BL
            <span />
          </div>
          <span className="world-small-label">BOTLANE STUDIO</span>
          <h4>
            A good place
            <br />
            to begin.
          </h4>
          <p>A short conversation about what you have in mind.</p>
          <span className="booking-duration">
            <CalendarDays size={13} /> 30 minutes · Google Meet
          </span>
        </div>
        <div className="booking-calendar">
          <div className="booking-month">
            <strong>October 2026</strong>
            <span>
              <ChevronLeft size={14} />
              <ChevronRight size={14} />
            </span>
          </div>
          <div className="booking-days">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span className="day-label" key={`d${i}`}>
                {d}
              </span>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const d = i - 2;
              return (
                <span
                  key={i}
                  className={`${d === 29 ? "picked-day" : ""} ${d < 1 || d > 31 ? "empty-day" : ""}`}
                >
                  {d > 0 && d <= 31 ? d : ""}
                </span>
              );
            })}
          </div>
          <span className="booking-timezone">
            Times shown in your local timezone
          </span>
        </div>
        <div className="booking-times">
          <span className="world-small-label">THURSDAY, OCT 29</span>
          {["09:00", "10:00", "11:30", "14:00"].map((time) => (
            <button
              key={time}
              type="button"
              aria-pressed={selected === time}
              onClick={() => setSelected(time)}
            >
              {time}
              {selected === time && <Check size={13} />}
            </button>
          ))}
          <span className="booking-time-hint" role="status">
            {selected} selected
          </span>
        </div>
      </div>
    </div>
  );
}

function DocumentScene() {
  return (
    <div className="world-documents">
      <div className="document-paper">
        <div className="document-heading">
          <span className="invoice-symbol">
            <FileText size={20} />
          </span>
          <span>
            INVOICE
            <br />
            <small>INV-0042</small>
          </span>
        </div>
        <span className="world-small-label">NORTHWIND STUDIO</span>
        <div className="document-lines">
          <i />
          <i />
          <i />
        </div>
        <div className="invoice-table">
          <span>Description</span>
          <span>Amount</span>
          <span>Design services</span>
          <span>$2,400.00</span>
          <span>Tax</span>
          <span>$296.00</span>
          <strong>Total</strong>
          <strong>$2,696.00</strong>
        </div>
        <span className="paper-scan" aria-hidden="true" />
        <div className="paper-corner" />
      </div>
      <div className="extracted-panel">
        <div className="extracted-heading">
          <span className="world-panel-icon">
            <Sparkles size={15} />
          </span>
          <span>Details, extracted.</span>
          <span className="extracted-file">INVOICE · PAGE 1</span>
        </div>
        <div className="extracted-columns">
          <span>FIELD</span>
          <span>VALUE</span>
          <span>CONFIDENCE</span>
        </div>
        {[
          ["Vendor", "Northwind Studio", "92%"],
          ["Invoice", "INV-0042", "98%"],
          ["Total", "$2,696.00", "95%"],
        ].map(([label, value, confidence]) => (
          <div className="extracted-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <span className="confidence">
              <i />
              {confidence}
            </span>
          </div>
        ))}
        <div className="extracted-check">
          <ShieldCheck size={17} />
          <div>
            <strong>The numbers add up.</strong>
            <span>Line items + tax = invoice total</span>
          </div>
          <CheckCheck size={18} />
        </div>
      </div>
    </div>
  );
}

function FlowScene() {
  return (
    <div className="world-flow">
      <div className="flow-canvas-header">
        <span>
          <GitBranch size={15} /> From enquiry to follow-up
        </span>
        <span className="flow-draft">ILLUSTRATIVE WORKFLOW</span>
      </div>
      <div className="flow-diagram">
        <div className="flow-node flow-trigger">
          <span className="flow-app-icon">
            <Mail size={20} />
          </span>
          <div>
            <small>TRIGGER</small>
            <strong>New enquiry</strong>
            <span>Start with the message.</span>
          </div>
          <span className="flow-step-number">01</span>
        </div>
        <span className="flow-connector">
          <i />
        </span>
        <div className="flow-node">
          <span className="flow-app-icon violet">
            <Plus size={20} />
          </span>
          <div>
            <small>ACTION</small>
            <strong>Create contact</strong>
            <span>Keep the details together.</span>
          </div>
          <span className="flow-step-number">02</span>
        </div>
        <span className="flow-connector">
          <i />
        </span>
        <div className="flow-node">
          <span className="flow-app-icon coral">
            <MessageSquare size={19} />
          </span>
          <div>
            <small>NEXT STEP</small>
            <strong>Queue follow-up</strong>
            <span>Keep the conversation moving.</span>
          </div>
          <span className="flow-step-number">03</span>
        </div>
      </div>
      <span className="flow-note">
        <Sparkles size={12} /> Your tools. A clearer way between them.
      </span>
    </div>
  );
}

export function ProductWorlds() {
  const [active, setActive] = useState<LaneId>("syncc");
  const tabs = useRef<HTMLDivElement>(null);
  const lane = LANES.find((l) => l.id === active)!;
  const copy = HOME_PRODUCTS[active];
  const Icon = ICONS[active];
  function keyboard(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % LANES.length;
    else if (e.key === "ArrowLeft")
      next = (index + LANES.length - 1) % LANES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = LANES.length - 1;
    else return;
    e.preventDefault();
    setActive(LANES[next].id);
    tabs.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }
  return (
    <div id="product-explorer" className={`product-worlds ${lane.scope}`}>
      <div
        className="world-tabs"
        role="tablist"
        aria-label="Explore Botlane products"
        ref={tabs}
      >
        {LANES.map((l, i) => {
          const TabIcon = ICONS[l.id];
          return (
            <button
              type="button"
              role="tab"
              className={l.scope}
              id={`world-tab-${l.id}`}
              aria-controls={`world-panel-${l.id}`}
              aria-selected={active === l.id}
              tabIndex={active === l.id ? 0 : -1}
              key={l.id}
              onClick={() => setActive(l.id)}
              onKeyDown={(e) => keyboard(e, i)}
            >
              <TabIcon size={17} />
              <span>{l.name}</span>
              {l.status === "soon" ? (
                <small>SOON</small>
              ) : (
                <span className="world-tab-dot" />
              )}
            </button>
          );
        })}
        <span className="world-tab-aside">
          SOFTWARE, WITH A LITTLE MORE CARE.
        </span>
      </div>
      {LANES.map((l) => (
        <section
          key={l.id}
          role="tabpanel"
          id={`world-panel-${l.id}`}
          aria-labelledby={`world-tab-${l.id}`}
          hidden={active !== l.id}
          className="world-panel"
        >
          {active === l.id && (
            <>
              <div className={`world-landscape world-${active}`}>
                <div className="world-scene-topline">
                  <span>
                    <span className="world-scene-dot" /> {SUBTITLES[active]}
                  </span>
                  <span>
                    PRODUCT EXPLORER /{" "}
                    {active === "syncc"
                      ? "01"
                      : active === "scriblane"
                        ? "02"
                        : "03"}
                  </span>
                </div>
                <div className="world-scene-body">
                  {active === "syncc" ? (
                    <BookingScene />
                  ) : active === "scriblane" ? (
                    <DocumentScene />
                  ) : (
                    <FlowScene />
                  )}
                </div>
                <div className="world-scene-bottom">
                  <span>DESIGNED & BUILT BY BOTLANE</span>
                  <span>
                    {active === "syncc"
                      ? "Interactive preview · select a time"
                      : "Illustrative product preview"}
                  </span>
                </div>
              </div>
              <div className="world-description">
                <div className="world-description-title">
                  <span className="world-product-icon">
                    <Icon size={22} />
                  </span>
                  <span>
                    <small>
                      {lane.status === "soon"
                        ? "IN THE WORKS"
                        : "MADE BY BOTLANE"}
                    </small>
                    <h3>{lane.name}</h3>
                  </span>
                </div>
                <div className="world-description-copy">
                  <h4>{copy.headline}</h4>
                  <p>{copy.description}</p>
                </div>
                <div className="world-description-action">
                  <ul>
                    {copy.features.map((f) => (
                      <li key={f}>
                        <Check size={13} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/products/${active}`}>
                    Explore {lane.name}
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>
      ))}
      <div className="world-footer">
        <span>Thoughtfully made. Ready for your everyday.</span>
        <Link href="/products">
          Meet the products <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
