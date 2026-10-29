"use client";
/* Our demo of dqnamo's PlayingCardFan: number cards only, since the court-card artwork lives on his site. */
import { type FanCard, PlayingCardFan } from "./PlayingCardFan";

const HAND: FanCard[] = [
  { id: "7h", rank: "7", suit: "hearts" },
  { id: "9s", rank: "9", suit: "spades" },
  { id: "Ad", rank: "A", suit: "diamonds" },
  { id: "4c", rank: "4", suit: "clubs" },
  { id: "10h", rank: "10", suit: "hearts" },
];

export function PlayingCardsDemo() {
  return <PlayingCardFan cards={HAND} cardWidth={104} />;
}
