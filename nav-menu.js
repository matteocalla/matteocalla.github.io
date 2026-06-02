// Mobile nav toggle — shared by the React home page and the static
// subpages. Uses event delegation on the document so it works no
// matter when/how the .nav-toggle button is rendered.
(function () {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".nav-toggle") : null;
    if (!btn) return;
    var nav = btn.closest(".nav");
    if (!nav) return;
    var open = nav.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();
