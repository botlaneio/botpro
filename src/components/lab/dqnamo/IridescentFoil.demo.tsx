"use client";
/* Our demo of dqnamo's IridescentFoil: a silver Founding Ten badge. Move the pointer or scroll to tilt the light. */
import { BotlaneMark } from "@/components/site/botlane-mark";

import { IridescentFoil } from "./IridescentFoil";

export function IridescentFoilDemo() {
  return (
    <IridescentFoil className="h-44 w-72 rounded-2xl">
      <div className="flex h-full flex-col justify-between p-5 text-grayscale-12">
        <span className="flex items-center justify-between">
          <BotlaneMark size={26} id="foil-mark" />
          <span className="font-mono text-[10px] tracking-[0.12em] text-grayscale-11">FOUNDING TEN</span>
        </span>
        <span className="grid gap-1">
          <span className="text-4xl font-medium tracking-[-0.04em]">20% off</span>
          <span className="text-[12px] text-grayscale-11">For our first ten clients, until 31 March 2027.</span>
        </span>
      </div>
    </IridescentFoil>
  );
}
