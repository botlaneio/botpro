"use client";
import { Signature } from "./Signature";
export function MySignature() {
  return (
    <div className="w-64 text-grayscale-12">
      <Signature
        path="M60 200 Q180 60 300 180 T540 180 Q660 260 780 140 T940 180"
        viewBox="0 0 1000 320"
        duration={1.4}
        strokeWidth={7}
      />
    </div>
  );
}