// home.js — interactivity for the static home page.
// (The home page used to be a React app; it's now plain HTML so its text
// is directly editable. This script re-creates the few live behaviours.)
(function () {
  // ── Credentials — slow fade ticker (was the React CredFlash, mode "fade") ──
  var lines = Array.prototype.slice.call(
    document.querySelectorAll(".cred-stack .cred-line")
  );
  if (lines.length) {
    var i = lines.findIndex(function (l) {
      return l.classList.contains("is-on");
    });
    if (i < 0) i = 0;
    setInterval(function () {
      lines[i].classList.remove("is-on");
      i = (i + 1) % lines.length;
      lines[i].classList.add("is-on");
    }, 2400);
  }

  // ── Services — desktop matrix hover spotlight ──
  // Mirrors the old React hover logic: hovering a column head lights the
  // column, a row head lights the row, a data cell lights just that cell
  // (plus its row + column heads), and data-mode on the grid drives the
  // dimming of everything else.
  var grid = document.querySelector(".m-grid");
  if (grid) {
    var hr = null;
    var hc = null;
    var apply = function () {
      var mode =
        hr !== null && hc !== null
          ? "cell"
          : hr !== null
          ? "row"
          : hc !== null
          ? "col"
          : "";
      grid.setAttribute("data-mode", mode);
      grid.querySelectorAll(".m-col-head").forEach(function (el) {
        el.classList.toggle("is-hover", hc === Number(el.dataset.c));
      });
      grid.querySelectorAll(".m-row-head").forEach(function (el) {
        el.classList.toggle("is-hover", hr === Number(el.dataset.r));
      });
      grid.querySelectorAll(".m-data").forEach(function (el) {
        var r = Number(el.dataset.r);
        var c = Number(el.dataset.c);
        var active =
          (hr === r && hc === c) ||
          (hr === r && hc === null) ||
          (hr === null && hc === c);
        el.classList.toggle("is-hover", active);
      });
    };
    grid.querySelectorAll(".m-col-head").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        hr = null;
        hc = Number(el.dataset.c);
        apply();
      });
    });
    grid.querySelectorAll(".m-row-head").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        hr = Number(el.dataset.r);
        hc = null;
        apply();
      });
    });
    grid.querySelectorAll(".m-data").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        hr = Number(el.dataset.r);
        hc = Number(el.dataset.c);
        apply();
      });
    });
    grid.addEventListener("mouseleave", function () {
      hr = null;
      hc = null;
      apply();
    });
  }

  // ── Services — mobile tab switcher ──
  var tabWrap = document.querySelector(".svc-m--tabs");
  if (tabWrap) {
    var tabs = tabWrap.querySelectorAll(".svc-m-tab");
    var panels = tabWrap.querySelectorAll(".svc-m-panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var idx = tab.dataset.tab;
        tabs.forEach(function (t) {
          var on = t.dataset.tab === idx;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (p) {
          p.hidden = p.dataset.panel !== idx;
        });
      });
    });
  }
})();
