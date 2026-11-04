/*
 * Lane orb: Botlane's intelligence orchestrator, shown as an orb of particles instead of a chatbot.
 * Framework-free ES module. Mount once per page (in Next.js: once in app/layout.tsx).
 *
 *   import { createLaneOrb } from './engine';
 *   const orb = createLaneOrb({
 *     agentId: 'agent_…',
 *     loadConversation: () => import('@elevenlabs/client').then(m => m.Conversation),
 *     navigate: (path) => router.push(path),       // optional
 *     isHome: () => location.pathname === '/',     // optional
 *   });
 *   orb.destroy();
 */

const DEFAULT_SECTIONS = {
  top: () => document.querySelector('main') || document.body,
  brief: () => document.getElementById('brief'),
  build: () => document.getElementById('build'),
  stack: () => document.getElementById('stack'),
  products: () => document.getElementById('products'),
  process: () => document.getElementById('process'),
  start: () => [...document.querySelectorAll('section')].find((s) => /make it happen/i.test(s.textContent || '')),
};
const SECTION_NAMES = { top: 'top of the page', brief: 'brief', build: 'services and prices', stack: 'integrations', products: 'products', process: 'process', start: 'start a project' };
const GREETING = "Hi, I'm Lane. I can walk you through what Botlane builds, what it costs, or help you work out where to start.";
const CHIPS = ['What would a website cost?', 'How do you work?', 'I need a web app', 'Start a project'];

const CSS = `
:host { all: initial; }
* { box-sizing: border-box; }
.root { --brand: #4f7bff; --ink: #edeef0; --muted: rgba(237,238,240,.62); --faint: rgba(237,238,240,.4); --card: rgba(20,22,26,.86); --card-solid: #16181c; --edge: rgba(255,255,255,.09); --chip: rgba(255,255,255,.05); --chip-hover: rgba(255,255,255,.1); --user: rgba(255,255,255,.08);
  --p-top: #ffffff; --p-bot: #e3e4e8; --p-ink: #0b0c0e; --l-top: #22252b; --l-bot: #0f1013; --l-edge: rgba(255,255,255,.12); --shadow: 0 1px 1px rgba(0,0,0,.12), 0 30px 60px -24px rgba(0,0,0,.7); --spot: rgba(79,123,255,.55);
  font: 400 14px/1.45 inter, "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--ink); -webkit-font-smoothing: antialiased; }
.root.light { --brand: #2f55f0; --ink: #16181c; --muted: #5d636e; --faint: #868c97; --card: rgba(255,255,255,.9); --card-solid: #fff; --edge: rgba(16,24,40,.09); --chip: #f2f3f5; --chip-hover: #e8e9ec; --user: #f0f1f3;
  --p-top: #30333a; --p-bot: #16181c; --p-ink: #fff; --l-top: #ffffff; --l-bot: #eef0f3; --l-edge: rgba(16,24,40,.1); --shadow: 0 1px 2px rgba(16,24,40,.06), 0 24px 48px -24px rgba(16,24,40,.28); --spot: rgba(47,85,240,.5); }
button, input { font: inherit; color: inherit; }
button { cursor: pointer; }
:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

.dock { position: fixed; right: max(20px, env(safe-area-inset-right)); bottom: max(20px, env(safe-area-inset-bottom)); z-index: 2147483000; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; pointer-events: none; }
.dock > * { pointer-events: auto; }
.launcher { position: relative; width: 60px; height: 60px; padding: 0; border-radius: 50%; border: 1px solid var(--l-edge); background: radial-gradient(circle at 50% 30%, var(--l-top), var(--l-bot)); box-shadow: var(--shadow); display: grid; place-items: center; transition: transform .26s cubic-bezier(.32,.72,0,1); }
.launcher:hover { transform: scale(1.05); }
.launcher canvas { width: 60px; height: 60px; border-radius: 50%; }
.launcher .x { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; transition: opacity .2s; }
.launcher .x svg { width: 18px; height: 18px; }
.open .launcher canvas { opacity: 0; } .open .launcher .x { opacity: 1; }
.label { position: absolute; right: 70px; top: 50%; transform: translate(6px,-50%); white-space: nowrap; padding: 6px 12px; border-radius: 999px; background: var(--card-solid); border: 1px solid var(--edge); box-shadow: var(--shadow); font-size: 13px; font-weight: 500; opacity: 0; pointer-events: none; transition: opacity .2s, transform .26s cubic-bezier(.32,.72,0,1); }
.launcher:hover .label, .launcher:focus-visible .label { opacity: 1; transform: translate(0,-50%); }
.open .label { display: none; }

.hint { max-width: 260px; padding: 12px 34px 12px 14px; border-radius: 14px; background: var(--card-solid); border: 1px solid var(--edge); box-shadow: var(--shadow); font-size: 13.5px; position: relative; opacity: 0; transform: translateY(6px); transition: opacity .4s, transform .5s cubic-bezier(.32,.72,0,1); }
.hint.show { opacity: 1; transform: none; }
.hint b { font-weight: 600; }
.hint .hx { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border: 0; background: none; color: var(--faint); border-radius: 6px; }
.hint[hidden] { display: none; }

.panel { width: min(372px, calc(100vw - 32px)); max-height: min(620px, calc(100vh - 110px)); display: flex; flex-direction: column; border-radius: 20px; background: var(--card); border: 1px solid var(--edge); box-shadow: var(--shadow); -webkit-backdrop-filter: blur(18px) saturate(1.2); backdrop-filter: blur(18px) saturate(1.2); overflow: hidden; transform-origin: 100% 100%; animation: pop .34s cubic-bezier(.32,.72,0,1); }
.panel[hidden] { display: none; }
@keyframes pop { from { opacity: 0; transform: translateY(10px) scale(.97); } }
.head { display: flex; align-items: center; justify-content: space-between; padding: 12px 12px 0 16px; }
.who { display: flex; align-items: baseline; gap: 8px; }
.who b { font-weight: 600; font-size: 14px; }
.who span { color: var(--faint); font-size: 12px; }
.icon { width: 30px; height: 30px; border: 0; border-radius: 8px; background: none; color: var(--muted); display: grid; place-items: center; }
.icon:hover { background: var(--chip); color: var(--ink); }
.icon svg { width: 16px; height: 16px; }
.stage { display: flex; flex-direction: column; align-items: center; padding: 2px 16px 6px; }
.stage canvas { width: 168px; height: 168px; cursor: pointer; }
.status { min-height: 20px; font-size: 12.5px; color: var(--muted); text-align: center; }
.log { flex: 1 1 auto; min-height: 60px; overflow-y: auto; padding: 8px 16px 4px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; }
.msg { max-width: 92%; font-size: 14px; line-height: 1.5; animation: rise .3s ease-out; }
.msg.lane { align-self: flex-start; }
.msg.user { align-self: flex-end; padding: 7px 12px; border-radius: 14px 14px 4px 14px; background: var(--user); }
.msg.note { align-self: center; font-size: 12px; color: var(--faint); text-align: center; }
.msg.note a { color: var(--brand); font-weight: 500; text-decoration: none; }
.msg.note a:hover { text-decoration: underline; }
@keyframes rise { from { opacity: 0; transform: translateY(4px); } }
.chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 16px 2px; }
.chips[hidden] { display: none; }
.chip { border: 1px solid var(--edge); background: var(--chip); border-radius: 999px; padding: 6px 11px; font-size: 12.5px; }
.chip:hover { background: var(--chip-hover); }
.composer { display: flex; align-items: center; gap: 6px; margin: 10px 12px 8px; padding: 5px 5px 5px 14px; border-radius: 999px; border: 1px solid var(--edge); background: var(--chip); }
.composer:focus-within { border-color: color-mix(in srgb, var(--brand) 55%, transparent); }
.composer input { flex: 1; min-width: 0; border: 0; background: none; outline: none; font-size: 14px; padding: 6px 0; }
.composer input::placeholder { color: var(--faint); }
.mic { width: 34px; height: 34px; border-radius: 50%; border: 0; background: none; color: var(--muted); display: grid; place-items: center; }
.mic:hover { background: var(--chip-hover); color: var(--ink); }
.mic[aria-pressed="true"] { background: var(--brand); color: #fff; }
.mic svg, .send svg { width: 17px; height: 17px; }
.send { width: 34px; height: 34px; border-radius: 50%; border: 0; background: linear-gradient(var(--p-top), var(--p-bot)); color: var(--p-ink); display: grid; place-items: center; box-shadow: 0 1px 2px rgba(0,0,0,.2); }
.send:disabled { opacity: .35; cursor: default; }
.foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 16px 12px; font-size: 11.5px; color: var(--faint); }
.end { border: 0; background: none; color: var(--muted); font-size: 12px; padding: 2px 4px; border-radius: 6px; }
.end:hover { color: var(--ink); }
.end[hidden] { display: none; }

/* compact: on small screens the panel steps aside while Lane shows the page */
.panel.compact { max-height: none; }
.panel.compact .stage canvas { width: 52px; height: 52px; }
.panel.compact .stage { flex-direction: row; gap: 10px; padding: 8px 14px; cursor: pointer; }
.panel.compact .status { text-align: left; color: var(--ink); font-size: 13px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.panel.compact .log, .panel.compact .chips, .panel.compact .foot, .panel.compact .head { display: none; }
.panel.compact .composer { margin-top: 0; }

.spot { position: fixed; z-index: 2147482999; pointer-events: none; border-radius: 14px; box-shadow: 0 0 0 2px var(--spot), 0 0 0 7px color-mix(in srgb, var(--spot) 22%, transparent), 0 0 48px 6px color-mix(in srgb, var(--spot) 30%, transparent); opacity: 0; transition: opacity .45s; }
.spot.on { opacity: 1; }
.toast { position: fixed; z-index: 2147483001; left: 50%; bottom: 24px; transform: translate(-50%, 12px); padding: 9px 14px; border-radius: 999px; background: var(--card-solid); border: 1px solid var(--edge); box-shadow: var(--shadow); font-size: 13px; opacity: 0; transition: opacity .3s, transform .4s cubic-bezier(.32,.72,0,1); pointer-events: none; max-width: calc(100vw - 32px); }
.toast.on { opacity: 1; transform: translate(-50%, 0); }
@media (max-width: 640px) { .toast { bottom: 96px; } }
@media (prefers-reduced-motion: reduce) { .panel, .msg { animation: none; } .launcher, .hint, .label, .toast { transition: none; } }
`;

const ICON = {
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};

/* ---------------- the particle orb ---------------- */
class Orb {
  constructor(canvas, { count, size, reduce }) {
    this.c = canvas; this.ctx = canvas.getContext('2d'); this.size = size; this.reduce = reduce;
    this.pts = []; const g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i;
      const h = Math.sin(i * 12.9898) * 43758.5453; const rnd = h - Math.floor(h);
      const h2 = Math.sin(i * 78.233) * 12543.21, q = h2 - Math.floor(h2); const inner = q < 0.28; const rr = inner ? 0.3 + q / 0.28 * 0.56 : 0.86 + (q - 0.28) / 0.72 * 0.2;
      this.pts.push({ x: Math.cos(th) * r * rr, y: y * rr, z: Math.sin(th) * r * rr, s: 0.55 + rnd * 0.9, accent: rnd > 0.9, ph: rnd * 6.283, dim: inner ? 0.5 : 1 });
    }
    this.rot = 0; this.t = 0; this.energy = 0; this.listen = 0; this.think = 0; this.burst = 0; this.light = false;
    this.want = { energy: 0, listen: 0, think: 0 };
    this.resize();
  }
  resize() { const d = Math.min(2, window.devicePixelRatio || 1); this.dpr = d; this.c.width = this.size * d; this.c.height = this.size * d; }
  draw(dt) {
    const ctx = this.ctx, S = this.size, d = this.dpr, k = this.reduce ? 0.35 : 1;
    const ease = (a, b, r) => a + (b - a) * Math.min(1, dt * r);
    this.energy = ease(this.energy, this.want.energy, 14); this.listen = ease(this.listen, this.want.listen, 10); this.think = ease(this.think, this.want.think, 4);
    this.burst = Math.max(0, this.burst - dt * 1.4);
    this.t += dt; this.rot += dt * k * (0.22 + this.think * 1.1 + this.energy * 0.5);
    ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, S, S);
    const cx = S / 2, cy = S / 2, R = S * 0.3, t = this.t, light = this.light;
    // soft halo behind the particles
    const halo = (light ? 0.10 : 0.26) + this.energy * 0.25 + this.burst * 0.3;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.5);
    g.addColorStop(0, light ? `rgba(47,85,240,${halo * 0.7})` : `rgba(79,123,255,${halo})`); g.addColorStop(1, 'rgba(79,123,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
    const cr = Math.cos(this.rot), sr = Math.sin(this.rot), tl = 0.38, ct = Math.cos(tl), st = Math.sin(tl);
    const breathe = 1 + Math.sin(t * 1.3) * 0.03 * k;
    const dotR = Math.max(0.42, S / 150 * Math.sqrt(420 / this.pts.length) * 1.15);
    for (const p of this.pts) {
      const n = Math.sin(p.x * 3.1 + t * 2.3) * Math.sin(p.y * 4.3 - t * 1.9) * Math.sin(p.z * 5.2 + t * 1.4);
      let m = breathe + this.energy * 0.32 * n * k + this.listen * 0.12 * Math.sin(t * 9 + p.ph) * k + this.burst * 0.18;
      let x = p.x * m, y = p.y * m * (1 - this.think * 0.55), z = p.z * m;
      const x1 = x * cr + z * sr, z1 = -x * sr + z * cr;
      const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      const depth = (z2 + 1.4) / 2.8;
      const a = ((light ? 0.16 : 0.1) + depth * (light ? 0.74 : 0.72)) * p.dim;
      const r = dotR * p.s * (0.55 + depth * 0.75) * (1 + this.energy * 0.35);
      ctx.fillStyle = p.accent ? (light ? `rgba(47,85,240,${a})` : `rgba(130,165,255,${a})`) : (light ? `rgba(22,24,28,${a * 0.9})` : `rgba(236,240,255,${a})`);
      ctx.beginPath(); ctx.arc(cx + x1 * R, cy + y2 * R, r, 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}

/* ---------------- the widget ---------------- */
export function createLaneOrb(opts) {
  const o = Object.assign({
    agentId: '', loadConversation: null, navigate: null, isHome: () => location.pathname === '/',
    sections: DEFAULT_SECTIONS, headerOffset: 88, scrollTo: (y) => window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }),
    isDark: () => document.documentElement.classList.contains('dark'), hintDelay: 6000, storageKey: 'lane-orb', toastOnNavigate: true, fallbackLink: null, avoid: null,
  }, opts || {});
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  o.sections = Object.assign({}, DEFAULT_SECTIONS, o.sections || {});

  const host = document.createElement('div'); host.setAttribute('data-lane-orb', '');
  host.setAttribute('data-lenis-prevent', ''); // smooth-scroll libraries leave the panel's own scrolling alone
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${CSS}</style>
  <div class="root">
    <div class="dock">
      <div class="hint" role="status" hidden><b>Hi, I'm Lane.</b> Ask me anything about Botlane, by voice or text.<button class="hx" aria-label="Dismiss">${ICON.x}</button></div>
      <section class="panel" role="dialog" aria-label="Lane, Botlane's intelligence orchestrator" hidden>
        <div class="head"><div class="who"><b>Lane</b><span>Intelligence orchestrator</span></div><button class="icon min" aria-label="Minimise">${ICON.down}</button></div>
        <div class="stage"><canvas class="big" aria-hidden="true"></canvas><div class="status" aria-live="polite"></div></div>
        <div class="log" aria-live="polite"></div>
        <div class="chips">${CHIPS.map((c) => `<button class="chip" type="button">${c}</button>`).join('')}</div>
        <form class="composer"><input type="text" enterkeyhint="send" autocomplete="off" placeholder="Ask Lane anything" aria-label="Message Lane"><button type="button" class="mic" aria-label="Talk to Lane" aria-pressed="false">${ICON.mic}</button><button type="submit" class="send" aria-label="Send" disabled>${ICON.send}</button></form>
        <div class="foot"><span>Lane is automated. Chats are kept for 30 days.</span><button class="end" type="button" hidden>End chat</button></div>
      </section>
      <button class="launcher" aria-label="Talk to Lane" aria-expanded="false"><canvas aria-hidden="true"></canvas><span class="x">${ICON.x}</span><span class="label">Ask Lane</span></button>
    </div>
    <div class="spot"></div><div class="toast" role="status"></div>
  </div>`;
  document.body.appendChild(host);
  const $ = (s) => shadow.querySelector(s);
  const rootEl = $('.root'), panel = $('.panel'), launcher = $('.launcher'), hint = $('.hint'), log = $('.log'), chips = $('.chips');
  const form = $('.composer'), input = form.querySelector('input'), mic = $('.mic'), send = $('.send'), statusEl = $('.status'), endBtn = $('.end'), spot = $('.spot'), toastEl = $('.toast');

  const small = new Orb(launcher.querySelector('canvas'), { count: 420, size: 60, reduce });
  const big = new Orb($('.big'), { count: 1800, size: 168, reduce });

  /* theme follows the site's toggle */
  const applyTheme = () => { const light = !o.isDark(); rootEl.classList.toggle('light', light); small.light = big.light = light; };
  applyTheme();
  const mo = new MutationObserver(applyTheme); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });

  /* state */
  const S = { open: false, conv: null, mode: null, starting: null, queue: [], history: [], greeted: false, speaking: false, textPulse: 0, lastActivity: 0, compact: false };
  // storageKey: null keeps everything in memory, so the widget stores nothing in the browser.
  const mem = {};
  const store = {
    get(k) { if (!o.storageKey) return mem[k] || null; try { return sessionStorage.getItem(o.storageKey + k); } catch { return null; } },
    set(k, v) { if (!o.storageKey) { mem[k] = v; return; } try { sessionStorage.setItem(o.storageKey + k, v); } catch {} },
  };

  const setStatus = (t) => { statusEl.textContent = t; };
  const idleStatus = () => setStatus(S.mode === 'voice' ? 'Listening' : 'Type below, or tap the mic to talk');
  function addMsg(who, text, link) {
    if (!text) return;
    const last = S.history[S.history.length - 1];
    if (last && last.who === who && last.text === text) return;
    S.history.push({ who, text });
    const el = document.createElement('div'); el.className = 'msg ' + who; el.textContent = text;
    if (link) { const a = document.createElement('a'); a.href = link.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = link.label; el.append(' ', a); }
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    if (who !== 'note') chips.hidden = S.history.filter((m) => m.who === 'user').length > 0;
  }
  function toast(t) { toastEl.textContent = t; toastEl.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('on'), 3200); }

  /* open / close */
  function openPanel() {
    S.open = true; panel.hidden = false; rootEl.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true'); launcher.setAttribute('aria-label', 'Close Lane');
    hideHint(); setCompact(false);
    if (!S.greeted) { S.greeted = true; addMsg('lane', GREETING); }
    idleStatus(); big.burst = 1;
    setTimeout(() => { if (window.innerWidth > 640) input.focus({ preventScroll: true }); }, 60);
  }
  function closePanel() {
    S.open = false; panel.hidden = true; rootEl.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-label', 'Talk to Lane');
  }
  launcher.addEventListener('click', () => (S.open ? closePanel() : openPanel()));
  $('.min').addEventListener('click', closePanel);
  shadow.addEventListener('keydown', (e) => { if (e.key === 'Escape' && S.open) { closePanel(); launcher.focus(); } });
  function setCompact(on) {
    S.compact = on && window.innerWidth <= 640; panel.classList.toggle('compact', S.compact);
    if (S.compact) { const l = [...S.history].reverse().find((m) => m.who === 'lane'); setStatus(l ? l.text : ''); } else idleStatus();
  }
  $('.stage').addEventListener('click', () => { if (S.compact) setCompact(false); else if (!S.mode) startVoice(); });

  /* first-visit hint, once per session */
  function hideHint() { hint.classList.remove('show'); setTimeout(() => { hint.hidden = true; }, 400); store.set(':hint', '1'); }
  hint.querySelector('.hx').addEventListener('click', hideHint);
  const hintTimer = !store.get(':hint') && o.hintDelay >= 0 ? setTimeout(() => { if (!S.open) { hint.hidden = false; requestAnimationFrame(() => hint.classList.add('show')); } }, o.hintDelay) : 0;

  /* ---------- guiding the page ---------- */
  let spotEl = null, spotUntil = 0;
  function highlight(el) { spotEl = el.querySelector('h1,h2') || el; spotUntil = performance.now() + 2800; spot.classList.add('on'); }
  function placeSpot(now) {
    if (!spotEl) return;
    if (now > spotUntil) { spot.classList.remove('on'); if (now > spotUntil + 500) spotEl = null; return; }
    const r = spotEl.getBoundingClientRect(), pad = 14;
    spot.style.left = (r.left - pad) + 'px'; spot.style.top = (r.top - pad) + 'px'; spot.style.width = (r.width + pad * 2) + 'px'; spot.style.height = (r.height + pad * 2) + 'px';
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function findSection(name) {
    const get = o.sections[name]; if (!get) return null;
    for (let i = 0; i < 30; i++) { const el = get(); if (el) return el; await wait(100); }
    return null;
  }
  const tools = {
    show_section: async ({ section }) => {
      big.burst = 1; small.burst = 1;
      if (!o.isHome() && o.navigate) { await o.navigate('/'); await wait(400); }
      const el = await findSection(section);
      if (!el) return 'That section is not on this page. Describe it instead.';
      const y = section === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - o.headerOffset;
      o.scrollTo(Math.max(0, y));
      setCompact(true);
      setTimeout(() => highlight(el), reduce ? 50 : 700);
      return 'The visitor is now looking at the ' + (SECTION_NAMES[section] || section) + ' section.';
    },
    open_page: async ({ page }) => {
      big.burst = 1; small.burst = 1;
      if (!o.navigate) { window.location.assign(page); return 'Opening the page.'; }
      if (o.toastOnNavigate) toast('Opening ' + (page === '/' ? 'the homepage' : page.replace(/^\//, '').replace(/[-/]/g, ' ')));
      const res = await o.navigate(page);
      setCompact(true);
      return typeof res === 'string' ? res : 'The page ' + page + ' is now open for the visitor.';
    },
  };

  /* ---------- the conversation ---------- */
  async function start(kind) {
    if (!o.agentId || !o.loadConversation) { addMsg('note', 'Lane is not connected yet.'); return null; }
    if (S.starting) return S.starting;
    S.mode = kind; mic.setAttribute('aria-pressed', kind === 'voice' ? 'true' : 'false'); endBtn.hidden = false;
    setStatus(kind === 'voice' ? 'Connecting your microphone' : 'Connecting');
    const prior = S.history.filter((m) => m.who !== 'note').slice(-10);
    const hadChat = prior.some((m) => m.who === 'user');
    S.starting = (async () => {
      const Conversation = await o.loadConversation();
      const overrides = { conversation: { textOnly: kind === 'text' } };
      if (hadChat) overrides.agent = { firstMessage: kind === 'voice' ? "I'm listening. Go ahead." : '' };
      else if (kind === 'text') overrides.agent = { firstMessage: '' };
      const conv = await Conversation.startSession({
        agentId: o.agentId, textOnly: kind === 'text', overrides,
        connectionType: kind === 'voice' ? 'webrtc' : 'websocket',
        clientTools: tools,
        onConnect: () => { S.lastActivity = performance.now(); },
        onDisconnect: () => { if (S.conv === conv || !S.conv) endLocal(); },
        onError: (m) => { console.warn('[lane-orb]', m); },
        onModeChange: ({ mode }) => { S.speaking = mode === 'speaking'; if (S.mode === 'voice') setStatus(S.speaking ? 'Lane is speaking' : 'Listening'); },
        onMessage: ({ source, message }) => {
          S.lastActivity = performance.now();
          if (source === 'ai') {
            if (message && message.startsWith("Hi, I'm Lane") && S.history.some((m) => m.text === GREETING)) return;
            big.want.think = 0; addMsg('lane', message); if (S.compact) setStatus(message);
            if (S.mode === 'text') { S.textPulse = Math.min(4, 0.6 + message.length / 60); setStatus(''); }
          } else if (source === 'user') addMsg('user', message);
        },
      });
      S.conv = conv;
      if (hadChat) { try { conv.sendContextualUpdate('Conversation so far, typed by the visitor before switching to voice:\n' + prior.map((m) => (m.who === 'user' ? 'Visitor: ' : 'Lane: ') + m.text).join('\n')); } catch {} }
      if (kind === 'voice') setStatus('Listening'); else idleStatus();
      while (S.queue.length) conv.sendUserMessage(S.queue.shift());
      return conv;
    })().catch((e) => {
      console.warn('[lane-orb]', e);
      const denied = /permission|denied|notallowed/i.test(String(e && (e.name || e.message)));
      if (denied) addMsg('note', 'Microphone blocked. You can still type to Lane.');
      else if (o.fallbackLink) addMsg('note', o.fallbackLink.text, o.fallbackLink);
      else addMsg('note', "Lane couldn't connect just now. Please try again in a moment.");
      endLocal(); return null;
    }).finally(() => { S.starting = null; });
    return S.starting;
  }
  function endLocal() {
    S.conv = null; S.mode = null; S.speaking = false; big.want.think = 0; big.want.energy = 0; big.want.listen = 0;
    mic.setAttribute('aria-pressed', 'false'); endBtn.hidden = true; idleStatus();
  }
  async function stop() { const c = S.conv; S.conv = null; endLocal(); if (c) { try { await c.endSession(); } catch {} } }
  async function startVoice() { if (S.mode === 'voice') return stop(); if (S.conv) await stop(); start('voice'); }

  function sendText(text) {
    text = text.trim(); if (!text) return;
    addMsg('user', text); input.value = ''; send.disabled = true; big.want.think = 1; S.lastActivity = performance.now();
    if (S.mode === 'text' || S.mode === 'voice') setStatus('Thinking');
    if (S.conv) S.conv.sendUserMessage(text);
    else { S.queue.push(text); start('text'); }
  }
  form.addEventListener('submit', (e) => { e.preventDefault(); sendText(input.value); });
  input.addEventListener('input', () => { send.disabled = !input.value.trim(); if (S.conv && S.mode === 'voice') { try { S.conv.sendUserActivity(); } catch {} } });
  input.addEventListener('focus', () => setCompact(false));
  chips.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) sendText(b.textContent); });
  mic.addEventListener('click', startVoice);
  endBtn.addEventListener('click', () => { stop(); addMsg('note', 'Chat ended.'); });

  /* ---------- render loop ---------- */
  const dock = $('.dock'); let lastAvoid = 0;
  function liftAbove() {
    const el = document.querySelector(o.avoid);
    let lift = 0;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width && r.height && r.right > window.innerWidth - 100 && r.bottom > window.innerHeight - 100) lift = window.innerHeight - r.top + 12;
    }
    dock.style.bottom = lift ? lift + 'px' : '';
  }
  let raf = 0, last = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (document.hidden) return;
    let out = 0, inp = 0;
    if (S.conv && S.mode === 'voice') { try { out = S.conv.getOutputVolume() || 0; inp = S.conv.getInputVolume() || 0; } catch {} }
    if (S.textPulse > 0) { S.textPulse -= dt; out = Math.max(out, 0.35 + 0.25 * Math.sin(now / 90)); }
    const e = Math.min(1, out * 1.6), l = S.speaking ? 0 : Math.min(1, inp * 2);
    for (const orb of [small, big]) { orb.want.energy = e; orb.want.listen = l; }
    small.want.think = big.want.think;
    if (!S.open || S.compact) small.draw(dt);
    if (S.open) big.draw(dt);
    placeSpot(now);
    if (o.avoid && now - lastAvoid > 250) { lastAvoid = now; liftAbove(); }
    // end idle sessions to save credits
    if (S.conv && S.lastActivity && now - S.lastActivity > (S.mode === 'voice' ? 120000 : 300000) && !S.speaking) { stop(); addMsg('note', 'Chat paused after a quiet spell. Say hi to pick it up again.'); }
  }
  raf = requestAnimationFrame(frame);
  const onResize = () => { small.resize(); big.resize(); };
  window.addEventListener('resize', onResize);

  return {
    open: openPanel, close: closePanel, end: stop,
    ask(text) { if (!S.open) openPanel(); sendText(text); },
    note(text) { addMsg('note', text); },
    destroy() { cancelAnimationFrame(raf); clearTimeout(hintTimer); mo.disconnect(); window.removeEventListener('resize', onResize); stop(); host.remove(); },
  };
}
