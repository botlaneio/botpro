"use client";
import { ScrollFadeList } from "./ScrollFadeList";
const teams = [
  { code: "za", flag: "🇿🇦", name: "South Africa" },
  { code: "ca", flag: "🇨🇦", name: "Canada" },
  { code: "br", flag: "🇧🇷", name: "Brazil" },
];
export function Example() {
  return (
    <ScrollFadeList
      getKey={(team) => team.code}
      items={teams}
      renderItem={(team) => (
        <span className="flex items-center gap-2">
          <span aria-hidden="true">{team.flag}</span>
          <span>{team.name}</span>
        </span>
      )}
    />
  );
}