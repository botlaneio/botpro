"use client";
import { CheckCircleIcon, CopyIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { DynamicButton } from "./DynamicButton";
export function DynamicButtonExample() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  const Icon = copied ? CheckCircleIcon : CopyIcon;
  function handleCopy() {
    setCopied(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 1200);
  }
  return (
    <DynamicButton
      icon={
        <Icon
          aria-hidden="true"
          className={copied ? "text-green-9" : undefined}
          size={15}
          weight={copied ? "fill" : "bold"}
        />
      }
      onClick={handleCopy}
      stateKey={copied ? "copied" : "copy"}
      type="button"
    >
      Copy invite link
    </DynamicButton>
  );
}