"use client";
/*
 * Stand-ins for pieces of dqnamo's site that aren't published alongside the experiments: his own Button and
 * ticket pattern. Plain, so the experiments render; not his designs.
 */
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg border border-grayscale-5 bg-grayscale-1 px-3 text-[13px] font-medium text-grayscale-12 shadow-[0_1px_2px_rgb(0_0_0/0.06)] hover:bg-grayscale-2", className)} />;
}

export function TicketPattern({ ink = "#111" }: { ink?: string }) {
  return (
    <svg aria-hidden="true" className="absolute inset-0 size-full opacity-[0.12]" preserveAspectRatio="none">
      <defs>
        <pattern id="ticket-lines" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={ink} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ticket-lines)" />
    </svg>
  );
}
