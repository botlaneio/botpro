/**
 * Sections: a Buildlane page under construction. A browser window lies flat,
 * its title bar carrying three lights and an address field; on it the page is
 * laid as slabs from the top down: nav, hero, a row of three feature cards, a
 * call to action and a footer, each with the marks that make it that section.
 * At rest the page is slightly apart, the hero still being placed and bright.
 * The pointer picks a section; it lifts out of the page like a block being
 * set, its neighbours lifting less, staggered from it. The read-out names the
 * section. The slider is the lift.
 *
 * The pattern: discrete items on tweens, staggered by distance, picked on each
 * section's own resting top so a raised slab never moves the pick.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, ringAt, rings, rrect, seg, unproj,
  tween, tset, tval, tdone, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const WX = 130, WY = 134, ZB = 5, STAG = 45;
// Each section: its name, its band down the page, its thickness, its rest lift, its blocks along x, and its marks.
const btn = (x0, y0, x1, y1) => ({ ring: rrect(x0, y0, x1, y1, Math.min(2.5, (y1 - y0) / 2), 4) });
const SECTIONS = [
  { name: "nav", y0: 20, y1: 28, t: 3, rest: 2, blocks: [[6, 124]],
    marks: [btn(10, 22.5, 22, 25.5), [70, 24, 80, 24], [84, 24, 94, 24], [98, 24, 106, 24], btn(110, 22, 120, 26)] },
  { name: "hero", y0: 32, y1: 66, t: 6, rest: 9, blocks: [[6, 124]],
    marks: [[16, 41, 96, 41], [16, 47, 78, 47], [16, 53, 60, 53], btn(16, 57, 38, 62), btn(42, 57, 62, 62)] },
  { name: "features", y0: 70, y1: 92, t: 5, rest: 4, blocks: [[6, 44], [46, 84], [86, 124]],
    marks: [[11, 80, 36, 80], [11, 85, 30, 85], [51, 80, 76, 80], [51, 85, 70, 85], [91, 80, 116, 80], [91, 85, 110, 85]] },
  { name: "cta", y0: 96, y1: 110, t: 4, rest: 1, blocks: [[6, 124]],
    marks: [[40, 101, 90, 101], btn(52, 104, 78, 108)] },
  { name: "footer", y0: 114, y1: 128, t: 3, rest: 0, blocks: [[6, 124]],
    marks: [[14, 119, 30, 119], [14, 123, 26, 123], [44, 119, 60, 119], [44, 123, 56, 123], [74, 119, 90, 119], [104, 119, 118, 119]] },
];
const HERO = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, 0, 0], [WX, WY, 0], [WX, 0, 0], [0, WY, 0], [0, 0, ZB + 30], [WX, 0, ZB + 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The window: its body, then the title bar with three lights and the address field.
  const [wr, wi] = rings(0, 0, WX, WY, 8, 2);
  put(solid(g), prism(P, front, wr, wi, 0, ZB));
  const [tr, ti] = rings(4, 4, WX - 4, 15, 3, 1);
  put(solid(g), prism(P, front, tr, ti, ZB, ZB + 2));
  for (const x of [10, 15, 20]) place(flatDot(g, C, 1.3, "dot off"), P(x, 9.5, ZB + 2));
  mk("path", { d: poly(ringAt(P, rrect(32, 7, WX - 32, 12, 2.5, 4), ZB + 2)), class: "nf lo" }, g);

  const secs = SECTIONS.map((s) => {
    const el = mk("g", {}, g);
    const blocks = s.blocks.map(([x0, x1]) => ({ rr: rings(x0, s.y0, x1, s.y1, 3, 1.1), el: solid(el) }));
    const marks = mk("path", { class: "nf lo" }, el);
    return { ...s, blocks, marksEl: marks, z: tween(s.rest), drawn: NaN };
  });
  secs[HERO].blocks.forEach((b) => b.el.sil.classList.add("hi"));

  function draw(s, h) {
    if (h === s.drawn) return;
    s.drawn = h;
    const z0 = ZB + h, z1 = z0 + s.t;
    for (const b of s.blocks) put(b.el, prism(P, front, b.rr[0], b.rr[1], z0, z1));
    s.marksEl.setAttribute("d", s.marks.map((m) => (m.ring ? poly(ringAt(P, m.ring, z1)) : seg(P(m[0], m[1], z1), P(m[2], m[3], z1)))).join(""));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of secs) { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // The pick: the pointer on each section's resting top; the section that holds it nearest its middle wins.
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    secs.forEach((s, i) => {
      const [wx, wy] = unproj(C, sx, sy, ZB + s.rest + s.t);
      if (wx < 2 || wx > WX - 2 || wy < s.y0 - 2 || wy > s.y1 + 2) return;
      const e = Math.abs(wy - (s.y0 + s.y1) / 2) / (s.y1 - s.y0);
      if (e < bd) { bd = e; best = i; }
    });
    return best;
  }

  let act = -1;
  /** Lifts section a out of the page (-1 lays the page back), spreading out from it. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    secs.forEach((s, i) => {
      const to = a < 0 ? s.rest : i === a ? lift : lift * 0.3 * clamp(1 - Math.abs(i - a) / 2, 0, 1);
      tset(s.z, to, now, Math.abs(i - from) * STAG);
      s.blocks.forEach((b) => b.el.sil.classList.toggle("hi", a < 0 ? i === HERO : i === a));
    });
    read.textContent = a < 0 ? "rest" : secs[a].name;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; if (act >= 0) { const a = act; act = -1; setActive(a); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "sections",
  means: "A web page laid as slabs in a browser window: the section under the pointer lifts out, its neighbours less.",
  rules: [1, 2, 5, 9],
  range: [10, 18, 28],
  tour: [[218, 156], [183, 184], [134, 217], null],
  mount,
});
