"use client";
import { BotlaneMark } from "@/components/site/botlane-mark";
import { HouseIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
} from "./ReceiptPrinter";
import { TactileButton } from "./TactileButton";
function Logo() {
  return (
    <BotlaneMark size={24} id="receipt-mark" />
  );
}
export function CheckoutStatus() {
  // Lab: run the stages on a loop, so the print can be seen (the published example holds on "processing").
  const [stage, setStage] = useState<ReceiptPrinterStage>("processing");
  useEffect(() => {
    const next: Record<ReceiptPrinterStage, [ReceiptPrinterStage, number]> = { processing: ["printing", 1800], printing: ["complete", 3200], complete: ["processing", 3500] };
    const [to, ms] = next[stage];
    const t = window.setTimeout(() => setStage(to), ms);
    return () => window.clearTimeout(t);
  }, [stage]);
  return (
    <ReceiptPrinter.Root stage={stage}>
      <ReceiptPrinter.Machine>
        <ReceiptPrinter.Header>
          <Logo />
          <TactileButton depth="shallow" href="/" size="sm">
            <HouseIcon aria-hidden="true" size={13} weight="fill" />
            Home
          </TactileButton>
        </ReceiptPrinter.Header>
        <ReceiptPrinter.Screen>
          {/* Any React DOM can go on the screen. */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p>Pro plan</p>
                <p>Annual subscription</p>
              </div>
              <strong>£230.40</strong>
            </div>
            <ReceiptPrinter.Status />
          </div>
        </ReceiptPrinter.Screen>
      </ReceiptPrinter.Machine>
      <ReceiptPrinter.Output>
        <ReceiptPrinter.Paper>
          {/* Any React DOM can be printed. */}
          <h2>Receipt</h2>
          <hr />
          <dl>
            <div>
              <dt>Total paid</dt>
              <dd>£230.40</dd>
            </div>
          </dl>
          <p>Thanks for your order.</p>
        </ReceiptPrinter.Paper>
      </ReceiptPrinter.Output>
    </ReceiptPrinter.Root>
  );
}