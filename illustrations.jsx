// illustrations.jsx — hand-drawn marginalia.
//
// v4 style notes (per Matteo's feedback):
//   • Yellow comes back as body fill (handles, leaves, ear body, envelope
//     body, iris, lens edge-profile). v3 read too austere with yellow
//     only used as small sparkles.
//   • Outlines stay single and confident — no doubled/parallel strokes,
//     no opacity-reduced "shadow strokes." One line, full weight.
//   • Sparkles still appear as the four-point diamond accent but used
//     sparingly, not as the only yellow element.
//   • A subtle feDisplacementMap roughs up edges.
//
// All drawings live inside a <Spot> wrapper that handles absolute
// positioning and click-and-drag repositioning. Positions persist to
// localStorage so a user's nudges survive reload.

const { useState, useRef, useEffect, useCallback } = React;

// ─── Rough-edge filter ───────────────────────────────────────
function RoughDefs({ id, seed = 3, scale = 1.0, freq = 0.035 }) {
  return (
    <defs>
      <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" seed={seed} />
        <feDisplacementMap in="SourceGraphic" scale={scale} />
      </filter>
    </defs>
  );
}

// ─── Sparkle (four-point diamond accent) ─────────────────────
function Sparkle({ cx, cy, r = 10, rot = 0 }) {
  const pts = `${cx},${cy - r} ${cx + r * 0.36},${cy} ${cx},${cy + r} ${cx - r * 0.36},${cy}`;
  return (
    <polygon
      points={pts}
      fill="var(--ill-fill)"
      stroke="var(--ill-ink)"
      strokeWidth="1.5"
      strokeLinejoin="round"
      transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined}
    />
  );
}

// ─── Drag hook + Spot wrapper ────────────────────────────────
// Baked-in default offsets (px) — these are the positions Matteo
// dialled in by dragging, promoted to the shipped defaults so every
// visitor sees the same layout (localStorage only ever held a
// personal copy). A visitor with no saved position renders here;
// "Reset drawing positions" returns to these, not to bare base.
// NOTE: offsets are fixed pixels, tuned for desktop — the narrow-
// screen @media blocks in styles.css handle small viewports.
// Keys are the draggable pos-ids (note svc-catalog drives the
// .marginalia-svc-cabinet element).
const DEFAULT_POS = {
  "cat-mag":      { dx: -452, dy: 34 },
  "appr-sprout":  { dx: -447, dy: 27 },
  "svc-diamond":  { dx: -441, dy: -168 },
  "svc-catalog":  { dx: -447, dy: 577 },
  "ts-ear":       { dx: -441, dy: 34 },
  "cta-env":      { dx: -447, dy: 42 },
  "foot-lens":    { dx: -45,  dy: -56 },
};
function defaultPos(id) {
  const d = DEFAULT_POS[id];
  return d ? { dx: d.dx, dy: d.dy } : { dx: 0, dy: 0 };
}

// Per-breakpoint baked defaults. Desktop lives in DEFAULT_POS above;
// tablet and mobile are dialled in separately (the spots sit in very
// different places once the layout stacks). Tablet values below are the
// positions Matteo dragged in, promoted to the shipped defaults so they
// hold for every visitor (and survive a localStorage clear).
const TABLET_POS = {
  "cat-mag":      { dx: -261, dy: 119 },
  "appr-sprout":  { dx: -260, dy: 107 },
  "svc-diamond":  { dx: -260, dy: 96 },
  "svc-catalog":  { dx: -259, dy: 414 },
  "ts-ear":       { dx: -253, dy: 116 },
  "cta-env":      { dx: -259, dy: 131 },
  "foot-lens":    { dx: 63,   dy: -91 },
};
const MOBILE_POS = {
  "cat-mag":      { dx: -34, dy: 118 },
  "appr-sprout":  { dx: -32, dy: 107 },
  "svc-diamond":  { dx: -28, dy: 97 },
  "svc-catalog":  { dx: -34, dy: 503 },
  "ts-ear":       { dx: -32, dy: 111 },
  "cta-env":      { dx: -39, dy: 124 },
  "foot-lens":    { dx: 161, dy: -135 },
};

// Three position regimes, each with its own localStorage bucket and
// its own baked defaults, so dialling in one viewport never disturbs
// another. tablet = 561–880px, mobile = ≤560px, desktop = the rest.
const MOBILE_MQ = "(max-width: 560px)";
const TABLET_MQ = "(min-width: 561px) and (max-width: 880px)";

function currentMode() {
  if (typeof window === "undefined" || !window.matchMedia) return "desktop";
  if (window.matchMedia(MOBILE_MQ).matches) return "mobile";
  if (window.matchMedia(TABLET_MQ).matches) return "tablet";
  return "desktop";
}

function posKey(id, mode) {
  return mode === "desktop" ? "marg-pos-" + id : "marg-pos-" + mode + "-" + id;
}

function defaultPosFor(id, mode) {
  if (mode === "desktop") return defaultPos(id);
  const baked = (mode === "tablet" ? TABLET_POS : MOBILE_POS)[id];
  return baked ? { dx: baked.dx, dy: baked.dy } : { dx: 0, dy: 0 };
}

function loadPosFor(id, mode) {
  // Always use the baked default for the current breakpoint. (Dragging is
  // disabled, so we intentionally ignore any stale per-visitor positions a
  // previous build may have saved to localStorage — everyone sees the same
  // locked layout.)
  return defaultPosFor(id, mode);
}

// Spots are draggable at every breakpoint. The active position tracks
// the current regime; switching breakpoints reloads that regime's
// saved/baked position so each viewport keeps its own layout.
function useDraggable(id) {
  const [mode, setMode] = useState(() => currentMode());
  const [pos, setPos] = useState(() => loadPosFor(id, currentMode()));
  const posRef = useRef(pos);
  posRef.current = pos;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const drag = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mqs = [window.matchMedia(MOBILE_MQ), window.matchMedia(TABLET_MQ)];
    const onChange = () => {
      const m = currentMode();
      setMode(m);
      setPos(loadPosFor(id, m));
    };
    mqs.forEach((mq) =>
      mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange)
    );
    return () =>
      mqs.forEach((mq) =>
        mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange)
      );
  }, [id]);

  useEffect(() => {
    const onReset = () => {
      const m = modeRef.current;
      setPos(defaultPosFor(id, m));
      try { localStorage.removeItem(posKey(id, m)); } catch (e) {}
    };
    window.addEventListener("marginalia:reset", onReset);
    return () => window.removeEventListener("marginalia:reset", onReset);
  }, [id]);

  const onPointerDown = useCallback((e) => {
    drag.current = {
      startX: e.clientX, startY: e.clientY,
      origDx: posRef.current.dx, origDy: posRef.current.dy,
      moved: false,
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!drag.current) return;
    const dx = drag.current.origDx + (e.clientX - drag.current.startX);
    const dy = drag.current.origDy + (e.clientY - drag.current.startY);
    if (Math.abs(dx - drag.current.origDx) > 2 || Math.abs(dy - drag.current.origDy) > 2) {
      drag.current.moved = true;
    }
    setPos({ dx, dy });
  }, []);

  const onPointerUp = useCallback(() => {
    if (!drag.current) return;
    if (drag.current.moved) {
      try { localStorage.setItem(posKey(id, modeRef.current), JSON.stringify(posRef.current)); } catch (err) {}
    }
    drag.current = null;
  }, [id]);

  return {
    style: { "--dx": pos.dx + "px", "--dy": pos.dy + "px" },
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}

function Spot({ id, posClass, children }) {
  // Dragging is disabled on the live site — the spots are decorative and
  // locked to their baked positions. useDraggable still supplies the
  // position style (and tracks breakpoint changes); we simply don't wire
  // up the pointer handlers, and CSS makes them pointer-events:none.
  const { style } = useDraggable(id);
  return (
    <div className={`marginalia ${posClass}`} style={style} aria-hidden="true">
      {children}
    </div>
  );
}

function resetAllMarginalia() {
  window.dispatchEvent(new Event("marginalia:reset"));
}

function SVG({ viewBox, children }) {
  return (
    <svg
      viewBox={viewBox}
      style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
      aria-hidden="true">
      {children}
    </svg>
  );
}

// ─── EYE ─────────────────────────────────────────────────────
// Direct copy of the title-slide reference: wide eye with a heavy,
// scratchy upper lid that's asymmetric (rises high on the left, dips
// down on the right), a shorter lighter lower lid, and a HUGE solid
// dark iris that nearly fills the eye. Small white triangular
// highlight in the upper-right of the iris (per the reference, not
// upper-left). Displacement scale is cranked up so the strokes break
// up like charcoal on textured paper.
function Eye({}) {
  const fId = "rough-eye-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 240 180">
      <RoughDefs id={fId} seed={7} scale={2.6} freq={0.06} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* upper lid — bold, asymmetric, peaks left of center */}
        <path d="M 8,120 C 22,40 96,8 168,24 C 196,32 220,64 232,108"
              fill="none" stroke="var(--ill-ink)" strokeWidth="8.5" />
        {/* lower lid — shorter, lighter, gentler curve */}
        <path d="M 18,118 C 70,156 178,156 230,108"
              fill="none" stroke="var(--ill-ink)" strokeWidth="5.5" />
        {/* iris — huge, solid dark, almost touches the lids */}
        <ellipse cx="118" cy="100" rx="66" ry="62" fill="var(--ill-ink)" />
        {/* triangular white highlight upper-RIGHT of iris */}
        <path d="M 138,68 L 154,62 L 146,90 Z" fill="#FFFCF1" />
      </g>
      <Sparkle cx={222} cy={20} r={10} rot={10} />
    </SVG>
  );
}

// ─── MAGNIFYING GLASS ────────────────────────────────────────
// Matched to Matteo's reference: YELLOW handle drawn as a smooth
// cylindrical rod with rounded ends (thick stroked line + round
// caps, layered dark-then-yellow so the rod has a clean outline).
// Charcoal rim around the lens, empty lens body, two yellow
// crescent highlights inside.
function Magnifier({}) {
  const fId = "rough-mag-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 220 220">
      <RoughDefs id={fId} seed={3} scale={1.1} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* handle outline — thick dark stroke, round caps for the
           hemispherical rod ends */}
        <line x1="142" y1="124" x2="202" y2="184"
              stroke="var(--ill-ink)" strokeWidth="28" strokeLinecap="round" />
        {/* handle fill — yellow rod inside the outline */}
        <line x1="142" y1="124" x2="202" y2="184"
              stroke="var(--ill-fill)" strokeWidth="20" strokeLinecap="round" />
        {/* lens body — empty, heavy dark rim */}
        <circle cx="86" cy="86" r="58"
                fill="none" stroke="var(--ill-ink)" strokeWidth="7" />
        {/* yellow crescent highlight — main, upper-left */}
        <path d="M 52,56 C 60,46 78,42 92,48"
              fill="none" stroke="var(--ill-fill)" strokeWidth="7" strokeLinecap="round" />
        {/* yellow tick — secondary smaller highlight */}
        <path d="M 48,72 C 52,68 60,68 64,70"
              fill="none" stroke="var(--ill-fill)" strokeWidth="5" strokeLinecap="round" />
      </g>
    </SVG>
  );
}

// ─── SPROUT ──────────────────────────────────────────────────
// Yellow-filled leaves with dark outline. Dark stem. One sparkle
// above the top sprig.
function Sprout({}) {
  const fId = "rough-sprout-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 160 220">
      <RoughDefs id={fId} seed={11} scale={1.0} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* ground scuff */}
        <path d="M 28,200 C 56,194 110,196 132,200"
              fill="none" stroke="var(--ill-ink)" strokeWidth="3" />
        {/* stem */}
        <path d="M 80,200 C 75,160 90,120 78,80 C 72,60 78,46 84,30"
              fill="none" stroke="var(--ill-ink)" strokeWidth="5" />
        {/* left leaf — yellow */}
        <path d="M 78,98 C 42,86 22,112 38,134 C 60,138 78,120 78,98 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="5" />
        {/* right leaf — yellow */}
        <path d="M 82,52 C 124,42 144,68 130,90 C 110,96 84,78 82,52 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="5" />
      </g>
      <Sparkle cx={120} cy={18} r={8} rot={8} />
    </SVG>
  );
}

// ─── EAR (listening) ─────────────────────────────────────────
// Restored from v1 — Matteo flagged this one as "good." Yellow
// body fill, dark outline + inner whorl, listening dashes radiating
// to the right.
function Ear({}) {
  const fId = "rough-ear-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 180 220">
      <RoughDefs id={fId} seed={5} scale={1.0} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* ear body — yellow fill */}
        <path d="M 56,30 C 30,40 22,82 30,128 C 36,170 64,200 92,196 C 110,194 116,182 110,170 C 100,150 108,138 120,128 C 138,116 142,90 134,68 C 124,40 92,20 56,30 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="5" />
        {/* inner whorl */}
        <path d="M 70,70 C 56,84 56,118 70,140 C 82,156 100,154 100,140"
              fill="none" stroke="var(--ill-ink)" strokeWidth="4" />
        {/* ear canal mark */}
        <path d="M 82,108 C 88,106 94,110 92,118"
              fill="none" stroke="var(--ill-ink)" strokeWidth="3" />
        {/* listening dashes */}
        <path d="M 154,80 L 174,72" stroke="var(--ill-ink)" strokeWidth="3.5" />
        <path d="M 158,108 L 178,108" stroke="var(--ill-ink)" strokeWidth="3.5" />
        <path d="M 154,136 L 174,144" stroke="var(--ill-ink)" strokeWidth="3.5" />
      </g>
    </SVG>
  );
}

// ─── OPEN BOOK ───────────────────────────────────────────────
// Reworked again from the new references. Key insight I'd been
// missing: the OUTER-TOP CORNERS of each page are the HIGH peaks
// of the open book — the top edge slopes DOWN diagonally from
// each outer peak to the lower spine center, like a flat-ish
// "M" or butterfly silhouette. The bottom curves down to the
// spine V-notch, with multiple thin page-stack lines layered
// below each page's bottom edge. Dark cover peeks out underneath.
function OpenBook({}) {
  const fId = "rough-book-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 340 240">
      <RoughDefs id={fId} seed={29} scale={1.0} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* page-flip arcs above */}
        <path d="M 108,34 C 148,18 200,18 240,34"
              fill="none" stroke="var(--ill-ink)" strokeWidth="2.5" />
        <path d="M 132,20 C 158,10 188,10 216,20"
              fill="none" stroke="var(--ill-ink)" strokeWidth="2" />

        {/* DARK COVER — peeks out beneath the pages along the
           bottom edge (the brown leather binding) */}
        <path d="M 26,176
                 C 68,196 132,202 170,204
                 C 208,202 272,196 314,176
                 C 314,168 312,164 310,164
                 C 272,178 132,180 30,164
                 C 28,166 26,170 26,176 Z"
              fill="var(--ill-ink)" />

        {/* LEFT PAGE — outer-top corner is HIGH peak, slopes down
           to the lower spine center. Left edge curves gently. */}
        <path d="M 40,58
                 C 82,52 134,72 162,86
                 L 162,176
                 C 134,186 82,184 44,178
                 C 32,168 28,112 40,58 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="4" />

        {/* RIGHT PAGE — mirror */}
        <path d="M 300,58
                 C 258,52 206,72 178,86
                 L 178,176
                 C 206,186 258,184 296,178
                 C 308,168 312,112 300,58 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="4" />

        {/* SPINE — two thin parallel dark lines defining the valley */}
        <path d="M 162,86 L 162,176"
              stroke="var(--ill-ink)" strokeWidth="3" fill="none" />
        <path d="M 178,86 L 178,176"
              stroke="var(--ill-ink)" strokeWidth="3" fill="none" />

        {/* spine V-notch at bottom — small dark triangle */}
        <path d="M 156,176 L 170,200 L 184,176 Z"
              fill="var(--ill-ink)" stroke="var(--ill-ink)" strokeWidth="2.5" />

        {/* PAGE-STACK lines on LEFT page bottom — 4 thin parallel
           curves layered below the page edge, fanning toward the spine */}
        <path d="M 44,180 C 82,188 132,188 162,184"
              stroke="var(--ill-ink)" strokeWidth="1.4" fill="none" />
        <path d="M 38,184 C 82,192 132,192 162,188"
              stroke="var(--ill-ink)" strokeWidth="1.4" fill="none" />
        <path d="M 34,188 C 82,196 132,196 162,192"
              stroke="var(--ill-ink)" strokeWidth="1.4" fill="none" />
        <path d="M 30,192 C 82,200 132,200 162,196"
              stroke="var(--ill-ink)" strokeWidth="1.4" fill="none" />

        {/* PAGE-STACK lines on RIGHT page bottom — mirror */}
        <path d="M 296,180 C 258,188 208,188 178,184"
              stroke="var(--ill-ink)" strokeWidth="1.4" fill="none" />
        <path d="M 302,184 C 258,192 208,192 178,188"
              stroke="var(--ill-ink)" strokeWidth="1.4" fill="none" />
        <path d="M 306,188 C 258,196 208,196 178,192"
              stroke="var(--ill-ink)" strokeWidth="1.4" fill="none" />
        <path d="M 310,192 C 258,200 208,200 178,196"
              stroke="var(--ill-ink)" strokeWidth="1.4" fill="none" />
      </g>
    </SVG>
  );
}

// ─── CARD CATALOG (recipe-box style) ─────────────────────────
// Recipe-box / index-card box, viewed 3/4 from above so you see both
// the front and the open top. Card tabs fan up out of the top at
// staggered heights (alternating yellow and open). Front face has a
// brass label holder + D-pull, the visual signature that says "card
// file." Replaces the rolodex / earlier card-catalog attempts.
function CardCatalog({}) {
  const fId = "rough-cc-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 240 220">
      <RoughDefs id={fId} seed={31} scale={1.0} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* back wall — short slab seen behind the cards */}
        <path d="M 50,60 L 220,60 L 200,82 L 30,82 Z"
              fill="var(--ill-ink)" stroke="var(--ill-ink)" strokeWidth="4" />
        {/* card tabs fanning up out of the open top, staggered
           heights, alternating yellow / open */}
        <path d="M 44,52 L 70,52 L 72,38 L 44,38 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="3.5" />
        <path d="M 72,60 L 98,60 L 100,46 L 72,46 Z"
              fill="none" stroke="var(--ill-ink)" strokeWidth="3.5" />
        <path d="M 100,42 L 126,42 L 128,28 L 100,28 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="3.5" />
        <path d="M 128,56 L 154,56 L 156,42 L 128,42 Z"
              fill="none" stroke="var(--ill-ink)" strokeWidth="3.5" />
        <path d="M 156,48 L 182,48 L 184,34 L 156,34 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="3.5" />
        <path d="M 184,58 L 206,58 L 208,44 L 184,44 Z"
              fill="none" stroke="var(--ill-ink)" strokeWidth="3.5" />
        {/* small label ticks on a couple of tabs */}
        <path d="M 50,46 L 66,46" stroke="var(--ill-ink)" strokeWidth="1.5" />
        <path d="M 106,36 L 122,36" stroke="var(--ill-ink)" strokeWidth="1.5" />
        <path d="M 162,42 L 178,42" stroke="var(--ill-ink)" strokeWidth="1.5" />
        {/* main box body — front face seen straight-on */}
        <path d="M 30,82 L 200,82 L 200,200 L 30,200 Z"
              fill="none" stroke="var(--ill-ink)" strokeWidth="6" />
        {/* right side edge (3/4 perspective) */}
        <path d="M 200,82 L 220,60 L 220,178 L 200,200"
              fill="none" stroke="var(--ill-ink)" strokeWidth="5" />
        {/* stack lines suggesting the edges of cards behind the box
           front, visible just below the open top */}
        <path d="M 44,92 L 188,92" stroke="var(--ill-ink)" strokeWidth="2" />
        <path d="M 44,100 L 188,100" stroke="var(--ill-ink)" strokeWidth="2" />
        {/* brass LABEL HOLDER — rectangular frame, center of front face */}
        <rect x="82" y="126" width="66" height="22"
              fill="none" stroke="var(--ill-ink)" strokeWidth="3.5" />
        {/* small line of "text" on the label */}
        <path d="M 92,138 L 138,138" stroke="var(--ill-ink)" strokeWidth="2" />
        {/* brass D-PULL — half-circle handle below the label */}
        <path d="M 100,168 C 100,188 130,188 130,168"
              fill="var(--ill-ink)" stroke="var(--ill-ink)" strokeWidth="4" />
      </g>
      <Sparkle cx={20} cy={14} r={8} rot={10} />
    </SVG>
  );
}

// ─── ENVELOPE ────────────────────────────────────────────────
// Yellow-filled body restored (v1 vibe). Postmark + dark stamp
// upper-right as the dark mass.
function Envelope({}) {
  const fId = "rough-env-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 240 180">
      <RoughDefs id={fId} seed={17} scale={1.0} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* body — yellow fill */}
        <path d="M 16,48 L 224,48 L 224,156 L 16,156 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="6" />
        {/* flap V */}
        <path d="M 16,48 L 120,108 L 224,48"
              fill="none" stroke="var(--ill-ink)" strokeWidth="5" />
        {/* stamp — dark mass upper-right */}
        <path d="M 170,16 L 220,16 L 220,60 L 170,60 Z"
              fill="var(--ill-ink)" stroke="var(--ill-ink)" strokeWidth="4" />
        {/* postmark */}
        <circle cx="140" cy="38" r="22"
                fill="none" stroke="var(--ill-ink)" strokeWidth="3.5" />
        <circle cx="140" cy="38" r="13"
                fill="none" stroke="var(--ill-ink)" strokeWidth="2" />
      </g>
    </SVG>
  );
}

// ─── LENS (side profile, with light passing through) ─────────
// A biconvex lens viewed edge-on: a vertical almond/lentil shape,
// yellow-filled. Two or three thin horizontal rays approach from
// the left (parallel) and continue from the right, slightly
// converging toward a focal point. Rays are deliberately subtle —
// no fan, no heavy beams.
function LensRays({}) {
  const fId = "rough-lens-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 280 180">
      <RoughDefs id={fId} seed={23} scale={0.9} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* incoming parallel rays from the left */}
        <path d="M 10,52 L 102,52" stroke="var(--ill-ink)" strokeWidth="2" fill="none" />
        <path d="M 10,90 L 102,90" stroke="var(--ill-ink)" strokeWidth="2" fill="none" />
        <path d="M 10,128 L 102,128" stroke="var(--ill-ink)" strokeWidth="2" fill="none" />
        {/* lens — vertical biconvex almond, yellow */}
        <path d="M 120,16 C 152,40 152,140 120,164 C 88,140 88,40 120,16 Z"
              fill="var(--ill-fill)" stroke="var(--ill-ink)" strokeWidth="5.5" />
        {/* outgoing rays from the right, slightly converging toward focal point */}
        <path d="M 138,52 L 248,82" stroke="var(--ill-ink)" strokeWidth="2" fill="none" />
        <path d="M 138,90 L 248,90" stroke="var(--ill-ink)" strokeWidth="2" fill="none" />
        <path d="M 138,128 L 248,98" stroke="var(--ill-ink)" strokeWidth="2" fill="none" />
        {/* focal point — small mark on the right */}
        <circle cx="252" cy="90" r="2.5" fill="var(--ill-ink)" />
      </g>
    </SVG>
  );
}

// ─── DIAMOND (flagship marker) ───────────────────────────────
// Hand-drawn brilliant-cut diamond. Used as the marginalia accent
// for the flagship Clarity Sessions block. Dark outline + facet
// lines (var(--ill-ink)), sparkle dashes around the upper half in
// yellow (var(--ill-fill)) to match the rest of the marginalia set.
function Diamond({}) {
  const fId = "rough-diamond-" + Math.random().toString(36).slice(2, 7);
  return (
    <SVG viewBox="0 0 240 220">
      <RoughDefs id={fId} seed={11} scale={1.4} freq={0.04} />
      <g filter={`url(#${fId})`} strokeLinecap="round" strokeLinejoin="round">
        {/* sparkle dashes — yellow, radiating from upper half */}
        <path d="M 120,8 L 120,28"  stroke="var(--ill-fill)" strokeWidth="4" />
        <path d="M 56,30 L 70,46"   stroke="var(--ill-fill)" strokeWidth="4" />
        <path d="M 184,30 L 170,46" stroke="var(--ill-fill)" strokeWidth="4" />
        <path d="M 88,18 L 96,38"   stroke="var(--ill-fill)" strokeWidth="4" />
        <path d="M 152,18 L 144,38" stroke="var(--ill-fill)" strokeWidth="4" />
        <path d="M 22,68 L 40,72"   stroke="var(--ill-fill)" strokeWidth="4" />
        <path d="M 218,68 L 200,72" stroke="var(--ill-fill)" strokeWidth="4" />

        {/* girdle — horizontal "line of widest" */}
        <path d="M 34,108 L 206,108"
              stroke="var(--ill-ink)" strokeWidth="3.5" fill="none" />

        {/* outer outline — table → upper bezels → girdle → pavilion → point */}
        {/* table top */}
        <path d="M 84,72 L 156,72"
              stroke="var(--ill-ink)" strokeWidth="6" fill="none" />
        {/* upper-left bezel */}
        <path d="M 84,72 L 34,108"
              stroke="var(--ill-ink)" strokeWidth="6" fill="none" />
        {/* upper-right bezel */}
        <path d="M 156,72 L 206,108"
              stroke="var(--ill-ink)" strokeWidth="6" fill="none" />
        {/* lower-left pavilion edge → point */}
        <path d="M 34,108 L 120,206"
              stroke="var(--ill-ink)" strokeWidth="6" fill="none" />
        {/* lower-right pavilion edge → point */}
        <path d="M 206,108 L 120,206"
              stroke="var(--ill-ink)" strokeWidth="6" fill="none" />

        {/* table facets — zig-zag from table corners to girdle midpoints */}
        <path d="M 84,72 L 108,108 L 120,72 L 132,108 L 156,72"
              stroke="var(--ill-ink)" strokeWidth="3" fill="none" />

        {/* pavilion facets — two converging lines from girdle inflection
            points down to the bottom point */}
        <path d="M 108,108 L 120,206"
              stroke="var(--ill-ink)" strokeWidth="3" fill="none" />
        <path d="M 132,108 L 120,206"
              stroke="var(--ill-ink)" strokeWidth="3" fill="none" />
      </g>
    </SVG>
  );
}

// Expose for use across babel scripts
Object.assign(window, {
  Eye, Magnifier, Sprout, Ear,
  OpenBook, CardCatalog, Envelope, LensRays, Diamond,
  // back-compat aliases so older refs keep working
  Typewriter: OpenBook,
  Rolodex: CardCatalog,
  FilingCabinet: CardCatalog,
  Sparkle, Spot, resetAllMarginalia,
});
