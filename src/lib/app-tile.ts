/**
 * Colours for an app logo in a `tile-app` container (materials.css): --c is the logo's own colour, used for the
 * faint wash and glow and for the logo once lit; --c-ink is what the lit logo is drawn in, the page's text
 * colour for near-black marks, which would vanish on a dark tile.
 */
export function appTile(hex: string): React.CSSProperties {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const dark = 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18
  return { ["--c" as string]: dark ? "var(--foreground)" : `#${hex}`, ["--c-ink" as string]: dark ? "var(--foreground)" : `#${hex}` }
}
