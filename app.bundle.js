function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} = React;
const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}
function TweaksPanel({
  title = 'Tweaks',
  noDeckControls = false,
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const hasDeckStage = React.useMemo(() => typeof document !== 'undefined' && !!document.querySelector('deck-stage'), []);
  const [railEnabled, setRailEnabled] = React.useState(() => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled);
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = e => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try {
      return localStorage.getItem('deck-stage.railVisible') !== '0';
    } catch (e) {
      return true;
    }
  });
  const toggleRail = on => {
    setRailVisible(on);
    window.postMessage({
      type: '__deck_rail_visible',
      on
    }, '*');
  };
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return React.createElement(React.Fragment, null, React.createElement("style", null, __TWEAKS_STYLE), React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-noncommentable": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, React.createElement("b", null, title), React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), React.createElement("div", {
    className: "twk-body"
  }, children, hasDeckStage && railEnabled && !noDeckControls && React.createElement(TweakSection, {
    label: "Deck"
  }, React.createElement(TweakToggle, {
    label: "Thumbnail rail",
    value: railVisible,
    onChange: toggleRail
  })))));
}
function TweakSection({
  label,
  children
}) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, React.createElement("div", {
    className: "twk-lbl"
  }, React.createElement("span", null, label), value != null && React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}
function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return React.createElement("div", {
    className: "twk-row twk-row-h"
  }, React.createElement("div", {
    className: "twk-lbl"
  }, React.createElement("span", null, label)), React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return React.createElement(TweakRow, {
    label: label
  }, React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return React.createElement(TweakRow, {
    label: label
  }, React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return React.createElement(TweakRow, {
    label: label
  }, React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return React.createElement("div", {
    className: "twk-num"
  }, React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return React.createElement("div", {
      className: "twk-row twk-row-h"
    }, React.createElement("div", {
      className: "twk-lbl"
    }, React.createElement("span", null, label)), React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return React.createElement(TweakRow, {
    label: label
  }, React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && React.createElement("span", null, sup.map((c, j) => React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
function RoughDefs({
  id,
  seed = 3,
  scale = 1.0,
  freq = 0.035
}) {
  return React.createElement("defs", null, React.createElement("filter", {
    id: id,
    x: "-15%",
    y: "-15%",
    width: "130%",
    height: "130%"
  }, React.createElement("feTurbulence", {
    type: "fractalNoise",
    baseFrequency: freq,
    numOctaves: "2",
    seed: seed
  }), React.createElement("feDisplacementMap", {
    in: "SourceGraphic",
    scale: scale
  })));
}
function Sparkle({
  cx,
  cy,
  r = 10,
  rot = 0
}) {
  const pts = `${cx},${cy - r} ${cx + r * 0.36},${cy} ${cx},${cy + r} ${cx - r * 0.36},${cy}`;
  return React.createElement("polygon", {
    points: pts,
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    transform: rot ? `rotate(${rot} ${cx} ${cy})` : undefined
  });
}
const DEFAULT_POS = {
  "cat-mag": {
    dx: -495,
    dy: -10
  },
  "appr-sprout": {
    dx: -493,
    dy: -29
  },
  "svc-diamond": {
    dx: -484,
    dy: -190
  },
  "svc-catalog": {
    dx: -494,
    dy: 519
  },
  "ts-ear": {
    dx: -488,
    dy: -17
  },
  "cta-env": {
    dx: -501,
    dy: 10
  },
  "foot-lens": {
    dx: -90,
    dy: -52
  }
};
function defaultPos(id) {
  const d = DEFAULT_POS[id];
  return d ? {
    dx: d.dx,
    dy: d.dy
  } : {
    dx: 0,
    dy: 0
  };
}
const TABLET_POS = {
  "cat-mag": {
    dx: -285,
    dy: 106
  },
  "appr-sprout": {
    dx: -284,
    dy: 94
  },
  "svc-diamond": {
    dx: -281,
    dy: 75
  },
  "svc-catalog": {
    dx: -278,
    dy: 379
  },
  "ts-ear": {
    dx: -282,
    dy: 100
  },
  "cta-env": {
    dx: -280,
    dy: 117
  },
  "foot-lens": {
    dx: 136,
    dy: -82
  }
};
const MOBILE_POS = {
  "cat-mag": {
    dx: -58,
    dy: 105
  },
  "appr-sprout": {
    dx: -56,
    dy: 92
  },
  "svc-diamond": {
    dx: 273,
    dy: 105
  },
  "svc-catalog": {
    dx: -55,
    dy: 479
  },
  "ts-ear": {
    dx: -54,
    dy: 101
  },
  "cta-env": {
    dx: -52,
    dy: 114
  },
  "foot-lens": {
    dx: 317,
    dy: -137
  }
};
const MOBILE_MQ = "(max-width: 560px)";
const TABLET_MQ = "(min-width: 561px) and (max-width: 880px)";
function currentMode() {
  if (typeof window === "undefined" || !window.matchMedia) return "desktop";
  if (window.matchMedia(MOBILE_MQ).matches) return "mobile";
  if (window.matchMedia(TABLET_MQ).matches) return "tablet";
  return "desktop";
}
function posKey(id, mode) {
  return mode === "desktop" ? "marg-pos3-" + id : "marg-pos3-" + mode + "-" + id;
}
function defaultPosFor(id, mode) {
  if (mode === "desktop") return defaultPos(id);
  const baked = (mode === "tablet" ? TABLET_POS : MOBILE_POS)[id];
  return baked ? {
    dx: baked.dx,
    dy: baked.dy
  } : {
    dx: 0,
    dy: 0
  };
}
function loadPosFor(id, mode, placing) {
  if (placing) {
    try {
      const raw = localStorage.getItem(posKey(id, mode));
      if (raw) {
        const p = JSON.parse(raw);
        if (p && typeof p.dx === "number" && typeof p.dy === "number") return p;
      }
    } catch (e) {}
  }
  return defaultPosFor(id, mode);
}
function useDraggable(id, placing) {
  const [mode, setMode] = useState(() => currentMode());
  const [pos, setPos] = useState(() => loadPosFor(id, currentMode(), placing));
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
      setPos(loadPosFor(id, m, placing));
    };
    mqs.forEach(mq => mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange));
    return () => mqs.forEach(mq => mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange));
  }, [id]);
  useEffect(() => {
    const onReset = () => {
      const m = modeRef.current;
      setPos(defaultPosFor(id, m));
      try {
        localStorage.removeItem(posKey(id, m));
      } catch (e) {}
    };
    window.addEventListener("marginalia:reset", onReset);
    return () => window.removeEventListener("marginalia:reset", onReset);
  }, [id]);
  const onPointerDown = useCallback(e => {
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      origDx: posRef.current.dx,
      origDy: posRef.current.dy,
      dx: posRef.current.dx,
      dy: posRef.current.dy,
      moved: false
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
    e.preventDefault();
  }, []);
  const onPointerMove = useCallback(e => {
    if (!drag.current) return;
    const dx = drag.current.origDx + (e.clientX - drag.current.startX);
    const dy = drag.current.origDy + (e.clientY - drag.current.startY);
    drag.current.dx = dx;
    drag.current.dy = dy;
    if (Math.abs(dx - drag.current.origDx) > 2 || Math.abs(dy - drag.current.origDy) > 2) {
      drag.current.moved = true;
    }
    setPos({
      dx,
      dy
    });
  }, []);
  const onPointerUp = useCallback(() => {
    if (!drag.current) return;
    if (drag.current.moved) {
      const final = {
        dx: drag.current.dx,
        dy: drag.current.dy
      };
      setPos(final);
      try {
        localStorage.setItem(posKey(id, modeRef.current), JSON.stringify(final));
      } catch (err) {}
    }
    drag.current = null;
  }, [id]);
  return {
    style: {
      "--dx": pos.dx + "px",
      "--dy": pos.dy + "px"
    },
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp
    }
  };
}
function Spot({
  id,
  posClass,
  children,
  placing
}) {
  const {
    style,
    handlers
  } = useDraggable(id, placing);
  const placingStyle = placing ? {
    ...style,
    pointerEvents: "auto",
    cursor: "grab",
    touchAction: "none"
  } : style;
  return React.createElement("div", _extends({
    className: `marginalia ${posClass}`,
    style: placingStyle
  }, placing ? handlers : {}, {
    "aria-hidden": "true"
  }), children);
}
function resetAllMarginalia() {
  window.dispatchEvent(new Event("marginalia:reset"));
}
function SVG({
  viewBox,
  children
}) {
  return React.createElement("svg", {
    viewBox: viewBox,
    style: {
      display: "block",
      width: "100%",
      height: "auto",
      overflow: "visible"
    },
    "aria-hidden": "true"
  }, children);
}
function Eye({}) {
  const fId = "rough-eye-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 240 180"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 7,
    scale: 2.6,
    freq: 0.06
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M 8,120 C 22,40 96,8 168,24 C 196,32 220,64 232,108",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "8.5"
  }), React.createElement("path", {
    d: "M 18,118 C 70,156 178,156 230,108",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "5.5"
  }), React.createElement("ellipse", {
    cx: "118",
    cy: "100",
    rx: "66",
    ry: "62",
    fill: "var(--ill-ink)"
  }), React.createElement("path", {
    d: "M 138,68 L 154,62 L 146,90 Z",
    fill: "#FFFCF1"
  })), React.createElement(Sparkle, {
    cx: 222,
    cy: 20,
    r: 10,
    rot: 10
  }));
}
function Magnifier({}) {
  const fId = "rough-mag-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 220 220"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 3,
    scale: 1.1
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("line", {
    x1: "142",
    y1: "124",
    x2: "202",
    y2: "184",
    stroke: "var(--ill-ink)",
    strokeWidth: "28",
    strokeLinecap: "round"
  }), React.createElement("line", {
    x1: "142",
    y1: "124",
    x2: "202",
    y2: "184",
    stroke: "var(--ill-fill)",
    strokeWidth: "20",
    strokeLinecap: "round"
  }), React.createElement("circle", {
    cx: "86",
    cy: "86",
    r: "58",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "7"
  }), React.createElement("path", {
    d: "M 52,56 C 60,46 78,42 92,48",
    fill: "none",
    stroke: "var(--ill-fill)",
    strokeWidth: "7",
    strokeLinecap: "round"
  }), React.createElement("path", {
    d: "M 48,72 C 52,68 60,68 64,70",
    fill: "none",
    stroke: "var(--ill-fill)",
    strokeWidth: "5",
    strokeLinecap: "round"
  })));
}
function Sprout({}) {
  const fId = "rough-sprout-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 160 220"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 11,
    scale: 1.0
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M 28,200 C 56,194 110,196 132,200",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "3"
  }), React.createElement("path", {
    d: "M 80,200 C 75,160 90,120 78,80 C 72,60 78,46 84,30",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "5"
  }), React.createElement("path", {
    d: "M 78,98 C 42,86 22,112 38,134 C 60,138 78,120 78,98 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "5"
  }), React.createElement("path", {
    d: "M 82,52 C 124,42 144,68 130,90 C 110,96 84,78 82,52 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "5"
  })), React.createElement(Sparkle, {
    cx: 120,
    cy: 18,
    r: 8,
    rot: 8
  }));
}
function Ear({}) {
  const fId = "rough-ear-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 180 220"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 5,
    scale: 1.0
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M 56,30 C 30,40 22,82 30,128 C 36,170 64,200 92,196 C 110,194 116,182 110,170 C 100,150 108,138 120,128 C 138,116 142,90 134,68 C 124,40 92,20 56,30 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "5"
  }), React.createElement("path", {
    d: "M 70,70 C 56,84 56,118 70,140 C 82,156 100,154 100,140",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 82,108 C 88,106 94,110 92,118",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "3"
  }), React.createElement("path", {
    d: "M 154,80 L 174,72",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 158,108 L 178,108",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 154,136 L 174,144",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  })));
}
function OpenBook({}) {
  const fId = "rough-book-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 340 240"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 29,
    scale: 1.0
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M 108,34 C 148,18 200,18 240,34",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "2.5"
  }), React.createElement("path", {
    d: "M 132,20 C 158,10 188,10 216,20",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "2"
  }), React.createElement("path", {
    d: "M 26,176 C 68,196 132,202 170,204 C 208,202 272,196 314,176 C 314,168 312,164 310,164 C 272,178 132,180 30,164 C 28,166 26,170 26,176 Z",
    fill: "var(--ill-ink)"
  }), React.createElement("path", {
    d: "M 40,58 C 82,52 134,72 162,86 L 162,176 C 134,186 82,184 44,178 C 32,168 28,112 40,58 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 300,58 C 258,52 206,72 178,86 L 178,176 C 206,186 258,184 296,178 C 308,168 312,112 300,58 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 162,86 L 162,176",
    stroke: "var(--ill-ink)",
    strokeWidth: "3",
    fill: "none"
  }), React.createElement("path", {
    d: "M 178,86 L 178,176",
    stroke: "var(--ill-ink)",
    strokeWidth: "3",
    fill: "none"
  }), React.createElement("path", {
    d: "M 156,176 L 170,200 L 184,176 Z",
    fill: "var(--ill-ink)",
    stroke: "var(--ill-ink)",
    strokeWidth: "2.5"
  }), React.createElement("path", {
    d: "M 44,180 C 82,188 132,188 162,184",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.4",
    fill: "none"
  }), React.createElement("path", {
    d: "M 38,184 C 82,192 132,192 162,188",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.4",
    fill: "none"
  }), React.createElement("path", {
    d: "M 34,188 C 82,196 132,196 162,192",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.4",
    fill: "none"
  }), React.createElement("path", {
    d: "M 30,192 C 82,200 132,200 162,196",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.4",
    fill: "none"
  }), React.createElement("path", {
    d: "M 296,180 C 258,188 208,188 178,184",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.4",
    fill: "none"
  }), React.createElement("path", {
    d: "M 302,184 C 258,192 208,192 178,188",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.4",
    fill: "none"
  }), React.createElement("path", {
    d: "M 306,188 C 258,196 208,196 178,192",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.4",
    fill: "none"
  }), React.createElement("path", {
    d: "M 310,192 C 258,200 208,200 178,196",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.4",
    fill: "none"
  })));
}
function CardCatalog({}) {
  const fId = "rough-cc-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 240 220"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 31,
    scale: 1.0
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M 50,60 L 220,60 L 200,82 L 30,82 Z",
    fill: "var(--ill-ink)",
    stroke: "var(--ill-ink)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 44,52 L 70,52 L 72,38 L 44,38 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 72,60 L 98,60 L 100,46 L 72,46 Z",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 100,42 L 126,42 L 128,28 L 100,28 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 128,56 L 154,56 L 156,42 L 128,42 Z",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 156,48 L 182,48 L 184,34 L 156,34 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 184,58 L 206,58 L 208,44 L 184,44 Z",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 50,46 L 66,46",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.5"
  }), React.createElement("path", {
    d: "M 106,36 L 122,36",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.5"
  }), React.createElement("path", {
    d: "M 162,42 L 178,42",
    stroke: "var(--ill-ink)",
    strokeWidth: "1.5"
  }), React.createElement("path", {
    d: "M 30,82 L 200,82 L 200,200 L 30,200 Z",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "6"
  }), React.createElement("path", {
    d: "M 200,82 L 220,60 L 220,178 L 200,200",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "5"
  }), React.createElement("path", {
    d: "M 44,92 L 188,92",
    stroke: "var(--ill-ink)",
    strokeWidth: "2"
  }), React.createElement("path", {
    d: "M 44,100 L 188,100",
    stroke: "var(--ill-ink)",
    strokeWidth: "2"
  }), React.createElement("rect", {
    x: "82",
    y: "126",
    width: "66",
    height: "22",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("path", {
    d: "M 92,138 L 138,138",
    stroke: "var(--ill-ink)",
    strokeWidth: "2"
  }), React.createElement("path", {
    d: "M 100,168 C 100,188 130,188 130,168",
    fill: "var(--ill-ink)",
    stroke: "var(--ill-ink)",
    strokeWidth: "4"
  })), React.createElement(Sparkle, {
    cx: 20,
    cy: 14,
    r: 8,
    rot: 10
  }));
}
function Envelope({}) {
  const fId = "rough-env-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 240 180"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 17,
    scale: 1.0
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M 16,48 L 224,48 L 224,156 L 16,156 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "6"
  }), React.createElement("path", {
    d: "M 16,48 L 120,108 L 224,48",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "5"
  }), React.createElement("path", {
    d: "M 170,16 L 220,16 L 220,60 L 170,60 Z",
    fill: "var(--ill-ink)",
    stroke: "var(--ill-ink)",
    strokeWidth: "4"
  }), React.createElement("circle", {
    cx: "140",
    cy: "38",
    r: "22",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5"
  }), React.createElement("circle", {
    cx: "140",
    cy: "38",
    r: "13",
    fill: "none",
    stroke: "var(--ill-ink)",
    strokeWidth: "2"
  })));
}
function LensRays({}) {
  const fId = "rough-lens-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 280 180"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 23,
    scale: 0.9
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M 10,52 L 102,52",
    stroke: "var(--ill-ink)",
    strokeWidth: "2",
    fill: "none"
  }), React.createElement("path", {
    d: "M 10,90 L 102,90",
    stroke: "var(--ill-ink)",
    strokeWidth: "2",
    fill: "none"
  }), React.createElement("path", {
    d: "M 10,128 L 102,128",
    stroke: "var(--ill-ink)",
    strokeWidth: "2",
    fill: "none"
  }), React.createElement("path", {
    d: "M 120,16 C 152,40 152,140 120,164 C 88,140 88,40 120,16 Z",
    fill: "var(--ill-fill)",
    stroke: "var(--ill-ink)",
    strokeWidth: "5.5"
  }), React.createElement("path", {
    d: "M 138,52 L 248,82",
    stroke: "var(--ill-ink)",
    strokeWidth: "2",
    fill: "none"
  }), React.createElement("path", {
    d: "M 138,90 L 248,90",
    stroke: "var(--ill-ink)",
    strokeWidth: "2",
    fill: "none"
  }), React.createElement("path", {
    d: "M 138,128 L 248,98",
    stroke: "var(--ill-ink)",
    strokeWidth: "2",
    fill: "none"
  }), React.createElement("circle", {
    cx: "252",
    cy: "90",
    r: "2.5",
    fill: "var(--ill-ink)"
  })));
}
function Diamond({}) {
  const fId = "rough-diamond-" + Math.random().toString(36).slice(2, 7);
  return React.createElement(SVG, {
    viewBox: "0 0 240 220"
  }, React.createElement(RoughDefs, {
    id: fId,
    seed: 11,
    scale: 1.4,
    freq: 0.04
  }), React.createElement("g", {
    filter: `url(#${fId})`,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M 120,8 L 120,28",
    stroke: "var(--ill-fill)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 56,30 L 70,46",
    stroke: "var(--ill-fill)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 184,30 L 170,46",
    stroke: "var(--ill-fill)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 88,18 L 96,38",
    stroke: "var(--ill-fill)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 152,18 L 144,38",
    stroke: "var(--ill-fill)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 22,68 L 40,72",
    stroke: "var(--ill-fill)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 218,68 L 200,72",
    stroke: "var(--ill-fill)",
    strokeWidth: "4"
  }), React.createElement("path", {
    d: "M 34,108 L 206,108",
    stroke: "var(--ill-ink)",
    strokeWidth: "3.5",
    fill: "none"
  }), React.createElement("path", {
    d: "M 84,72 L 156,72",
    stroke: "var(--ill-ink)",
    strokeWidth: "6",
    fill: "none"
  }), React.createElement("path", {
    d: "M 84,72 L 34,108",
    stroke: "var(--ill-ink)",
    strokeWidth: "6",
    fill: "none"
  }), React.createElement("path", {
    d: "M 156,72 L 206,108",
    stroke: "var(--ill-ink)",
    strokeWidth: "6",
    fill: "none"
  }), React.createElement("path", {
    d: "M 34,108 L 120,206",
    stroke: "var(--ill-ink)",
    strokeWidth: "6",
    fill: "none"
  }), React.createElement("path", {
    d: "M 206,108 L 120,206",
    stroke: "var(--ill-ink)",
    strokeWidth: "6",
    fill: "none"
  }), React.createElement("path", {
    d: "M 84,72 L 108,108 L 120,72 L 132,108 L 156,72",
    stroke: "var(--ill-ink)",
    strokeWidth: "3",
    fill: "none"
  }), React.createElement("path", {
    d: "M 108,108 L 120,206",
    stroke: "var(--ill-ink)",
    strokeWidth: "3",
    fill: "none"
  }), React.createElement("path", {
    d: "M 132,108 L 120,206",
    stroke: "var(--ill-ink)",
    strokeWidth: "3",
    fill: "none"
  })));
}
Object.assign(window, {
  Eye,
  Magnifier,
  Sprout,
  Ear,
  OpenBook,
  CardCatalog,
  Envelope,
  LensRays,
  Diamond,
  Typewriter: OpenBook,
  Rolodex: CardCatalog,
  FilingCabinet: CardCatalog,
  Sparkle,
  Spot,
  resetAllMarginalia
});
const TWEAK_DEFAULTS = {
  "palette": ["#FAF4E6", "#171513", "#5D2A2A"],
  "displayFont": "Instrument Serif",
  "whimsy": 60,
  "credMotion": "fade",
  "catalogueLayout": "grid",
  "darkSections": true,
  "margFill": "yellow",
  "servicesMobileLayout": "tabs"
};
const MARG_FILLS = {
  yellow: "#E2B23A",
  oxblood: "var(--accent)"
};
function applyMargFill(key) {
  const r = document.documentElement;
  r.style.setProperty("--ill-fill", MARG_FILLS[key] || MARG_FILLS.yellow);
  r.style.setProperty("--ill-ink", "var(--ink)");
}
const PALETTES = [["#EFE2C9", "#191713", "#9C4A1A"], ["#F4ECDC", "#1A1814", "#7A2E1F"], ["#FAF4E6", "#171513", "#5D2A2A"], ["#EDE4D3", "#22201C", "#3A4A2E"], ["#F1E7D0", "#1C1A16", "#2C3F5C"]];
const FONTS = [{
  id: "Old Standard TT",
  label: "Old Standard (Caslon)",
  stack: "'Old Standard TT', Georgia, serif"
}, {
  id: "EB Garamond",
  label: "EB Garamond",
  stack: "'EB Garamond', Georgia, serif"
}, {
  id: "Instrument Serif",
  label: "Instrument Serif",
  stack: "'Instrument Serif', Georgia, serif"
}, {
  id: "Playfair Display",
  label: "Playfair Display",
  stack: "'Playfair Display', Georgia, serif"
}];
function applyPalette(p) {
  const r = document.documentElement;
  r.style.setProperty("--paper", p[0]);
  r.style.setProperty("--ink", p[1]);
  r.style.setProperty("--accent", p[2]);
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
  const f = c => {
    const v = amt > 0 ? c + (255 - c) * amt : c * (1 + amt);
    return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  };
  return "#" + f(r) + f(g) + f(b);
}
function applyFont(id) {
  const f = FONTS.find(x => x.id === id) || FONTS[0];
  document.documentElement.style.setProperty("--display", f.stack);
}
function Nav() {
  return React.createElement("nav", {
    className: "nav"
  }, React.createElement("div", {
    className: "container nav-inner"
  }, React.createElement("span", {
    className: "nav-mark"
  }, "Clarity ", React.createElement("em", null, "for"), " Complex Work"), React.createElement("button", {
    className: "nav-toggle",
    type: "button",
    "aria-label": "Toggle menu",
    "aria-expanded": "false"
  }, React.createElement("span", {
    className: "nav-toggle-menu"
  }, "Menu"), React.createElement("span", {
    className: "nav-toggle-x"
  }, "Close")), React.createElement("div", {
    className: "nav-links"
  }, React.createElement("a", {
    href: "on-complex-work.html"
  }, "On Complex Work"), React.createElement("a", {
    href: "for-scale-ups.html"
  }, "For Scale-Ups"), React.createElement("a", {
    href: "for-ngos.html"
  }, "For NGOs"), React.createElement("a", {
    href: "for-artists.html"
  }, "For Artists / Galleries"), React.createElement("a", {
    href: "clarity-sessions.html"
  }, "The Clarity Sessions")), React.createElement("div", {
    className: "nav-personal"
  }, React.createElement("a", {
    href: "about.html"
  }, "About Me"), React.createElement("a", {
    className: "nav-contact",
    href: "mailto:matteo@clarityforcomplexwork.com"
  }, "Contact"))));
}
function Hero({
  data
}) {
  return React.createElement("header", {
    className: "hero"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "hero-eyebrow"
  }, React.createElement("span", null, "\u2116 001 \u2014 PRACTICE"), React.createElement("span", null, "Est. 2025"), React.createElement("span", {
    className: "he-rule",
    "aria-hidden": "true"
  }), React.createElement("span", {
    className: "he-vol"
  }, "Vol. VII \xB7 Berlin")), React.createElement("div", {
    className: "hero-grid"
  }, React.createElement("div", null, React.createElement("h1", {
    className: "hero-title"
  }, "Clarity", React.createElement("br", null), "for ", React.createElement("em", null, "Complex"), React.createElement("br", null), "Work."), React.createElement("p", {
    className: "hero-sub"
  }, "Strategic communications for work that resists easy summary \u2013 NGOs, scale-ups, artists, and art institutions."), React.createElement("div", {
    className: "hero-cta-row"
  }, React.createElement("a", {
    className: "hero-feature",
    href: "mailto:matteo@clarityforcomplexwork.com?subject=Hello%20%E2%80%94%20let%27s%20talk"
  }, React.createElement("span", {
    className: "hero-feature-title"
  }, "Get in touch"), React.createElement("span", {
    className: "hero-feature-arrow",
    "aria-hidden": "true"
  }, "\u2192")), React.createElement("a", {
    className: "hero-feature hero-feature--ghost",
    href: "on-complex-work.html"
  }, React.createElement("span", {
    className: "hero-feature-title"
  }, "What is complex work?"), React.createElement("span", {
    className: "hero-feature-arrow",
    "aria-hidden": "true"
  }, "\u2192")))), React.createElement("div", null, React.createElement("figure", {
    className: "hero-portrait"
  }, React.createElement("img", {
    src: "matteo-portrait-hd.jpeg",
    alt: `Portrait of ${data.founder}`,
    className: "ph-img"
  })), React.createElement("figcaption", {
    className: "hero-nameplate"
  }, React.createElement("span", {
    className: "np-rule"
  }), React.createElement("span", {
    className: "np-name"
  }, data.founder), React.createElement("span", {
    className: "np-role"
  }, "Founder"))))));
}
function Credentials({
  items,
  intro,
  mode
}) {
  return React.createElement("section", {
    className: "cred-section"
  }, React.createElement("div", {
    className: "container cred-grid"
  }, React.createElement("div", {
    className: "cred-intro"
  }, React.createElement("div", {
    className: "cred-eyebrow"
  }, "What Sets Me Apart"), React.createElement("p", {
    className: "dropcap"
  }, intro)), React.createElement("div", {
    className: `cred-flash cred-mode-${mode}`,
    "data-comment-anchor": "e904eb7e34-div-120-9"
  }, React.createElement("div", {
    className: "cred-flash-label"
  }, "Credentials"), React.createElement(CredFlash, {
    items: items,
    mode: mode
  }))));
}
function CredFlash({
  items,
  mode
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const speed = mode === "flicker" ? 1400 : 2400;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), speed);
    return () => clearInterval(t);
  }, [items.length, mode]);
  if (mode === "marquee") {
    return React.createElement("div", {
      className: "cred-ticker"
    }, React.createElement("ul", {
      style: {
        transform: `translateY(-${idx * 100}%)`
      }
    }, items.map((c, i) => React.createElement("li", {
      key: i
    }, c))));
  }
  return React.createElement("div", {
    className: "cred-stack"
  }, items.map((c, i) => React.createElement("div", {
    key: i,
    className: `cred-line ${i === idx ? "is-on" : ""}`
  }, React.createElement("span", {
    className: "cred-text"
  }, c))));
}
function Catalogue({
  entries,
  layout
}) {
  const featured = entries[0];
  const rest = entries.slice(1);
  return React.createElement("section", {
    id: "catalogue",
    className: "section section--catalogue"
  }, React.createElement(Spot, {
    id: "cat-mag",
    posClass: "marginalia-cat-mag"
  }, React.createElement(Magnifier, null)), React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "sec-head"
  }, React.createElement("div", {
    className: "sec-num"
  }, "\u2116 02 / Catalogue"), React.createElement("h2", {
    className: "sec-title"
  }, "A ", React.createElement("em", null, "catalogue"), React.createElement("br", null), "of work, in progress.")), React.createElement("p", {
    className: "cat-intro dropcap"
  }, "From NGOs and tech to artists and art galleries, my clients share a common problem: the complexity of their work makes it hard to reach internal clarity and an external audience. Here's a catalogue of ways I've helped."), layout === "list" && React.createElement("div", {
    className: "cat-list"
  }, entries.map(e => React.createElement(CatCard, {
    key: e.slug,
    e: e,
    variant: "full"
  }))), layout === "grid" && React.createElement("div", {
    className: "cat-grid"
  }, entries.map(e => React.createElement(CatCard, {
    key: e.slug,
    e: e,
    variant: "grid"
  }))), layout === "hybrid" && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "cat-featured-wrap"
  }, React.createElement(CatCard, {
    e: featured,
    variant: "featured"
  })), React.createElement("div", {
    className: "cat-grid"
  }, rest.map(e => React.createElement(CatCard, {
    key: e.slug,
    e: e,
    variant: "grid"
  })))), React.createElement("p", {
    className: "rail-hint"
  }, "Swipe through the catalogue ", React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))));
}
function CatCard({
  e,
  variant
}) {
  return React.createElement("article", {
    className: `cat-card cat-card--${variant}`
  }, React.createElement("div", {
    className: "cat-left-col"
  }, React.createElement("div", {
    className: "cat-num-col"
  }, React.createElement("span", {
    className: "cat-num-lg"
  }, e.n), React.createElement("span", {
    className: "cat-year"
  }, e.year)), React.createElement("div", {
    className: "cat-logo",
    style: e.bg ? {
      background: e.bg,
      borderColor: e.bg.startsWith("linear") ? "transparent" : e.bg,
      ...(e.borderTop ? {
        borderTopColor: e.borderTop
      } : {}),
      ...(e.borderBottom ? {
        borderBottomColor: e.borderBottom
      } : {}),
      ...(e.noBorder ? {
        border: "none"
      } : {})
    } : undefined
  }, e.logo ? React.createElement("img", {
    src: e.logo,
    alt: `${e.client} logo`,
    className: "logo-img",
    style: e.imgScale ? {
      transform: `scale(${e.imgScale})`
    } : undefined
  }) : React.createElement(React.Fragment, null, React.createElement("span", {
    className: "logo-mono"
  }, e.monogram), React.createElement("span", {
    className: "logo-hint"
  }, "Logo")))), React.createElement("div", {
    className: "cat-content"
  }, React.createElement("div", {
    className: "cat-tagline"
  }, React.createElement("span", {
    className: "cat-client-type"
  }, e.clientType), React.createElement("span", {
    className: "cat-sep"
  }, "\xB7"), React.createElement("span", {
    className: "cat-client"
  }, e.client)), React.createElement("h3", {
    className: "cat-deliv"
  }, e.deliverable), React.createElement("p", {
    className: "cat-desc"
  }, e.desc)));
}
function Approach({
  data
}) {
  return React.createElement("section", {
    id: "approach",
    className: "section section--approach"
  }, React.createElement(Spot, {
    id: "appr-sprout",
    posClass: "marginalia-appr-sprout"
  }, React.createElement(Sprout, null)), React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "sec-head"
  }, React.createElement("div", {
    className: "sec-num"
  }, "\u2116 03 / APPROACH"), React.createElement("div", null, React.createElement("h2", {
    className: "appr-hero",
    dangerouslySetInnerHTML: {
      __html: data.aphorism
    }
  }), React.createElement("p", {
    className: "appr-sub",
    dangerouslySetInnerHTML: {
      __html: data.subtitle
    }
  }))), React.createElement("div", {
    className: "appr-pillars"
  }, data.acts.map(a => React.createElement("div", {
    className: "appr-col",
    key: a.n
  }, React.createElement("div", {
    className: "appr-lbl"
  }, React.createElement("span", {
    className: "appr-num"
  }, a.n), " ", a.label), React.createElement("h4", {
    className: "appr-head",
    dangerouslySetInnerHTML: {
      __html: a.head
    }
  }), React.createElement("p", {
    className: "appr-body",
    dangerouslySetInnerHTML: {
      __html: a.body
    },
    style: {
      fontFamily: "\"Space Grotesk\""
    }
  }))))));
}
function ClaritySessions({
  data
}) {
  if (!data) return null;
  return React.createElement("article", {
    className: "clarity clarity--teaser"
  }, React.createElement("header", {
    className: "clarity-head"
  }, React.createElement("div", {
    className: "clarity-kicker"
  }, data.sectionKicker), React.createElement("h3", {
    className: "clarity-title"
  }, data.title, React.createElement("br", null), React.createElement("em", null, (() => {
    const w = String(data.subtitle).trim().split(/\s+/);
    if (w.length <= 2) return data.subtitle;
    return React.createElement(React.Fragment, null, w.slice(0, -2).join(" "), React.createElement("br", {
      className: "cs-sub-break"
    }), " " + w.slice(-2).join(" "));
  })())), React.createElement("div", {
    className: "clarity-format"
  }, data.format)), React.createElement("p", {
    className: "clarity-teaser-pitch"
  }, data.teaserPitch), React.createElement("a", {
    className: "clarity-more",
    href: data.pageUrl
  }, data.ctaLabel, " ", React.createElement("span", {
    className: "clarity-more-arr"
  }, "\u2192")));
}
function ServicesList({
  data,
  mobileLayout
}) {
  const [hover, setHover] = React.useState({
    r: null,
    c: null
  });
  const clear = () => setHover({
    r: null,
    c: null
  });
  const dataIsActive = (r, c) => hover.r === r && hover.c === c || hover.r === r && hover.c === null || hover.r === null && hover.c === c;
  const mode = hover.r !== null && hover.c !== null ? "cell" : hover.r !== null ? "row" : hover.c !== null ? "col" : "";
  return React.createElement("section", {
    id: "services",
    className: "section section--services"
  }, React.createElement(Spot, {
    id: "svc-diamond",
    posClass: "marginalia-svc-diamond"
  }, React.createElement(Diamond, null)), React.createElement(Spot, {
    id: "svc-catalog",
    posClass: "marginalia-svc-cabinet"
  }, React.createElement(CardCatalog, null)), React.createElement("div", {
    className: "container"
  }, React.createElement(ClaritySessions, {
    data: data.flagship
  }), React.createElement("div", {
    className: "svc-head svc-head--index"
  }, React.createElement("div", null), React.createElement("div", null, React.createElement("h2", {
    className: "sec-title"
  }, "An ", React.createElement("span", {
    style: {
      color: "#171513",
      fontStyle: "normal"
    }
  }, "index of"), React.createElement("br", null), React.createElement("em", {
    style: {
      color: "#5D2A2A"
    }
  }, "services.")), React.createElement("p", {
    className: "svc-sub",
    dangerouslySetInnerHTML: {
      __html: data.subhead
    }
  }))), React.createElement("div", {
    className: "m-grid",
    "data-mode": mode,
    onMouseLeave: clear
  }, React.createElement("div", {
    className: "m-cell m-corner"
  }), data.audiences.map((a, c) => React.createElement("a", {
    className: `m-cell m-col-head ${hover.c === c ? "is-hover" : ""}`,
    "data-c": c,
    key: a.label,
    href: a.href,
    onMouseEnter: () => setHover({
      r: null,
      c
    })
  }, React.createElement("span", {
    className: "m-label"
  }, a.label), React.createElement("span", {
    className: "m-col-more"
  }, "Read more ", React.createElement("span", {
    className: "m-col-arr",
    "aria-hidden": "true"
  }, "\u2192")))), data.rows.map((r, rowIdx) => React.createElement(React.Fragment, {
    key: r.label
  }, React.createElement("div", {
    className: `m-cell m-row-head ${hover.r === rowIdx ? "is-hover" : ""}`,
    "data-r": rowIdx,
    onMouseEnter: () => setHover({
      r: rowIdx,
      c: null
    })
  }, React.createElement("span", {
    className: "m-label"
  }, r.label)), r.cells.map((items, colIdx) => React.createElement("div", {
    className: `m-cell m-data ${dataIsActive(rowIdx, colIdx) ? "is-hover" : ""}`,
    "data-r": rowIdx,
    "data-c": colIdx,
    onMouseEnter: () => setHover({
      r: rowIdx,
      c: colIdx
    }),
    key: colIdx
  }, React.createElement("ul", null, items.map(it => React.createElement("li", {
    key: it
  }, it)))))))), React.createElement(ServicesMobile, {
    data: data,
    layout: mobileLayout
  })));
}
function ServicesMobile({
  data,
  layout
}) {
  const [active, setActive] = useState(0);
  const short = lbl => lbl.replace(/^For\s+/, "").split(/\s*&\s*/)[0];
  if (layout === "cards") {
    return React.createElement("div", {
      className: "svc-m svc-m--cards"
    }, data.audiences.map((a, c) => React.createElement("a", {
      className: "svc-m-card",
      href: a.href,
      key: a.label
    }, React.createElement("div", {
      className: "svc-m-card-head"
    }, React.createElement("span", {
      className: "svc-m-card-name"
    }, a.label), React.createElement("span", {
      className: "svc-m-card-arr",
      "aria-hidden": "true"
    }, "\u2192")), React.createElement("div", {
      className: "svc-m-card-body"
    }, data.rows.map(r => React.createElement("div", {
      className: "svc-m-group",
      key: r.label
    }, React.createElement("div", {
      className: "svc-m-group-label"
    }, r.label), React.createElement("ul", null, r.cells[c].map(it => React.createElement("li", {
      key: it
    }, it)))))))));
  }
  const a = data.audiences[active];
  return React.createElement("div", {
    className: "svc-m svc-m--tabs"
  }, React.createElement("div", {
    className: "svc-m-tabs",
    role: "tablist"
  }, data.audiences.map((aud, c) => React.createElement("button", {
    key: aud.label,
    role: "tab",
    "aria-selected": active === c,
    className: `svc-m-tab ${active === c ? "is-active" : ""}`,
    onClick: () => setActive(c)
  }, "For ", short(aud.label)))), React.createElement("div", {
    className: "svc-m-panel"
  }, React.createElement("div", {
    className: "svc-m-groups"
  }, data.rows.map(r => React.createElement("div", {
    className: "svc-m-group",
    key: r.label
  }, React.createElement("div", {
    className: "svc-m-group-label"
  }, r.label), React.createElement("ul", null, r.cells[active].map(it => React.createElement("li", {
    key: it
  }, it)))))), React.createElement("a", {
    className: "svc-m-cta",
    href: a.href
  }, "Explore ", short(a.label), " ", React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))));
}
function Epigraph() {
  return React.createElement("section", {
    className: "section--epigraph"
  }, React.createElement("div", {
    className: "epigraph-container"
  }, React.createElement("div", {
    className: "epigraph-rule"
  }), React.createElement("div", {
    className: "epigraph-grid"
  }, React.createElement("aside", {
    className: "epigraph-side"
  }, React.createElement("div", {
    className: "epigraph-mark"
  }, "Epigraph"), React.createElement("div", {
    className: "epigraph-meta"
  }, React.createElement("span", {
    className: "epigraph-who"
  }, "\u2014 Sophie Erlund"), React.createElement("span", {
    className: "epigraph-org"
  }, "Chair of Art in Architecture, TUM"))), React.createElement("blockquote", {
    className: "epigraph-quote"
  }, "Matteo has a unique ability to ", React.createElement("em", null, "frame"), " complex ideas, and to capture not only the technical but the ", React.createElement("em", null, "philosophical"), " questions in the work.")), React.createElement("div", {
    className: "epigraph-rule"
  })));
}
function Avatar({
  t,
  size = 56
}) {
  const tones = ["linear-gradient(135deg, #6b3232, #5d2a2a)", "linear-gradient(135deg, #4d2929, #3a1d1d)", "linear-gradient(135deg, #7a4a3a, #5d2a2a)"];
  if (t.photo) {
    return React.createElement("img", {
      className: "avatar avatar-photo",
      src: t.photo,
      alt: t.who,
      style: {
        width: size,
        height: size
      }
    });
  }
  return React.createElement("div", {
    className: "avatar",
    style: {
      width: size,
      height: size,
      background: tones[(t.tone - 1) % 3],
      fontSize: size + "px"
    }
  }, React.createElement("span", {
    className: "avatar-init"
  }, t.initials));
}
function Testimonials({
  items
}) {
  return React.createElement("section", {
    id: "testimonials",
    className: "section section--testimonials"
  }, React.createElement(Spot, {
    id: "ts-ear",
    posClass: "marginalia-ts-ear"
  }, React.createElement(Ear, null)), React.createElement("div", {
    className: "container",
    style: {
      fontFamily: "\"Instrument Serif\""
    }
  }, React.createElement("div", {
    className: "sec-head"
  }, React.createElement("div", {
    className: "sec-num"
  }, "\u2116 05 / Testimonials"), React.createElement("h2", {
    className: "sec-title"
  }, "A ", React.createElement("em", null, "word"), " from", React.createElement("br", null), "my clients.")), React.createElement("div", {
    className: "ts-grid"
  }, items.map(t => React.createElement("figure", {
    className: `ts ${t.size}`,
    key: t.id
  }, React.createElement("blockquote", {
    dangerouslySetInnerHTML: {
      __html: t.quote
    }
  }), t.body && React.createElement("p", {
    className: "ts-body",
    dangerouslySetInnerHTML: {
      __html: t.body
    }
  }), React.createElement("div", {
    className: "ts-head"
  }, React.createElement(Avatar, {
    t: t,
    size: t.size === "lg" ? 64 : t.size === "md" ? 52 : 44
  }), React.createElement("figcaption", null, React.createElement("span", {
    className: "ts-who"
  }, t.who), React.createElement("span", {
    className: "ts-org"
  }, t.org), t.city && React.createElement("span", {
    className: "ts-city"
  }, t.city)))))), React.createElement("p", {
    className: "rail-hint"
  }, "Swipe for more ", React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))));
}
function CTA({
  data
}) {
  const mailto = `mailto:${data.email}?subject=${encodeURIComponent("Hello — let's talk")}`;
  return React.createElement("section", {
    id: "book",
    className: "section section--cta"
  }, React.createElement(Spot, {
    id: "cta-env",
    posClass: "marginalia-cta-env"
  }, React.createElement(Envelope, null)), React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "sec-head"
  }, React.createElement("div", {
    className: "sec-num"
  }, data.sectionNum), React.createElement("h2", {
    className: "sec-title",
    dangerouslySetInnerHTML: {
      __html: data.title
    }
  })), React.createElement("div", {
    className: "ctaA"
  }, React.createElement("div", {
    className: "ctaA-method"
  }, data.method.map(m => React.createElement("div", {
    className: "ctaA-beat",
    key: m.n
  }, React.createElement("span", {
    className: "ctaA-num"
  }, m.n), React.createElement("div", null, React.createElement("h4", {
    className: "ctaA-t"
  }, m.t), React.createElement("p", {
    className: "ctaA-b"
  }, m.b))))), React.createElement("div", {
    className: "ctaA-panel"
  }, React.createElement("p", {
    className: "ctaA-open"
  }, data.open), React.createElement("p", {
    className: "ctaA-invite"
  }, data.invite), React.createElement("a", {
    className: "ctaA-btn",
    href: mailto
  }, data.btnText, " ", React.createElement("span", {
    className: "arr"
  }, "\u2192")), React.createElement("div", {
    className: "ctaA-meta"
  }, React.createElement("span", {
    style: {
      color: "rgb(201, 122, 85)"
    }
  }, data.email))))));
}
function Footer() {
  return React.createElement("footer", {
    className: "foot"
  }, React.createElement(Spot, {
    id: "foot-lens",
    posClass: "marginalia-foot-lens"
  }, React.createElement(LensRays, null)), React.createElement("div", {
    className: "container foot-inner"
  }, React.createElement("span", null, "\xA9 2026 \xB7 Clarity for Complex Work"), React.createElement("span", null, "Set in Instrument Serif \xB7 Printed in Berlin"), React.createElement("span", null, React.createElement("a", {
    href: "impressum.html"
  }, "Impressum"), " \xB7 ", React.createElement("a", {
    href: "datenschutz.html"
  }, "Datenschutz"))));
}
function Tweaks({
  t,
  setTweak
}) {
  return React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, React.createElement(TweakSection, {
    label: "Palette"
  }), React.createElement(TweakColor, {
    label: "Paper \xB7 Ink \xB7 Accent",
    value: t.palette,
    options: PALETTES,
    onChange: v => setTweak("palette", v)
  }), React.createElement(TweakSection, {
    label: "Typography"
  }), React.createElement(TweakSelect, {
    label: "Display font",
    value: t.displayFont,
    options: FONTS.map(f => ({
      value: f.id,
      label: f.label
    })),
    onChange: v => setTweak("displayFont", v)
  }), React.createElement(TweakSection, {
    label: "Editorial"
  }), React.createElement(TweakSlider, {
    label: "Whimsy",
    value: t.whimsy,
    min: 0,
    max: 100,
    step: 5,
    onChange: v => setTweak("whimsy", v)
  }), React.createElement(TweakRadio, {
    label: "Catalogue layout",
    value: t.catalogueLayout,
    options: [{
      value: "list",
      label: "List"
    }, {
      value: "grid",
      label: "Grid"
    }, {
      value: "hybrid",
      label: "Hybrid"
    }],
    onChange: v => setTweak("catalogueLayout", v)
  }), React.createElement(TweakRadio, {
    label: "Services (mobile)",
    value: t.servicesMobileLayout,
    options: [{
      value: "tabs",
      label: "Tabs"
    }, {
      value: "cards",
      label: "Cards"
    }],
    onChange: v => setTweak("servicesMobileLayout", v)
  }), React.createElement(TweakRadio, {
    label: "Credentials",
    value: t.credMotion,
    options: [{
      value: "marquee",
      label: "Marquee"
    }, {
      value: "fade",
      label: "Fade"
    }, {
      value: "flicker",
      label: "Flicker"
    }],
    onChange: v => setTweak("credMotion", v)
  }), React.createElement(TweakSection, {
    label: "Marginalia"
  }), React.createElement(TweakRadio, {
    label: "Drawing color",
    value: t.margFill,
    options: [{
      value: "yellow",
      label: "Yellow"
    }, {
      value: "oxblood",
      label: "Oxblood"
    }],
    onChange: v => setTweak("margFill", v)
  }), React.createElement(TweakButton, {
    label: "Reset drawing positions",
    secondary: true,
    onClick: () => resetAllMarginalia()
  }));
}
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const data = window.SITE_DATA;
  useEffect(() => {
    applyPalette(t.palette);
  }, [t.palette]);
  useEffect(() => {
    applyFont(t.displayFont);
  }, [t.displayFont]);
  useEffect(() => {
    applyMargFill(t.margFill);
  }, [t.margFill]);
  const whimsyClass = t.whimsy < 20 ? "whimsy-off" : "";
  document.body.style.setProperty("--whimsy", t.whimsy / 100);
  return React.createElement("div", {
    className: whimsyClass
  }, React.createElement(Nav, null), React.createElement(Hero, {
    data: data
  }), React.createElement(Credentials, {
    items: data.credentials,
    intro: data.credentialsIntro,
    mode: t.credMotion
  }), React.createElement(Catalogue, {
    entries: data.catalogue,
    layout: t.catalogueLayout
  }), React.createElement(Approach, {
    data: data.approach
  }), React.createElement(ServicesList, {
    data: data.services,
    mobileLayout: t.servicesMobileLayout
  }), React.createElement(Testimonials, {
    items: data.testimonials
  }), React.createElement(CTA, {
    data: data.cta
  }), React.createElement(Footer, null), React.createElement(Tweaks, {
    t: t,
    setTweak: setTweak
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));