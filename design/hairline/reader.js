/**
 * Reader: Scriblane parsing a document. A stack of pages lies on a flatbed
 * between two rails; a reading bar rides the rails on two posts. The pointer
 * is projected onto the page and the bar follows it on a spring; the printed
 * lines near the bar rise out of the sheet, the nearest most, as if pulled
 * off the page. At rest the bar sits a third of the way down with its slit
 * bright. The read-out names the line under the bar. The slider is the reach.
 *
 * The pattern: a continuous field. A spring for the bar, a spring per line, a
 * falloff by distance, and a pick on the page's plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, open, prism, proj, rings, ringAt, run, seg, unproj,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const W = 120, L = 150, ZT = 10, LMAX = 16, ZB = ZT + LMAX + 7, BAR = 9;
// Line lengths make paragraphs: a heading, then three blocks with short last lines.
const LENS = [62, 0, 100, 96, 100, 58, 0, 98, 100, 92, 44, 0, 100, 70];
const REST = 52;

/** The share of full lift at u reaches from the bar: 1 → .31 at 42% → 0 at the edge. */
const falloff = (u) => (u <= 0.42 ? 1 - (u / 0.42) * 0.69 : u <= 1 ? 0.31 * (1 - (u - 0.42) / 0.58) : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value;

  const C = Cam(45, 0.5, 1.32);
  fit(C, [[-16, -14, 0], [W + 16, L + 14, 0], [W + 16, -14, 0], [-16, L + 14, 0], [-16, -14, ZB + 6], [W + 16, -14, ZB + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The flatbed, its two rails, and the stack of pages with a second line for its thickness.
  const [fr, fi] = rings(-16, -14, W + 16, L + 14, 9, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 6));
  for (const x of [-13, W + 6]) {
    const [rr, ri] = rings(x, -10, x + 7, L + 10, 3, 1);
    put(solid(g), prism(P, front, rr, ri, 6, 9));
  }
  const [pr, pi] = rings(0, 0, W, L, 3, 1.4);
  put(solid(g), prism(P, front, pr, pi, 6, ZT));
  mk("path", { d: open(ringAt(P, run(pr, front), 8)), class: "nf lo" }, g);

  // The printed lines, far to near; a gap in LENS is a paragraph break.
  const lines = [];
  LENS.forEach((len, j) => {
    if (!len) return;
    const y = 12 + j * 9.5, [ring, inner] = rings(10, y - 2.2, 10 + len, y + 2.2, 1.6, 0.6);
    const el = solid(g);
    lines.push({ n: lines.length + 1, y, ring, inner, g: el.g, el, sp: spring(0, { eps: 0.03 }), drawn: NaN });
  });

  // The bar and its posts, as one group that moves through the paint order as it travels.
  const barG = mk("g", {}, g);
  const posts = [solid(barG), solid(barG)], bar = solid(barG);
  const slit = mk("path", { class: "nf hi" }, barG);
  const by = spring(REST);

  function drawBar(y) {
    [[-12, -6], [W + 7, W + 12]].forEach(([x0, x1], k) => {
      const [r0, i0] = rings(x0, y - 3, x1, y + 3, 2.5, 0.8);
      put(posts[k], prism(P, front, r0, i0, 9, ZB));
    });
    const [br, bi] = rings(-14, y - BAR / 2, W + 14, y + BAR / 2, 3.5, 1.2);
    put(bar, prism(P, front, br, bi, ZB, ZB + 6));
    slit.setAttribute("d", seg(P(-6, y + BAR / 2, ZB + 2.2), P(W + 6, y + BAR / 2, ZB + 2.2)));
    // Painted after the lines behind it and before the lines in front of it.
    const behind = lines.filter((l) => l.y <= y + BAR / 2);
    if (behind.length) behind[behind.length - 1].g.after(barG);
    else lines[0].g.before(barG);
  }

  let drawnBar = NaN, act = null;
  const nearest = (y) => lines.reduce((a, b) => (Math.abs(b.y - y) < Math.abs(a.y - y) ? b : a));

  const B = register(stage, (dt) => {
    let m = stepS(by, dt);
    if (by.x !== drawnBar) { drawnBar = by.x; drawBar(by.x); }
    for (const l of lines) {
      l.sp.t = LMAX * falloff(Math.abs(l.y - by.x) / R);
      if (stepS(l.sp, dt)) m = true;
      const h = l.sp.x;
      // A line is a ridge printed on the sheet: lifting it raises its top, so its sides show how far.
      if (h !== l.drawn) { l.drawn = h; put(l.el, prism(P, front, l.ring, l.inner, ZT, ZT + 0.8 + h)); }
    }
    return m;
  });
  bag.add(B.unregister);

  /** Sends the bar to world y (null sends it home); the line nearest the bar's target takes the bright edge. */
  function aim(y) {
    by.t = y === null ? REST : clamp(y, 8, L - 8);
    const now = y === null ? null : nearest(by.t);
    if (now !== act) {
      if (act) act.el.sil.classList.remove("hi");
      if (now) now.el.sil.classList.add("hi");
      slit.classList.toggle("hi", !now);
      act = now;
    }
    read.textContent = now ? "line " + String(now.n).padStart(2, "0") : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [wx, wy] = unproj(C, sx, sy, ZT);
      aim(wx < -20 || wx > W + 20 || wy < -16 || wy > L + 16 ? null : wy);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "reader",
  means: "A reading bar rides over a document; the lines under it rise off the page, the nearest most.",
  rules: [1, 3, 5, 6],
  range: [10, 18, 30],
  tour: [[243, 158], [200, 179], [154, 202], null],
  mount,
});
