"use client";
/* A stand-in for dqnamo's TactileButton, whose source isn't published: a plain dark button, or link with href. */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = { children?: ReactNode; className?: string; href?: string; size?: "sm" | "md"; depth?: string; onClick?: () => void; type?: "button" | "submit" };

export function TactileButton({ className, href, children, onClick, type = "button" }: Props) {
  const cls = cn("inline-flex h-10 items-center gap-2 rounded-xl bg-grayscale-12 px-4 text-[13px] font-medium text-grayscale-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_2px_0_rgb(0_0_0/0.4)] active:translate-y-px", className);
  return href ? <a href={href} className={cls}>{children}</a> : <button type={type} onClick={onClick} className={cls}>{children}</button>;
}
