/*
 * Lane: Botlane's intelligence orchestrator, as one voice button in the bottom-right corner.
 * Tap to talk in real time, tap again to end. While Lane talks it can scroll the homepage to what it
 * is explaining (and highlight it) or open another page. Framework-free; mounted once by lane-orb.tsx.
 *
 *   import { createLaneOrb } from './engine';
 *   const lane = createLaneOrb({ agentId, loadConversation: () => import('@elevenlabs/client').then(m => m.Conversation) });
 *   lane.destroy();
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
const BAR_BASE = [0.42, 0.92, 0.6, 0.84]; // the icon's resting shape

const CSS = `
:host { all: initial; }
* { box-sizing: border-box; }
.root { --ink: #edeef0; --card: #16181c; --edge: rgba(255,255,255,.1); --shadow: 0 1px 1px rgba(0,0,0,.14), 0 18px 40px -18px rgba(0,0,0,.75); --spot: rgba(79,123,255,.55);
  font: 500 13px/1.3 inter, "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--ink); -webkit-font-smoothing: antialiased; }
.root.light { --ink: #16181c; --card: #fff; --edge: rgba(16,24,40,.1); --shadow: 0 1px 2px rgba(16,24,40,.08), 0 18px 36px -18px rgba(16,24,40,.35); --spot: rgba(47,85,240,.5); }

.dock { position: fixed; z-index: 2147483000; right: max(20px, env(safe-area-inset-right)); bottom: max(20px, env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 10px; transition: bottom .35s cubic-bezier(.32,.72,0,1); }

.lane { position: relative; width: 60px; height: 60px; padding: 0; border: 0; border-radius: 50%; cursor: pointer; isolation: isolate;
  background: linear-gradient(140deg, #5b93f5 0%, #6f82f6 48%, #8070ee 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 10px 26px -10px rgba(91,110,240,.75), var(--shadow);
  transition: transform .35s cubic-bezier(.32,.72,0,1), box-shadow .35s; }
.lane:hover { transform: translateY(-1px) scale(1.04); }
.lane:active { transform: scale(.96); }
.lane:focus-visible { outline: 2px solid #8fa8ff; outline-offset: 3px; }
.lane svg.blob { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; overflow: visible; }
.blob .b1 { transform-origin: 50px 50px; animation: drift 16s linear infinite; }
.blob .b2 { transform-origin: 50px 50px; animation: drift 22s linear infinite reverse; }
@keyframes drift { to { transform: rotate(360deg); } }
.bars { position: absolute; inset: 0; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 4px; }
.bars i { display: block; width: 3.5px; height: 22px; border-radius: 3px; background: #fff; transform-origin: 50% 50%; box-shadow: 0 0 6px rgba(255,255,255,.35); will-change: transform; }

/* in a call: a soft halo that breathes with the voice */
.halo { position: absolute; inset: -6px; border-radius: 50%; z-index: -1; background: radial-gradient(circle, rgba(124,130,255,.55), rgba(124,130,255,0) 70%); opacity: 0; transform: scale(.9); transition: opacity .3s; pointer-events: none; }
.live .halo { opacity: 1; }
.ring { position: absolute; inset: -3px; border-radius: 50%; z-index: -1; opacity: 0; pointer-events: none;
  background: conic-gradient(from 0deg, rgba(255,255,255,0), rgba(160,180,255,.95), rgba(255,255,255,0) 40%); animation: spin 1s linear infinite;
  -webkit-mask: radial-gradient(circle, transparent 29px, #000 30px); mask: radial-gradient(circle, transparent 29px, #000 30px); }
.connecting .ring { opacity: 1; }
@keyframes spin { to { transform: rotate(360deg); } }

.pill { padding: 7px 12px; border-radius: 999px; background: var(--card); border: 1px solid var(--edge); box-shadow: var(--shadow); white-space: nowrap; max-width: min(260px, calc(100vw - 110px)); overflow: hidden; text-overflow: ellipsis;
  opacity: 0; transform: translateX(6px); transition: opacity .25s, transform .35s cubic-bezier(.32,.72,0,1); pointer-events: none; }
.pill.on, .dock:hover .pill.hint { opacity: 1; transform: none; }
.pill.warn { white-space: normal; max-width: min(240px, calc(100vw - 110px)); }

.spot { position: fixed; z-index: 2147482999; pointer-events: none; border-radius: 14px; box-shadow: 0 0 0 2px var(--spot), 0 0 0 7px color-mix(in srgb, var(--spot) 22%, transparent), 0 0 48px 6px color-mix(in srgb, var(--spot) 30%, transparent); opacity: 0; transition: opacity .45s; }
.spot.on { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .blob .b1, .blob .b2, .ring { animation: none; } .lane, .pill, .dock { transition: none; } }
`;

const BLOB = `<svg class="blob" viewBox="0 0 100 100" aria-hidden="true">
  <defs>
    <radialGradient id="lg" cx="62%" cy="28%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></radialGradient>
  </defs>
  <g class="b2"><path d="M22 58c-4-14 6-30 24-34 17-4 33 4 35 19 2 14-10 28-28 31-15 3-27-3-31-16z" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".7" stroke-width="1"/></g>
  <g class="b1"><path d="M30 70c-10-12-8-34 6-44 13-9 31-6 38 8 8 15 4 34-9 41-12 7-27 6-35-5z" fill="url(#lg)" stroke="#fff" stroke-opacity=".9" stroke-width="1"/></g>
</svg>`;

export function createLaneOrb(opts) {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const o = Object.assign({
    agentId: '', loadConversation: null, navigate: null, isHome: () => location.pathname === '/',
    sections: {}, headerOffset: 88, scrollTo: (y) => window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }),
    isDark: () => document.documentElement.classList.contains('dark'), hintDelay: 5000, avoid: null,
  }, opts || {});
  o.sections = Object.assign({}, DEFAULT_SECTIONS, o.sections || {});

  const host = document.createElement('div');
  host.setAttribute('data-lane-orb', '');
  host.setAttribute('data-lenis-prevent', '');
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${CSS}</style>
  <div class="root">
    <div class="dock">
      <span class="pill hint" role="status" aria-live="polite">Talk to Lane</span>
      <button class="lane" type="button" aria-label="Talk to Lane, botLane's intelligence orchestrator" aria-pressed="false">
        <span class="halo"></span><span class="ring"></span>${BLOB}<span class="bars"><i></i><i></i><i></i><i></i></span>
      </button>
    </div>
    <div class="spot"></div>
  </div>`;
  document.body.appendChild(host);
  const $ = (s) => shadow.querySelector(s);
  const rootEl = $('.root'), dock = $('.dock'), btn = $('.lane'), pill = $('.pill'), halo = $('.halo'), spot = $('.spot');
  const bars = [...shadow.querySelectorAll('.bars i')];

  const applyTheme = () => rootEl.classList.toggle('light', !o.isDark());
  applyTheme();
  const mo = new MutationObserver(applyTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });

  /* state: idle | connecting | listening | speaking */
  const S = { state: 'idle', conv: null, starting: false, lastActivity: 0, gen: 0 };
  function setState(s) {
    S.state = s;
    dock.classList.toggle('connecting', s === 'connecting');
    dock.classList.toggle('live', s === 'listening' || s === 'speaking');
    btn.setAttribute('aria-pressed', s === 'idle' ? 'false' : 'true');
    btn.setAttribute('aria-label', s === 'idle' ? "Talk to Lane, botLane's intelligence orchestrator" : 'End the conversation with Lane');
  }
  let pillTimer = 0;
  function say(text, { hold = 0, warn = false } = {}) {
    clearTimeout(pillTimer);
    pill.textContent = text; pill.classList.remove('hint'); pill.classList.toggle('warn', warn); pill.classList.add('on');
    if (hold) pillTimer = setTimeout(() => { if (S.state === 'idle') resetPill(); }, hold);
  }
  function resetPill() { pill.classList.remove('on', 'warn'); pill.classList.add('hint'); pill.textContent = 'Talk to Lane'; }

  /* a one-time nudge so visitors know what the button is */
  const hintTimer = o.hintDelay >= 0 ? setTimeout(() => { if (S.state === 'idle') { say('Talk to Lane', { hold: 4500 }); } }, o.hintDelay) : 0;

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
      if (!o.isHome() && o.navigate) { await o.navigate('/'); await wait(400); }
      const el = await findSection(section);
      if (!el) return 'That section is not on this page. Describe it instead.';
      const y = section === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - o.headerOffset;
      o.scrollTo(Math.max(0, y));
      setTimeout(() => highlight(el), reduce ? 50 : 700);
      return 'The visitor is now looking at the ' + (SECTION_NAMES[section] || section) + ' section.';
    },
    open_page: async ({ page }) => {
      if (!o.navigate) { window.location.assign(page); return 'Opening the page.'; }
      const res = await o.navigate(page);
      return typeof res === 'string' ? res : 'The page ' + page + ' is now open for the visitor.';
    },
  };

  /* ---------- the call ---------- */
  async function start() {
    if (S.starting || S.conv) return;
    if (!o.agentId || !o.loadConversation) { say('Lane is not set up yet.', { hold: 4000, warn: true }); return; }
    S.starting = true; const gen = ++S.gen;
    setState('connecting'); say('Connecting…');
    let conv = null;
    try {
      const Conversation = await o.loadConversation();
      conv = await Conversation.startSession({
        agentId: o.agentId,
        connectionType: 'webrtc',
        clientTools: tools,
        onConnect: () => { S.lastActivity = performance.now(); },
        onDisconnect: (details) => {
          if (gen !== S.gen) return;
          const failed = details && details.reason === 'error';
          S.conv = null; setState('idle');
          if (failed) say("Lane couldn't stay connected. Tap to try again.", { hold: 6000, warn: true });
          else say('Conversation ended', { hold: 2500 });
        },
        onError: (m) => { console.warn('[lane]', m); },
        onModeChange: ({ mode }) => {
          if (gen !== S.gen || S.state === 'idle') return;
          S.lastActivity = performance.now();
          setState(mode === 'speaking' ? 'speaking' : 'listening');
          say(mode === 'speaking' ? 'Lane is speaking' : 'Listening · tap to end');
        },
        onMessage: () => { S.lastActivity = performance.now(); },
      });
      if (gen !== S.gen) { conv.endSession().catch(() => {}); return; } // ended while connecting
      S.conv = conv; S.lastActivity = performance.now();
      if (S.state === 'connecting') { setState('listening'); say('Listening · tap to end'); }
    } catch (e) {
      console.warn('[lane]', e);
      if (gen !== S.gen) return;
      const denied = /permission|denied|notallowed/i.test(String(e && (e.name + ' ' + e.message)));
      setState('idle');
      say(denied ? 'Microphone blocked. Allow it from the address bar, then tap again.' : "Lane couldn't connect. Tap to try again.", { hold: 7000, warn: true });
    } finally { S.starting = false; }
  }
  async function stop() {
    S.gen++; const c = S.conv; S.conv = null; setState('idle'); S.starting = false;
    if (c) { try { await c.endSession(); } catch { /* already closed */ } }
  }
  btn.addEventListener('click', () => {
    if (S.state === 'idle') start();
    else { stop(); say('Conversation ended', { hold: 2500 }); }
  });

  /* ---------- the bars, drawn from the live audio ---------- */
  const level = [0, 0, 0, 0];
  function bands(data) {
    if (!data || !data.length) return null;
    const edges = [2, 6, 12, 22, 38], out = [];
    for (let b = 0; b < 4; b++) { let s = 0, n = 0; for (let i = edges[b]; i < Math.min(edges[b + 1], data.length); i++) { s += data[i]; n++; } out.push(n ? s / n / 255 : 0); }
    return out;
  }
  const lastAvoid = { t: 0 };
  function liftAbove() {
    const el = o.avoid && document.querySelector(o.avoid);
    let lift = 0;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width && r.height && r.right > window.innerWidth - 100 && r.bottom > window.innerHeight - 100) lift = window.innerHeight - r.top + 12;
    }
    dock.style.bottom = lift ? lift + 'px' : '';
  }
  let raf = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const t = now / 1000;
    let src = null;
    if (S.conv && (S.state === 'speaking' || S.state === 'listening')) {
      try { src = bands(S.state === 'speaking' ? S.conv.getOutputByteFrequencyData() : S.conv.getInputByteFrequencyData()); } catch { src = null; }
    }
    let loud = 0;
    for (let i = 0; i < 4; i++) {
      let want;
      if (S.state === 'connecting') want = 0.35 + 0.55 * Math.max(0, Math.sin(t * 7 - i * 0.9));
      else if (src) want = Math.min(1, 0.22 + src[i] * (S.state === 'speaking' ? 1.5 : 1.9));
      else want = BAR_BASE[i] * (1 + (reduce ? 0 : 0.06 * Math.sin(t * 1.6 + i)));
      level[i] += (want - level[i]) * 0.3;
      loud = Math.max(loud, src ? src[i] : 0);
      bars[i].style.transform = 'scaleY(' + Math.max(0.16, level[i]).toFixed(3) + ')';
    }
    halo.style.transform = 'scale(' + (1 + Math.min(0.45, loud * 0.6)).toFixed(3) + ')';
    placeSpot(now);
    if (o.avoid && now - lastAvoid.t > 250) { lastAvoid.t = now; liftAbove(); }
    // a quiet call ends itself, so a forgotten tab doesn't use up minutes
    if (S.conv && S.state === 'listening' && now - S.lastActivity > 90000) { stop(); say('Ended after a quiet minute and a half', { hold: 4000 }); }
  }
  raf = requestAnimationFrame(frame);

  return {
    start, end: stop,
    destroy() { cancelAnimationFrame(raf); clearTimeout(hintTimer); clearTimeout(pillTimer); mo.disconnect(); stop(); host.remove(); },
  };
}
