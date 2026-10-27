/**
 * Dominoes: Flowlane's automation as a curving run of twelve dominoes on a
 * plinth, each with its pips and a centre line. At rest the first leans
 * forward, bright, about to go. The pointer tips the domino under it, and the
 * chain falls from there, one after the other, each coming to rest on the
 * next and the last lying flat; the ones before it stand. Leaving stands them
 * all back up. The read-out names the step. The slider is the stagger.
 *
 * The pattern: discrete items on tweens, staggered by distance downstream,
 * picked by the rest pose's face centres, so a falling domino cannot move the
 * pick out from under the pointer.
 */
const {
  Cam, fillet, fit, hull, poly, proj, rad, rings, prism, facing, seg,
  tween, tset, tval, tdone, disposer, mk, place, pointer, put, register, solid,
} = HL;

const N = 12, G = 16, W = 12, H = 26, TK = 4, ZP = 4, XN = (N - 1) * G;
const LEAN0 = 14, FALL = 27, LAST = 74;
// Pip spots for 0 to 6, in steps of the half's grid.
const PIPS = [[], [[0, 0]], [[-1, 1], [1, -1]], [[-1, 1], [0, 0], [1, -1]], [[-1, 1], [1, 1], [-1, -1], [1, -1]],
  [[-1, 1], [1, 1], [0, 0], [-1, -1], [1, -1]], [[-1, 1], [-1, 0], [-1, -1], [1, 1], [1, 0], [1, -1]]];
const SHAPE = fillet([[-W / 2, 0], [W / 2, 0], [W / 2, H], [-W / 2, H]], [1.5, 1.5, 2.5, 2.5]);

/** Domino j's base on an S that always heads toward the viewer, so every face shows, and its heading. */
function spot(j) {
  const w = (2 * Math.PI) / XN, b = 0.32 / w, x = j * G, y = 0.22 * x + b * Math.sin(x * w);
  const dy = 0.22 + b * w * Math.cos(x * w), m = Math.hypot(1, dy);
  return { x, y, t: [1 / m, dy / m], n: [-dy / m, 1 / m] };
}
const SPOTS = Array.from({ length: N }, (_, j) => spot(j));
const Y0 = Math.min(...SPOTS.map((d) => d.y)) - 15, Y1 = Math.max(...SPOTS.map((d) => d.y)) + 15;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  const C = Cam(45, 0.5, 1.5);
  const X1 = XN + 34;
  fit(C, [[-16, Y0, 0], [X1, Y1, 0], [X1, Y0, 0], [-16, Y1, 0], [0, SPOTS[0].y, ZP + H], [XN, SPOTS[N - 1].y, ZP + H]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-16, Y0, X1, Y1, 12, 2);
  put(solid(g), prism(P, front, pr, pi, 0, ZP));

  /** The world point (u across, v up, w into the domino) of domino d leaning th degrees, pivoting on its front foot. */
  const at = (d, th, u, v, w) => {
    const s = Math.sin(rad(th)), c = Math.cos(rad(th));
    const ox = d.x + d.t[0] * TK / 2 + d.n[0] * u, oy = d.y + d.t[1] * TK / 2 + d.n[1] * u;
    const a = v * s + w * c;
    return P(ox + d.t[0] * a, oy + d.t[1] * a, ZP + v * c - w * s);
  };

  const dom = [];
  for (let j = 0; j < N; j++) {
    const d = SPOTS[j], el = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, el), face = mk("path", { class: "nf lo" }, el), mid = mk("path", { class: "nf lo" }, el);
    const spots = [];
    [[(j * 3 + 1) % 7, 0.75], [(j * 2 + 3) % 7, 0.25]].forEach(([c, f]) => {
      for (const [a, b] of PIPS[c]) spots.push({ u: a * 3, v: H * f + b * 3.4, el: mk("circle", { r: 0.95, class: "dot off" }, el) });
    });
    const rest = j === 0 ? LEAN0 : 0;
    dom.push({ ...d, sil, face, mid, spots, rest, a: tween(rest), drawn: NaN });
  }
  dom[0].sil.classList.add("hi");

  function draw(d, th) {
    if (th === d.drawn) return;
    d.drawn = th;
    const fr = SHAPE.map(([u, v]) => at(d, th, u, v, 0)), bk = SHAPE.map(([u, v]) => at(d, th, u, v, -TK));
    d.sil.setAttribute("d", poly(hull(fr.concat(bk))));
    d.face.setAttribute("d", poly(fr));
    d.mid.setAttribute("d", seg(at(d, th, -W / 2 + 2, H / 2, 0), at(d, th, W / 2 - 2, H / 2, 0)));
    for (const s of d.spots) place(s.el, at(d, th, s.u, s.v, 0));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of dom) { draw(d, tval(d.a, now)); if (!tdone(d.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // The pick: the nearest face centre of the rest pose, within reach. It never moves.
  const centres = dom.map((d) => at(d, d.rest, 0, H / 2, 0));
  function hit([x, y]) {
    let best = -1, bd = 26;
    centres.forEach(([cx, cy], j) => { const e = Math.hypot(x - cx, y - cy); if (e < bd) { bd = e; best = j; } });
    return best;
  }

  let act = -1;
  /** Tips domino a and everything after it (-1 stands them all up), spreading out from the one touched. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    dom.forEach((d, j) => {
      const to = a < 0 ? d.rest : j < a ? 0 : j === N - 1 ? LAST : FALL;
      tset(d.a, to, now, Math.abs(j - from) * stag);
      d.sil.classList.toggle("hi", a < 0 ? j === 0 : j === a);
    });
    read.textContent = a < 0 ? "rest" : "step " + String(a + 1).padStart(2, "0");
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "dominoes",
  means: "A run of dominoes: the one under the pointer tips, and every step after it falls in turn.",
  rules: [1, 2, 5, 8],
  range: [30, 60, 110],
  tour: [[126, 115], [183, 153], [249, 188], null],
  mount,
});
