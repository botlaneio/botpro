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

const CSS = `
:host { all: initial; }
* { box-sizing: border-box; }
.root { --ink: #edeef0; --card: #16181c; --edge: rgba(255,255,255,.1); --shadow: 0 1px 1px rgba(0,0,0,.14), 0 18px 40px -18px rgba(0,0,0,.75); --spot: rgba(79,123,255,.55);
  font: 500 13px/1.3 inter, "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--ink); -webkit-font-smoothing: antialiased; }
.root.light { --ink: #16181c; --card: #fff; --edge: rgba(16,24,40,.1); --shadow: 0 1px 2px rgba(16,24,40,.08), 0 18px 36px -18px rgba(16,24,40,.35); --spot: rgba(47,85,240,.5); }

.dock { position: fixed; z-index: 2147483000; right: max(20px, env(safe-area-inset-right)); bottom: max(20px, env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 10px; transition: bottom .35s cubic-bezier(.32,.72,0,1); }

.lane { position: relative; width: 60px; height: 60px; padding: 0; border: 0; border-radius: 50%; cursor: pointer; isolation: isolate;
  /* soft blue, lit from the top left, a little rounded: the same tile as the app icon */
  background: radial-gradient(circle at 32% 26%, #b3cdff 0%, #82a7fb 28%, #5f8bfa 62%, #4a74ec 100%);
  box-shadow: inset 0 2px 3px rgba(255,255,255,.5), inset 0 -8px 16px rgba(30,50,140,.28), 0 14px 28px -12px rgba(79,123,255,.7), var(--shadow);
  transition: transform .35s cubic-bezier(.32,.72,0,1), box-shadow .35s; }
.lane:hover { transform: translateY(-1px) scale(1.04); }
.lane:active { transform: scale(.96); }
.lane:focus-visible { outline: 2px solid #8fa8ff; outline-offset: 3px; }
.mark { position: absolute; inset: 0; z-index: 1; display: grid; place-items: center; }
.mark svg { width: 34px; height: 34px; overflow: visible; filter: drop-shadow(0 0 5px rgba(255,255,255,.45)); will-change: transform; }
.mark .node { transform-box: fill-box; transform-origin: center; }

/* in a call: a soft halo that breathes with the voice */
.halo { position: absolute; inset: -6px; border-radius: 50%; z-index: -1; background: radial-gradient(circle, rgba(95,139,250,.6), rgba(95,139,250,0) 70%); opacity: 0; transform: scale(.9); transition: opacity .3s; pointer-events: none; }
.live .halo { opacity: 1; }

.pill { padding: 7px 12px; border-radius: 999px; background: var(--card); border: 1px solid var(--edge); box-shadow: var(--shadow); white-space: nowrap; max-width: min(260px, calc(100vw - 110px)); overflow: hidden; text-overflow: ellipsis;
  opacity: 0; transform: translateX(6px); transition: opacity .25s, transform .35s cubic-bezier(.32,.72,0,1); pointer-events: none; }
.pill.on, .dock:hover .pill.hint { opacity: 1; transform: none; }
.pill.warn { white-space: normal; max-width: min(240px, calc(100vw - 110px)); }

.spot { position: fixed; z-index: 2147482999; pointer-events: none; border-radius: 14px; box-shadow: 0 0 0 2px var(--spot), 0 0 0 7px color-mix(in srgb, var(--spot) 22%, transparent), 0 0 48px 6px color-mix(in srgb, var(--spot) 30%, transparent); opacity: 0; transition: opacity .45s; }
.spot.on { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .lane, .pill, .dock { transition: none; } }
`;

export function createLaneOrb(opts) {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const o = Object.assign({
    agentId: '', loadConversation: null, navigate: null, isHome: () => location.pathname === '/',
    sections: {}, headerOffset: 88, scrollTo: (y) => window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }),
    isDark: () => document.documentElement.classList.contains('dark'), hintDelay: 5000, avoid: null, mark: '',
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
      <button class="lane" type="button" aria-label="Talk to Lane, Botlane's intelligence orchestrator" aria-pressed="false">
        <span class="halo"></span><span class="mark">${o.mark}</span>
      </button>
    </div>
    <div class="spot"></div>
  </div>`;
  document.body.appendChild(host);
  const $ = (s) => shadow.querySelector(s);
  const rootEl = $('.root'), dock = $('.dock'), btn = $('.lane'), pill = $('.pill'), halo = $('.halo'), spot = $('.spot');
  const markSvg = shadow.querySelector('.mark svg'), node = shadow.querySelector('.mark .node');

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
    btn.setAttribute('aria-label', s === 'idle' ? "Talk to Lane, Botlane's intelligence orchestrator" : 'End the conversation with Lane');
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

  /* ---------- the comet, moved by the live audio ----------
     In a call the comet turns, so its node travels the lane: quickly while connecting, slowly while Lane listens
     (faster when the visitor speaks), and in step with Lane's voice while it speaks. Back at rest it settles upright. */
  function loudness(data) {
    if (!data || !data.length) return 0;
    let s = 0, n = 0;
    for (let i = 2; i < Math.min(38, data.length); i++) { s += data[i]; n++; }
    return n ? s / n / 255 : 0;
  }
  let angle = 0, level = 0, last = 0;
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
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
    let loud = 0;
    if (S.conv && (S.state === 'speaking' || S.state === 'listening')) {
      try { loud = loudness(S.state === 'speaking' ? S.conv.getOutputByteFrequencyData() : S.conv.getInputByteFrequencyData()); } catch { loud = 0; }
    }
    level += (Math.min(1, loud * 1.8) - level) * 0.25;
    if (!reduce) {
      if (S.state === 'idle') angle += ((Math.round(angle / 360) * 360) - angle) * 0.08; // settle upright
      else angle += dt * (S.state === 'connecting' ? 360 : S.state === 'speaking' ? 70 + level * 320 : 22 + level * 160);
    }
    if (markSvg) markSvg.style.transform = 'rotate(' + angle.toFixed(1) + 'deg)';
    if (node) node.style.transform = 'scale(' + (1 + (S.state === 'speaking' ? level * 0.35 : 0)).toFixed(3) + ')';
    halo.style.transform = 'scale(' + (1 + Math.min(0.45, level * 0.5)).toFixed(3) + ')';
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
