/* FEI · HEL 인간환경연구실 — interface behaviour
   No dependencies. Progressive enhancement only. */

(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ---------- Header state ---------- */
  var header = doc.getElementById("siteHeader");
  var onScroll = function () {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var toggle = doc.getElementById("navToggle");
  var nav = doc.getElementById("siteNav");

  var closeNav = function () {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "메뉴 열기");
    nav.classList.remove("is-open");
    doc.body.style.overflow = "";
  };

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeNav();
      } else {
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "메뉴 닫기");
        nav.classList.add("is-open");
        doc.body.style.overflow = "hidden";
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 780) closeNav();
    });
  }

  /* ---------- In-page navigation offset ---------- */
  doc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = doc.getElementById(id.slice(1));
      if (!target) return;
      event.preventDefault();
      var offset = header ? header.offsetHeight + 10 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealItems = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Active section in navigation ---------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".site-nav a"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.length > 1 ? doc.getElementById(id.slice(1)) : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = doc.getElementById("copyMail");
  var toast = doc.getElementById("toast");
  var toastTimer = null;

  var showToast = function (message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  };

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var mail = copyBtn.getAttribute("data-mail") || "";
      if (!mail) return;

      var fallback = function () {
        var input = doc.createElement("textarea");
        input.value = mail;
        input.setAttribute("readonly", "");
        input.style.position = "absolute";
        input.style.left = "-9999px";
        doc.body.appendChild(input);
        input.select();
        try {
          doc.execCommand("copy");
          showToast("이메일 주소를 복사했습니다");
        } catch (err) {
          showToast("복사하지 못했습니다. 주소를 직접 선택해 주세요");
        }
        doc.body.removeChild(input);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(
          function () { showToast("이메일 주소를 복사했습니다"); },
          fallback
        );
      } else {
        fallback();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(Math.max(2026, new Date().getFullYear()));
})();
