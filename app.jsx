// app.jsx — Clarity for Complex Work site
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#FAF4E6", "#171513", "#5D2A2A"],
  "displayFont": "Instrument Serif",
  "whimsy": 60,
  "credMotion": "fade",
  "catalogueLayout": "grid",
  "darkSections": true,
  "margFill": "yellow",
  "servicesMobileLayout": "tabs"
} /*EDITMODE-END*/;

// Marginalia fill swatches — the ochre is a dustier mustard than crayon
// yellow so it sits with the paper/oxblood palette without shouting.
const MARG_FILLS = {
  yellow: "#E2B23A",
  oxblood: "var(--accent)"
};
function applyMargFill(key) {
  const r = document.documentElement;
  r.style.setProperty("--ill-fill", MARG_FILLS[key] || MARG_FILLS.yellow);
  r.style.setProperty("--ill-ink", "var(--ink)");
}

const PALETTES = [
["#EFE2C9", "#191713", "#9C4A1A"], // warm cream + terracotta
["#F4ECDC", "#1A1814", "#7A2E1F"], // deeper rust
["#FAF4E6", "#171513", "#5D2A2A"], // pale paper, oxblood
["#EDE4D3", "#22201C", "#3A4A2E"], // cream + olive
["#F1E7D0", "#1C1A16", "#2C3F5C"] // cream + ink blue
];

const FONTS = [
{ id: "Old Standard TT", label: "Old Standard (Caslon)", stack: "'Old Standard TT', Georgia, serif" },
{ id: "EB Garamond", label: "EB Garamond", stack: "'EB Garamond', Georgia, serif" },
{ id: "Instrument Serif", label: "Instrument Serif", stack: "'Instrument Serif', Georgia, serif" },
{ id: "Playfair Display", label: "Playfair Display", stack: "'Playfair Display', Georgia, serif" }];


function applyPalette(p) {
  const r = document.documentElement;
  r.style.setProperty("--paper", p[0]);
  r.style.setProperty("--ink", p[1]);
  r.style.setProperty("--accent", p[2]);
  // derive
  r.style.setProperty("--paper-2", shade(p[0], -0.05));
  r.style.setProperty("--paper-3", shade(p[0], 0.04));
  r.style.setProperty("--ink-2", shade(p[1], 0.18));
  r.style.setProperty("--margin", shade(p[1], 0.45));
  r.style.setProperty("--rule", shade(p[0], -0.12));
  r.style.setProperty("--accent-soft", shade(p[2], 0.18));
}

function shade(hex, amt) {
  const n = hex.replace("#", "");
  const r = parseInt(n.substring(0, 2), 16);
  const g = parseInt(n.substring(2, 4), 16);
  const b = parseInt(n.substring(4, 6), 16);
  const f = (c) => {
    const v = amt > 0 ? c + (255 - c) * amt : c * (1 + amt);
    return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  };
  return "#" + f(r) + f(g) + f(b);
}

function applyFont(id) {
  const f = FONTS.find((x) => x.id === id) || FONTS[0];
  document.documentElement.style.setProperty("--display", f.stack);
  // Note: we intentionally don't override --serif here. Body prose
  // uses Space Grotesk site-wide for legibility; only the display
  // (heading) font is Tweaks-driven.
}

// ─── Components ───────────────────────────────────────────────

function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <span className="nav-mark">Clarity <em>for</em> Complex Work</span>
        <button className="nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
          <span className="nav-toggle-menu">Menu</span>
          <span className="nav-toggle-x">Close</span>
        </button>
        <div className="nav-links">
          <a href="on-complex-work.html">On Complex Work</a>
          <a href="for-scale-ups.html">For Scale-Ups</a>
          <a href="for-ngos.html">For NGOs</a>
          <a href="for-artists.html">For Artists / Galleries</a>
          <a href="clarity-sessions.html">The Clarity Sessions</a>
        </div>
        <div className="nav-personal">
          <a href="about.html">About Me</a>
          <a className="nav-contact" href="mailto:matteo@clarityforcomplexwork.com">Contact</a>
        </div>
      </div>
    </nav>);

}

function Hero({ data }) {
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-eyebrow">
          <span>№ 001 — PRACTICE</span>
          <span>Est. 2025</span>
          <span className="he-rule" aria-hidden="true"></span>
          <span className="he-vol">Vol. VII · Berlin</span>
        </div>
        <div className="hero-grid">
          <div>
            <h1 className="hero-title">
              Clarity<br />for <em>Complex</em><br />Work.
            </h1>
            <p className="hero-sub">
              Strategic communications for work that resists easy summary – NGOs, scale-ups, artists, and art institutions.
            </p>
            <div className="hero-cta-row">
              <a className="hero-feature" href="mailto:matteo@clarityforcomplexwork.com?subject=Hello%20%E2%80%94%20let%27s%20talk">
                <span className="hero-feature-title">Get in touch</span>
                <span className="hero-feature-arrow" aria-hidden="true">→</span>
              </a>
              <a className="hero-feature hero-feature--ghost" href="on-complex-work.html">
                <span className="hero-feature-title">What is complex work?</span>
                <span className="hero-feature-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div>
            <figure className="hero-portrait">
              <img src="matteo-portrait.jpeg" alt={`Portrait of ${data.founder}`} className="ph-img" />
            </figure>
            <figcaption className="hero-nameplate">
              <span className="np-rule"></span>
              <span className="np-name">{data.founder}</span>
              <span className="np-role">Founder</span>
            </figcaption>
          </div>
        </div>
      </div>
    </header>);

}

function Credentials({ items, intro, mode }) {
  return (
    <section className="cred-section">
      <div className="container cred-grid">
        <div className="cred-intro">
          <div className="cred-eyebrow">What Sets Me Apart</div>
          <p className="dropcap">{intro}</p>
        </div>
        <div className={`cred-flash cred-mode-${mode}`}>
          <div className="cred-flash-label">Credentials</div>
          <CredFlash items={items} mode={mode} />
        </div>
      </div>
    </section>);

}

function CredFlash({ items, mode }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const speed = mode === "flicker" ? 1400 : 2400;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), speed);
    return () => clearInterval(t);
  }, [items.length, mode]);

  if (mode === "marquee") {
    // a slow vertical ticker for marquee mode (since we removed horizontal one)
    return (
      <div className="cred-ticker">
        <ul style={{ transform: `translateY(-${idx * 100}%)` }}>
          {items.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>);

  }
  return (
    <div className="cred-stack">
      {items.map((c, i) =>
      <div key={i} className={`cred-line ${i === idx ? "is-on" : ""}`}>
          <span className="cred-text">{c}</span>
        </div>
      )}
    </div>);

}

function Catalogue({ entries, layout }) {
  const featured = entries[0];
  const rest = entries.slice(1);
  return (
    <section id="catalogue" className="section section--catalogue">
      <Spot id="cat-mag" posClass="marginalia-cat-mag">
        <Magnifier />
      </Spot>
      <div className="container">
        <div className="sec-head">
          <div className="sec-num">№ 02 / Catalogue</div>
          <h2 className="sec-title">A <em>catalogue</em><br />of work, in progress.</h2>
        </div>
        <p className="cat-intro dropcap">From NGOs and tech to artists and art galleries, my clients share a common problem: the complexity of their work makes it hard to reach internal clarity and an external audience. Here's a catalogue of ways I've helped.</p>
        {layout === "list" &&
        <div className="cat-list">
            {entries.map((e) => <CatCard key={e.slug} e={e} variant="full" />)}
          </div>
        }
        {layout === "grid" &&
        <div className="cat-grid">
            {entries.map((e) => <CatCard key={e.slug} e={e} variant="grid" />)}
          </div>
        }
        {layout === "hybrid" &&
        <>
            <div className="cat-featured-wrap">
              <CatCard e={featured} variant="featured" />
            </div>
            <div className="cat-grid">
              {rest.map((e) => <CatCard key={e.slug} e={e} variant="grid" />)}
            </div>
          </>
        }
        <p className="rail-hint">Swipe through the catalogue <span aria-hidden="true">→</span></p>
      </div>
    </section>);
}

function CatCard({ e, variant }) {
  return (
    <article className={`cat-card cat-card--${variant}`}>
      <div className="cat-left-col">
        <div className="cat-num-col">
          <span className="cat-num-lg">{e.n}</span>
          <span className="cat-year">{e.year}</span>
        </div>
        <div
          className="cat-logo"
          style={
          e.bg ?
          {
            background: e.bg,
            borderColor: e.bg.startsWith("linear") ? "transparent" : e.bg,
            ...(e.borderTop ? { borderTopColor: e.borderTop } : {}),
            ...(e.borderBottom ? { borderBottomColor: e.borderBottom } : {}),
            ...(e.noBorder ? { border: "none" } : {})
          } :
          undefined
          }>
          
          {e.logo ?
          <img
            src={e.logo}
            alt={`${e.client} logo`}
            className="logo-img"
            style={e.imgScale ? { transform: `scale(${e.imgScale})` } : undefined} /> :


          <>
              <span className="logo-mono">{e.monogram}</span>
              <span className="logo-hint">Logo</span>
            </>
          }
        </div>
      </div>
      <div className="cat-content">
        <div className="cat-tagline">
          <span className="cat-client-type">{e.clientType}</span>
          <span className="cat-sep">·</span>
          <span className="cat-client">{e.client}</span>
        </div>
        <h3 className="cat-deliv">{e.deliverable}</h3>
        <p className="cat-desc" style={{ height: "113px" }}>{e.desc}</p>
        {/* LIVE-HIDDEN: catalogue "More" link removed until /case-studies/ pages exist. To restore, delete this comment-wrapper opening and the closing star-slash-brace below.
        <a className="cat-more" href={`/case-studies/${e.slug}.html`}>
          More <span className="cat-more-arr">→</span>
        </a>
        */}
      </div>
    </article>);

}

function Approach({ data }) {
  return (
    <section id="approach" className="section section--approach">
      <Spot id="appr-sprout" posClass="marginalia-appr-sprout">
        <Sprout />
      </Spot>
      <div className="container">
        <div className="sec-head">
          <div className="sec-num">№ 03 / APPROACH</div>
          <div>
            <h2 className="appr-hero" dangerouslySetInnerHTML={{ __html: data.aphorism }} />
            <p className="appr-sub" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
          </div>
        </div>
        <div className="appr-pillars">
          {data.acts.map((a) =>
          <div className="appr-col" key={a.n}>
              <div className="appr-lbl">
                <span className="appr-num">{a.n}</span> {a.label}
              </div>
              <h4 className="appr-head" dangerouslySetInnerHTML={{ __html: a.head }} />
              <p className="appr-body" dangerouslySetInnerHTML={{ __html: a.body }} style={{ fontFamily: "\"Space Grotesk\"" }} />
            </div>
          )}
        </div>
      </div>
    </section>);

}

function ClaritySessions({ data }) {
  if (!data) return null;
  return (
    <article className="clarity clarity--teaser">
      <header className="clarity-head">
        <div className="clarity-kicker">{data.sectionKicker}</div>
        <h3 className="clarity-title">
          {data.title}
          <br />
          <em>{data.subtitle}</em>
        </h3>
        <div className="clarity-format">{data.format}</div>
      </header>

      <p className="clarity-teaser-pitch">{data.teaserPitch}</p>

      <a className="clarity-more" href={data.pageUrl}>
        {data.ctaLabel} <span className="clarity-more-arr">→</span>
      </a>
    </article>);
}

function ServicesList({ data, mobileLayout }) {
  const [hover, setHover] = React.useState({ r: null, c: null });
  const clear = () => setHover({ r: null, c: null });

  // is-hover logic:
  //   hover.r set, hover.c set       → exact cell + row label + col label
  //   hover.r set, hover.c null      → entire row + row label
  //   hover.r null, hover.c set      → entire column + col label
  //   both null                      → nothing
  const dataIsActive = (r, c) =>
  hover.r === r && hover.c === c ||
  hover.r === r && hover.c === null ||
  hover.r === null && hover.c === c;

  // Hover mode tells the CSS which set of cells to dim:
  //   "cell" → dim everything except the active cell + its row/col head
  //   "row"  → dim cells in other rows + other row heads (cols stay)
  //   "col"  → dim cells in other cols + other col heads (rows stay)
  const mode =
  hover.r !== null && hover.c !== null ? "cell" :
  hover.r !== null ? "row" :
  hover.c !== null ? "col" :
  "";

  return (
    <section id="services" className="section section--services">
      <Spot id="svc-diamond" posClass="marginalia-svc-diamond">
        <Diamond />
      </Spot>
      <Spot id="svc-catalog" posClass="marginalia-svc-cabinet">
        <CardCatalog />
      </Spot>
      <div className="container">
        <ClaritySessions data={data.flagship} />
        <div className="svc-head svc-head--index">
          <div></div>
          <div>
            <h2 className="sec-title">An <span style={{ color: "#171513", fontStyle: "normal" }}>index of</span><br /><em style={{ color: "#5D2A2A" }}>services.</em></h2>
            <p className="svc-sub" dangerouslySetInnerHTML={{ __html: data.subhead }} />
          </div>
        </div>
        <div className="m-grid"
        data-mode={mode}
        onMouseLeave={clear}>
          
          <div className="m-cell m-corner" />
          {data.audiences.map((a, c) =>
          <a
            className={`m-cell m-col-head ${hover.c === c ? "is-hover" : ""}`}
            data-c={c}
            key={a.label}
            href={a.href}
            onMouseEnter={() => setHover({ r: null, c })}>
            
              <span className="m-label">{a.label}</span>
              <span className="m-col-more">Read more <span className="m-col-arr" aria-hidden="true">→</span></span>
            </a>
          )}
          {data.rows.map((r, rowIdx) =>
          <React.Fragment key={r.label}>
              <div
              className={`m-cell m-row-head ${hover.r === rowIdx ? "is-hover" : ""}`}
              data-r={rowIdx}
              onMouseEnter={() => setHover({ r: rowIdx, c: null })}>
              
                <span className="m-label">{r.label}</span>
              </div>
              {r.cells.map((items, colIdx) =>
            <div
              className={`m-cell m-data ${dataIsActive(rowIdx, colIdx) ? "is-hover" : ""}`}
              data-r={rowIdx}
              data-c={colIdx}
              onMouseEnter={() => setHover({ r: rowIdx, c: colIdx })}
              key={colIdx}>
              
                  <ul>
                    {items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
            )}
            </React.Fragment>
          )}
        </div>
        <ServicesMobile data={data} layout={mobileLayout} />
      </div>
    </section>);

}

// Mobile/tablet replacement for the x/y matrix. The matrix folds two
// meaningful axes (service type × audience) plus the audience→page
// links into a 4-col grid that can't survive <880px. Here the column
// axis (audience) becomes either a tab selector or a stack of cards,
// and each audience's three service groups read as labelled lists.
// Desktop never sees this (CSS hides it >880px).
function ServicesMobile({ data, layout }) {
  const [active, setActive] = useState(0);
  const short = (lbl) => lbl.replace(/^For\s+/, "").split(/\s*&\s*/)[0];

  if (layout === "cards") {
    return (
      <div className="svc-m svc-m--cards">
        {data.audiences.map((a, c) =>
        <a className="svc-m-card" href={a.href} key={a.label}>
            <div className="svc-m-card-head">
              <span className="svc-m-card-name">{a.label}</span>
              <span className="svc-m-card-arr" aria-hidden="true">→</span>
            </div>
            <div className="svc-m-card-body">
              {data.rows.map((r) =>
            <div className="svc-m-group" key={r.label}>
                  <div className="svc-m-group-label">{r.label}</div>
                  <ul>{r.cells[c].map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
            )}
            </div>
          </a>
        )}
      </div>);

  }

  const a = data.audiences[active];
  return (
    <div className="svc-m svc-m--tabs">
      <div className="svc-m-tabs" role="tablist">
        {data.audiences.map((aud, c) =>
        <button
          key={aud.label}
          role="tab"
          aria-selected={active === c}
          className={`svc-m-tab ${active === c ? "is-active" : ""}`}
          onClick={() => setActive(c)}>
          
            For {short(aud.label)}
          </button>
        )}
      </div>
      <div className="svc-m-panel">
        <div className="svc-m-groups">
          {data.rows.map((r) =>
          <div className="svc-m-group" key={r.label}>
              <div className="svc-m-group-label">{r.label}</div>
              <ul>{r.cells[active].map((it) => <li key={it}>{it}</li>)}</ul>
            </div>
          )}
        </div>
        <a className="svc-m-cta" href={a.href}>
          Explore {short(a.label)} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>);

}

function Epigraph() {
  // Quiet typographic break between Approach (conceptual frame) and
  // ServicesList (matrix). A single client quote sits between them as
  // a frontispiece for the menu of services. Uses the same testimonial
  // copy as the Erlund card below so this isn't new content the user
  // hasn't seen elsewhere on the page.
  return (
    <section className="section--epigraph">
      <div className="epigraph-container">
        <div className="epigraph-rule" />
        <div className="epigraph-grid">
          <aside className="epigraph-side">
            <div className="epigraph-mark">Epigraph</div>
            <div className="epigraph-meta">
              <span className="epigraph-who">— Sophie Erlund</span>
              <span className="epigraph-org">Chair of Art in Architecture, TUM</span>
            </div>
          </aside>
          <blockquote className="epigraph-quote">
            Matteo has a unique ability to <em>frame</em> complex ideas, and to capture not only the technical but the <em>philosophical</em> questions in the work.
          </blockquote>
        </div>
        <div className="epigraph-rule" />
      </div>
    </section>);

}

function Avatar({ t, size = 56 }) {
  const tones = [
  "linear-gradient(135deg, #6b3232, #5d2a2a)",
  "linear-gradient(135deg, #4d2929, #3a1d1d)",
  "linear-gradient(135deg, #7a4a3a, #5d2a2a)"];

  if (t.photo) {
    return (
      <img
        className="avatar avatar-photo"
        src={t.photo}
        alt={t.who}
        style={{ width: size, height: size }} />);

  }

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: tones[(t.tone - 1) % 3],
        fontSize: size + "px"
      }}>
      
      <span className="avatar-init">{t.initials}</span>
    </div>);

}

function Testimonials({ items }) {
  return (
    <section id="testimonials" className="section section--testimonials">
      <Spot id="ts-ear" posClass="marginalia-ts-ear">
        <Ear />
      </Spot>
      <div className="container" style={{ fontFamily: "\"Instrument Serif\"" }}>
        <div className="sec-head">
          <div className="sec-num">№ 05 / Testimonials</div>
          <h2 className="sec-title">A <em>word</em> from<br />my clients.</h2>
        </div>
        <div className="ts-grid">
          {items.map((t) =>
          <figure className={`ts ${t.size}`} key={t.id}>
              <blockquote dangerouslySetInnerHTML={{ __html: t.quote }} />
              {t.body && <p className="ts-body" dangerouslySetInnerHTML={{ __html: t.body }} />}
              <div className="ts-head">
                <Avatar t={t} size={t.size === "lg" ? 64 : t.size === "md" ? 52 : 44} />
                <figcaption>
                  <span className="ts-who">{t.who}</span>
                  <span className="ts-org">{t.org}</span>
                  {t.city && <span className="ts-city">{t.city}</span>}
                </figcaption>
              </div>
            </figure>
          )}
        </div>
        <p className="rail-hint">Swipe for more <span aria-hidden="true">→</span></p>
      </div>
    </section>);

}

function CTA({ data }) {
  const mailto = `mailto:${data.email}?subject=${encodeURIComponent("Hello — let's talk")}`;
  return (
    <section id="book" className="section section--cta">
      <Spot id="cta-env" posClass="marginalia-cta-env">
        <Envelope />
      </Spot>
      <div className="container">
        <div className="sec-head">
          <div className="sec-num">{data.sectionNum}</div>
          <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: data.title }} />
        </div>
        <div className="ctaA">
          <div className="ctaA-method">
            {data.method.map((m) =>
            <div className="ctaA-beat" key={m.n}>
                <span className="ctaA-num">{m.n}</span>
                <div>
                  <h4 className="ctaA-t">{m.t}</h4>
                  <p className="ctaA-b">{m.b}</p>
                </div>
              </div>
            )}
          </div>
          <div className="ctaA-panel">
            <p className="ctaA-open">{data.open}</p>
            <p className="ctaA-invite">{data.invite}</p>
            <a className="ctaA-btn" href={mailto}>{data.btnText} <span className="arr">→</span></a>
            <div className="ctaA-meta">
              <span style={{ color: "rgb(201, 122, 85)" }}>{data.email}</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="foot">
      <Spot id="foot-lens" posClass="marginalia-foot-lens">
        <LensRays />
      </Spot>
      <div className="container foot-inner">
        <span>© 2026 · Clarity for Complex Work</span>
        <span>Set in Instrument Serif · Printed in Berlin</span>
        <span><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></span>
      </div>
    </footer>);

}

// ─── Tweaks panel ───────────────────────────────────────────

function Tweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakColor
        label="Paper · Ink · Accent"
        value={t.palette}
        options={PALETTES}
        onChange={(v) => setTweak("palette", v)} />
      
      <TweakSection label="Typography" />
      <TweakSelect
        label="Display font"
        value={t.displayFont}
        options={FONTS.map((f) => ({ value: f.id, label: f.label }))}
        onChange={(v) => setTweak("displayFont", v)} />
      
      <TweakSection label="Editorial" />
      <TweakSlider
        label="Whimsy"
        value={t.whimsy}
        min={0} max={100} step={5}
        onChange={(v) => setTweak("whimsy", v)} />
      
      <TweakRadio
        label="Catalogue layout"
        value={t.catalogueLayout}
        options={[
        { value: "list", label: "List" },
        { value: "grid", label: "Grid" },
        { value: "hybrid", label: "Hybrid" }]
        }
        onChange={(v) => setTweak("catalogueLayout", v)} />

      <TweakRadio
        label="Services (mobile)"
        value={t.servicesMobileLayout}
        options={[
        { value: "tabs", label: "Tabs" },
        { value: "cards", label: "Cards" }]
        }
        onChange={(v) => setTweak("servicesMobileLayout", v)} />
      
      <TweakRadio
        label="Credentials"
        value={t.credMotion}
        options={[
        { value: "marquee", label: "Marquee" },
        { value: "fade", label: "Fade" },
        { value: "flicker", label: "Flicker" }]
        }
        onChange={(v) => setTweak("credMotion", v)} />

      <TweakSection label="Marginalia" />
      <TweakRadio
        label="Drawing color"
        value={t.margFill}
        options={[
        { value: "yellow", label: "Yellow" },
        { value: "oxblood", label: "Oxblood" }]
        }
        onChange={(v) => setTweak("margFill", v)} />
      <TweakButton
        label="Reset drawing positions"
        secondary={true}
        onClick={() => resetAllMarginalia()} />
      
    </TweaksPanel>);

}

// ─── App ─────────────────────────────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const data = window.SITE_DATA;

  useEffect(() => {applyPalette(t.palette);}, [t.palette]);
  useEffect(() => {applyFont(t.displayFont);}, [t.displayFont]);
  useEffect(() => {applyMargFill(t.margFill);}, [t.margFill]);

  const whimsyClass = t.whimsy < 20 ? "whimsy-off" : "";
  document.body.style.setProperty("--whimsy", t.whimsy / 100);

  return (
    <div className={whimsyClass}>
      <Nav />
      <Hero data={data} />
      <Credentials items={data.credentials} intro={data.credentialsIntro} mode={t.credMotion} />
      <Catalogue entries={data.catalogue} layout={t.catalogueLayout} />
      <Approach data={data.approach} />
      <ServicesList data={data.services} mobileLayout={t.servicesMobileLayout} />
      <Testimonials items={data.testimonials} />
      <CTA data={data.cta} />
      <Footer />
      <Tweaks t={t} setTweak={setTweak} />
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);