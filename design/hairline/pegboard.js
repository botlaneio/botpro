/**
 * Pegboard: Syncc's week as a desk pegboard. Five day planks of seven hour
 * holes on a low base; a peg stands in every booked hour. At rest
 * the next booking stands proud and bright. The pointer picks an hour: a peg
 * rises into that hole and the pegs booked the same day lift after it, the
 * nearer hours first. The read-out names the slot. The slider is the stagger.
 *
 * The pattern: discrete items (tweens, a stagger by distance) picked on the
 * board's top plane, which never moves, so a rising peg cannot flip the pick.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj,
  tween, tset, tval, tdone, flatDot, mk, place, pointer, put, register, disposer, solid,
} = HL;

const DAYS = ["mon", "tue", "wed", "thu", "fri"];
const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
const ND = 5, NS = 7, CELL = 18, M = 9, BASE = 3, GAP = 1.6, PB = 8, PEG = 9, PR = 3.6, UP = 24, NUDGE = 6;
const X = ND * CELL + M, Y = NS * CELL + M;
// A real week: a few hours booked each day, Wednesday at 14:00 next.
const BOOKED = new Set(["0,0", "0,1", "0,4", "1,2", "1,5", "1,6", "2,0", "2,5", "3,1", "3,3", "4,0"]);
const NEXT = "2,5";

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  // Fitted with the tallest peg at the far corner, so no pick leaves the frame.
  const C = Cam(45, 0.5, 1.86);
  fit(C, [[-M, -M, 0], [X, Y, 0], [X, -M, 0], [-M, Y, 0], [-M, -M, PB + UP], [X, -M, PB + UP]], 200, 170);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // A low base, and on it one plank per day, so the week reads as five columns.
  const [br, bi] = rings(-M, -M, X, Y, 10, 2.2);
  put(solid(g), prism(P, front, br, bi, 0, BASE));
  for (let d = 0; d < ND; d++) {
    const [pr, pi] = rings(d * CELL + GAP, -M + 4, (d + 1) * CELL - GAP, Y - 4, 4, 1.2);
    put(solid(g), prism(P, front, pr, pi, BASE, PB));
  }

  // Holes first, then pegs walking diagonals from the far corner, so painting is back to front.
  const pegs = [], byKey = new Map();
  for (let d = 0; d < ND; d++) for (let s = 0; s < NS; s++) {
    place(flatDot(g, C, 1.25, "dot off"), P((d + 0.5) * CELL, (s + 0.5) * CELL, PB));
  }
  for (let k = 0; k <= ND + NS - 2; k++) for (let d = 0; d < ND; d++) {
    const s = k - d;
    if (s < 0 || s >= NS) continue;
    const key = d + "," + s, cx = (d + 0.5) * CELL, cy = (s + 0.5) * CELL;
    const [ring, inner] = rings(cx - PR, cy - PR, cx + PR, cy + PR, PR, 0.9);
    const rest = key === NEXT ? PEG + 7 : BOOKED.has(key) ? PEG : 0;
    const p = { d, s, key, rest, ring, inner, el: solid(g), z: tween(rest), drawn: NaN };
    pegs.push(p); byKey.set(key, p);
  }
  byKey.get(NEXT).el.sil.classList.add("hi");

  function draw(p, h) {
    if (h === p.drawn) return;
    p.drawn = h;
    if (h < 0.4) { p.el.sil.setAttribute("d", ""); p.el.cr.setAttribute("d", ""); return; }
    put(p.el, prism(P, front, p.ring, p.inner, PB, PB + h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pegs) { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // Picked on the board's top plane: it never moves, whatever the pegs do.
  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, PB);
    const d = Math.floor(wx / CELL), s = Math.floor(wy / CELL);
    return d < 0 || d >= ND || s < 0 || s >= NS ? null : byKey.get(d + "," + s);
  }

  let act = null;
  /** Books the hour under the pointer (null puts the week back). The lift spreads along the day from the hour picked. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a || act;
    act = a;
    for (const p of pegs) {
      let to = p.rest === PEG + 7 ? PEG : p.rest;
      if (!a) to = p.rest;
      else if (p === a) to = UP;
      else if (p.d === a.d && p.rest > 0) to = PEG + NUDGE * clamp(1 - Math.abs(p.s - a.s) / 4, 0, 1);
      const delay = p.d === from.d ? Math.abs(p.s - from.s) * stag : 0;
      tset(p.z, to, now, delay);
      p.el.sil.classList.toggle("hi", a ? p === a : p.key === NEXT);
    }
    read.textContent = a ? DAYS[a.d] + " " + TIMES[a.s] : "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pegboard",
  means: "A week as a pegboard: the hour under the pointer gets a peg, and the day's other bookings lift after it.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 100],
  tour: [[200, 135], [153, 206], [248, 207], null],
  mount,
});
