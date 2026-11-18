/* =========================================================
   FEI · HEL — interface behaviour
   No dependencies. Progressive enhancement only.
   - header / mobile nav
   - scroll reveal, section spy, smooth anchors
   - publication year filter
   - member cards from data/members.js
   - "내 소개글 작성" composer (live preview + JSON + mail/draft)
   ========================================================= */

(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ---------- Language ---------- */

  function LANG() {
    return window.FEI_HEL_i18n ? window.FEI_HEL_i18n.lang() : "ko";
  }

  function T(text) {
    return window.FEI_HEL_i18n ? window.FEI_HEL_i18n.t(text) : text;
  }

  function localized(member) {
    var lang = LANG();
    if (lang === "ko" || !member) return null;
    if (member.i18n && member.i18n[lang]) return member.i18n[lang];
    var table = window.LAB_MEMBERS_I18N || {};
    var entry = member.id ? table[member.id] : null;
    return entry && entry[lang] ? entry[lang] : null;
  }

  /* ---------- Toast ---------- */

  var toast = doc.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function copyText(text, okMessage, failMessage) {
    function fallback() {
      var area = doc.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-200px";
      area.style.left = "-200px";
      doc.body.appendChild(area);
      area.select();
      var copied = false;
      try {
        copied = doc.execCommand("copy");
      } catch (err) {
        copied = false;
      }
      doc.body.removeChild(area);
      showToast(copied ? okMessage : failMessage);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(okMessage);
      }, fallback);
    } else {
      fallback();
    }
  }

  /* ---------- Header state ---------- */

  var header = doc.getElementById("siteHeader");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */

  var toggle = doc.getElementById("navToggle");
  var nav = doc.getElementById("siteNav");

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", T("메뉴 열기"));
    nav.classList.remove("is-open");
    doc.body.style.overflow = "";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeNav();
      } else {
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", T("메뉴 닫기"));
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

  /* ---------- In-page anchors ---------- */

  doc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = doc.getElementById(id.slice(1));
      if (!target) return;
      event.preventDefault();
      var offset = header ? header.offsetHeight + 8 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      if (history.replaceState) {
        try {
          history.replaceState(null, "", id);
        } catch (err) {
          /* file:// or sandboxed context */
        }
      }
      closeNav();
    });
  });

  /* ---------- Scroll reveal ---------- */

  var revealItems = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );
    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Active section in navigation ---------- */

  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".nav > a")).filter(function (link) {
    return (link.getAttribute("href") || "").charAt(0) === "#";
  });
  var sections = navLinks
    .map(function (link) {
      return doc.getElementById(link.getAttribute("href").slice(1));
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
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Publication year filter ---------- */

  var pubFilterBtns = Array.prototype.slice.call(doc.querySelectorAll(".pub-list .pub-filter-btn"));
  var pubItems = Array.prototype.slice.call(doc.querySelectorAll("#pubItems > li"));

  if (pubFilterBtns.length && pubItems.length) {
    var applyPubYear = function (year) {
      pubItems.forEach(function (li) {
        var show = year === "all" || li.getAttribute("data-year") === year;
        if (show) li.removeAttribute("hidden");
        else li.setAttribute("hidden", "");
      });
      pubFilterBtns.forEach(function (btn) {
        var on = btn.getAttribute("data-year") === year;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    };

    pubFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyPubYear(btn.getAttribute("data-year"));
      });
    });
  }

  /* ---------- Research project year filter ---------- */

  var projFilterBtns = Array.prototype.slice.call(doc.querySelectorAll(".project-filter-btn"));
  var projItems = Array.prototype.slice.call(doc.querySelectorAll("#projectItems > li"));

  if (projFilterBtns.length && projItems.length) {
    var applyProjYear = function (year) {
      projItems.forEach(function (li) {
        var show = year === "all" || li.getAttribute("data-year") === year;
        if (show) li.removeAttribute("hidden");
        else li.setAttribute("hidden", "");
      });
      projFilterBtns.forEach(function (btn) {
        var on = btn.getAttribute("data-year") === year;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    };

    projFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyProjYear(btn.getAttribute("data-year"));
      });
    });
  }

  /* ---------- Media type filter ---------- */

  var mediaFilterBtns = Array.prototype.slice.call(doc.querySelectorAll("#mediaFilter .pub-filter-btn"));
  var mediaItems = Array.prototype.slice.call(doc.querySelectorAll("#mediaItems > li"));

  if (mediaFilterBtns.length && mediaItems.length) {
    var applyMediaType = function (type) {
      mediaItems.forEach(function (li) {
        var show = type === "all" || li.getAttribute("data-type") === type;
        if (show) li.removeAttribute("hidden");
        else li.setAttribute("hidden", "");
      });
      mediaFilterBtns.forEach(function (btn) {
        var on = btn.getAttribute("data-type") === type;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    };

    mediaFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyMediaType(btn.getAttribute("data-type"));
      });
    });
  }

  /* ---------- Copy email ---------- */

  var copyBtn = doc.getElementById("copyMail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var mail = copyBtn.getAttribute("data-mail") || "";
      if (!mail) return;
      copyText(mail, T("이메일 주소를 복사했습니다"), T("복사하지 못했습니다. 주소를 직접 선택해 주세요"));
    });
  }

  /* ---------- Footer year ---------- */

  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(Math.max(2026, new Date().getFullYear()));

  /* =========================================================
     Gallery + lightbox
     ========================================================= */

  var galleryGrid = doc.getElementById("galleryGrid");
  var galleryNote = doc.getElementById("galleryNote");
  var galleryPhotos = [];
  var lightbox = doc.getElementById("lightbox");
  var lbImage = doc.getElementById("lbImage");
  var lbCaption = doc.getElementById("lbCaption");
  var lbCount = doc.getElementById("lbCount");
  var lbTag = doc.getElementById("lbTag");
  var lbCloseBtn = doc.getElementById("lbClose");
  var lbPrevBtn = doc.getElementById("lbPrev");
  var lbNextBtn = doc.getElementById("lbNext");
  var lbPos = 0;
  var lbList = [];
  var lbReturnFocus = null;
  var galleryFilter = doc.getElementById("galleryFilter");

  function visibleIndexes() {
    if (!galleryGrid) return [];
    return Array.prototype.slice
      .call(galleryGrid.querySelectorAll(".gallery-item"))
      .filter(function (btn) {
        return !btn.hidden;
      })
      .map(function (btn) {
        return parseInt(btn.getAttribute("data-gallery"), 10);
      })
      .filter(function (n) {
        return !isNaN(n);
      });
  }

  function showPhoto(pos) {
    if (!lightbox || !lbList.length) return;
    lbPos = (pos + lbList.length) % lbList.length;
    var photo = galleryPhotos[lbList[lbPos]];
    if (!photo) return;
    if (lbImage) {
      lbImage.src = photo.src || photo.thumb;
      lbImage.alt = photo.alt || photo.caption || "";
    }
    if (lbCaption) lbCaption.textContent = photo.caption ? T(photo.caption) : "";
    if (lbCount) lbCount.textContent = lbPos + 1 + " / " + lbList.length;
    if (lbTag) lbTag.textContent = photo.tag ? T(photo.tag) : "";
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lbReturnFocus = doc.activeElement;
    lbList = visibleIndexes();
    if (!lbList.length) lbList = galleryPhotos.map(function (_, i) { return i; });
    var start = lbList.indexOf(index);
    showPhoto(start < 0 ? 0 : start);
    lightbox.hidden = false;
    doc.documentElement.style.overflow = "hidden";
    if (lbCloseBtn) lbCloseBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    doc.documentElement.style.overflow = "";
    if (lbImage) lbImage.removeAttribute("src");
    if (lbReturnFocus && typeof lbReturnFocus.focus === "function") lbReturnFocus.focus();
  }

  function buildGalleryFilter(photos) {
    if (!galleryFilter) return;
    var order = [];
    var counts = {};
    photos.forEach(function (photo) {
      var tag = photo.tag || "기타";
      if (counts[tag] === undefined) {
        counts[tag] = 0;
        order.push(tag);
      }
      counts[tag] += 1;
    });

    var html =
      '<button class="gallery-filter-btn is-active" type="button" data-tag="all" aria-pressed="true">' +
      esc(T("전체")) +
      "<span>" +
      photos.length +
      "</span></button>";
    order.forEach(function (tag) {
      html +=
        '<button class="gallery-filter-btn" type="button" data-tag="' +
        esc(tag) +
        '" aria-pressed="false">' +
        esc(T(tag)) +
        "<span>" +
        counts[tag] +
        "</span></button>";
    });
    galleryFilter.innerHTML = html;
    galleryFilter.hidden = false;
  }

  function renderGallery() {
    if (!galleryGrid || !galleryPhotos.length) return;
    galleryGrid.innerHTML = galleryPhotos
      .map(function (photo, index) {
        var caption = photo.caption ? T(photo.caption) : "";
        var alt = caption || T("사진");
        return (
          '<button class="gallery-item" type="button" data-gallery="' +
          index +
          '" aria-label="' +
          esc(caption ? caption + " · " + T("크게 보기") : T("사진 크게 보기")) +
          '">' +
          '<img src="' +
          esc(photo.thumb || photo.src) +
          '" alt="' +
          esc(alt) +
          '" width="720" height="720" loading="lazy" decoding="async" />' +
          (caption ? '<span class="gallery-cap">' + esc(caption) + "</span>" : "") +
          "</button>"
        );
      })
      .join("");
    if (galleryNote) {
      galleryNote.textContent = T("사진 " + galleryPhotos.length + "장");
      galleryNote.hidden = false;
    }
    buildGalleryFilter(galleryPhotos);
  }

  if (galleryGrid && window.fetch) {
    fetch("gallery.json", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("gallery.json " + response.status);
        return response.json();
      })
      .then(function (data) {
        var photos = Array.isArray(data) ? data : (data && data.photos) || [];
        if (!photos.length) return;
        galleryPhotos = photos;
        renderGallery();
      })
      .catch(function () {
        var section = doc.getElementById("gallery");
        if (section) section.hidden = true;
      });
  }

  if (galleryFilter) {
    galleryFilter.addEventListener("click", function (event) {
      var btn = event.target.closest(".gallery-filter-btn");
      if (!btn) return;
      applyGalleryTag(btn.getAttribute("data-tag") || "all");
    });
  }

  function applyGalleryTag(tag) {
    if (!galleryGrid) return;
    Array.prototype.slice.call(galleryGrid.querySelectorAll(".gallery-item")).forEach(function (btn) {
      var photo = galleryPhotos[parseInt(btn.getAttribute("data-gallery"), 10)];
      var match = tag === "all" || (photo && (photo.tag || "기타") === tag);
      if (match) btn.removeAttribute("hidden");
      else btn.setAttribute("hidden", "");
    });
    Array.prototype.slice.call(doc.querySelectorAll(".gallery-filter-btn")).forEach(function (btn) {
      var on = btn.getAttribute("data-tag") === tag;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  if (galleryGrid) {
    galleryGrid.addEventListener("click", function (event) {
      var item = event.target.closest("[data-gallery]");
      if (!item) return;
      openLightbox(parseInt(item.getAttribute("data-gallery"), 10) || 0);
    });
  }

  if (lightbox) {
    if (lbCloseBtn) lbCloseBtn.addEventListener("click", closeLightbox);
    if (lbPrevBtn) {
      lbPrevBtn.addEventListener("click", function () {
        showPhoto(lbPos - 1);
      });
    }
    if (lbNextBtn) {
      lbNextBtn.addEventListener("click", function () {
        showPhoto(lbPos + 1);
      });
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    doc.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        showPhoto(lbPos - 1);
      } else if (event.key === "ArrowRight") {
        showPhoto(lbPos + 1);
      } else if (event.key === "Tab") {
        var ring = [lbCloseBtn, lbPrevBtn, lbNextBtn].filter(Boolean);
        if (!ring.length) return;
        event.preventDefault();
        var at = ring.indexOf(doc.activeElement);
        var step = event.shiftKey ? -1 : 1;
        ring[(at + step + ring.length) % ring.length].focus();
      }
    });
  }

  /* =========================================================
     Member cards
     ========================================================= */

  var members = Array.isArray(window.LAB_MEMBERS) ? window.LAB_MEMBERS : [];
  var grid = doc.getElementById("memberGrid");

  var CHEVRON =
    '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">' +
    '<path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function paragraphs(text) {
    return String(text || "")
      .split(/\n{2,}/)
      .map(function (block) {
        return block.trim();
      })
      .filter(Boolean)
      .map(function (block) {
        return "<p>" + esc(block).replace(/\n/g, "<br />") + "</p>";
      })
      .join("");
  }

  function chipList(list, className) {
    if (!list || !list.length) return "";
    return (
      '<ul class="' + className + '">' +
      list
        .map(function (item) {
          return "<li>" + esc(item) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function linkList(links) {
    if (!links || !links.length) return "";
    var items = links
      .filter(function (link) {
        return link && /^(https?:\/\/|mailto:)/i.test(String(link.href || ""));
      })
      .map(function (link) {
        return (
          '<a href="' + esc(link.href) + '" target="_blank" rel="noopener">' +
          esc(link.label || link.href) +
          "</a>"
        );
      });
    if (!items.length) return "";
    return '<div class="member-links">' + items.join("") + "</div>";
  }

  function summaryOf(m) {
    var tr = localized(m) || {};
    var headline = tr.headline || m.headline;
    var bio = tr.bio || m.bioKo;
    if (headline && String(headline).trim()) return String(headline).trim();
    if (bio && String(bio).trim()) {
      var text = String(bio).trim().replace(/\s+/g, " ");
      if (text.length > 128) return text.slice(0, 126).replace(/[\s,.;:]*$/, "") + "…";
      return text;
    }
    return "";
  }

  function memberCard(m, options) {
    options = options || {};
    var tr = localized(m) || {};
    var lang = LANG();
    var bio = tr.bio || m.bioKo;
    var headline = tr.headline || m.headline;
    var interests = tr.interests || m.interests;
    var keywords = tr.keywords || m.keywords;
    var tag = tr.tag || T(m.tag);
    var hasBio = !!(bio && String(bio).trim());
    var bodyId = "mb-" + (m.id || "x");
    var summary = summaryOf(m);
    var initial = String(m.name || "?").trim().charAt(0);
    var displayName = lang !== "ko" && m.nameEn ? m.nameEn : m.name || "이름";
    var secondaryName = lang !== "ko" && m.nameEn ? m.name : m.nameEn;
    var programClass = m.program
      ? " member--" + String(m.program).toLowerCase().replace(/[^a-z0-9-]/g, "")
      : "";

    var html =
      '<article class="member' +
      programClass +
      (hasBio ? "" : " is-empty") +
      (m.pending ? " is-pending" : "") +
      '" data-member="' +
      esc(m.id) +
      '">';

    html += '<div class="member-top">';
    if (m.photo) {
      html +=
        '<span class="member-avatar"><img src="' +
        esc(m.photo) +
        '" alt="" width="40" height="40" loading="lazy" decoding="async" /></span>';
    } else if (m.avatar) {
      html +=
        '<span class="member-avatar member-avatar--flower"><img src="' +
        esc(m.avatar) +
        '" alt="" width="40" height="40" loading="lazy" decoding="async" /></span>';
    } else {
      html += '<span class="member-initial" aria-hidden="true">' + esc(initial) + "</span>";
    }
    html += '<div class="member-id"><h4>' + esc(displayName) + "</h4>";
    if (secondaryName) html += '<p class="member-en">' + esc(secondaryName) + "</p>";
    if (m.email) {
      html +=
        '<p class="member-mail"><a href="mailto:' +
        esc(m.email) +
        '">' +
        esc(m.email) +
        "</a></p>";
    }
    html += "</div>";
    if (tag) {
      html +=
        '<span class="member-tag' + (m.manager ? " is-manager" : "") + '">' + esc(tag) + "</span>";
    }
    html += "</div>";

    if (m.pending) {
      html += "</article>";
      return html;
    }

    html +=
      '<p class="member-line' +
      (summary ? "" : " is-empty") +
      '">' +
      esc(summary || T("소개글 작성 예정 · 연구 관심사 추가 가능")) +
      "</p>";

    if (!hasBio && !options.preview) {
      html +=
        '<ul class="member-slots" aria-hidden="true"><li>' +
        esc(T("연구 관심사")) +
        "</li><li>" +
        esc(T("키워드")) +
        "</li><li>" +
        esc(T("이메일 · 링크")) +
        "</li></ul>";
    }

    html += '<div class="member-body" id="' + bodyId + '">';
    if (hasBio) {
      html += paragraphs(bio);
      if (m.bioEn && lang === "ko") html += '<p class="member-en-bio" lang="en">' + esc(m.bioEn) + "</p>";
      if (interests && interests.length) {
        html += '<p class="member-label">' + esc(T("관심 연구")) + "</p>" + chipList(interests, "chips chips--sm");
      }
      if (keywords && keywords.length) {
        html += '<p class="member-label">' + esc(T("키워드")) + "</p>" + chipList(keywords, "chips chips--sm");
      }
      html += linkList(m.links);
    } else {
      html +=
        '<p class="member-empty-note">' +
        esc(
          T(
            "아직 소개글이 등록되지 않았습니다. 아래 「내 소개 쓰기」를 누르면 이 카드에 들어갈 소개글을 카드 미리보기와 함께 작성해 보낼 수 있습니다. 전공 배경, 지금 하는 연구, 다루는 데이터와 방법, 관심 키워드를 적어 주세요."
          )
        ) +
        "</p>";
    }
    html += "</div>";

    if (!options.preview) {
      html += '<footer class="member-foot">';
      html +=
        '<button class="member-toggle" type="button" aria-expanded="false" aria-controls="' +
        bodyId +
        '"><span>' +
        esc(T("소개 보기")) +
        "</span>" +
        CHEVRON +
        "</button>";
      html +=
        '<button class="member-write" type="button" data-bio-open="' +
        esc(m.id) +
        '">' +
        esc(T("내 소개 쓰기")) +
        "</button>";
      html += "</footer>";
    }

    html += "</article>";
    return html;
  }

  var students = members.filter(function (m) {
    return m && m.program !== "pi";
  });

  function renderMembers() {
    if (!grid || !students.length) return;
    var openIds = Array.prototype.slice.call(grid.querySelectorAll(".member.is-open")).map(function (card) {
      return card.getAttribute("data-member");
    });
    grid.innerHTML = students
      .map(function (m) {
        return memberCard(m);
      })
      .join("");
    openIds.forEach(function (id) {
      setCardOpen(grid.querySelector('.member[data-member="' + id + '"]'), true);
    });
  }

  renderMembers();

  function setCardOpen(card, open) {
    if (!card) return;
    card.classList.toggle("is-open", open);
    var btn = card.querySelector(".member-toggle");
    if (!btn) return;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    var label = btn.querySelector("span");
    if (label) label.textContent = open ? T("접기") : T("소개 보기");
  }

  if (grid) {
    grid.addEventListener("click", function (event) {
      var write = event.target.closest("[data-bio-open]");
      if (write) {
        openBioDialog(write.getAttribute("data-bio-open"));
        return;
      }
      if (event.target.closest("a")) return;

      var card = event.target.closest(".member");
      if (!card) return;

      if (event.target.closest(".member-toggle")) {
        setCardOpen(card, !card.classList.contains("is-open"));
        return;
      }
      if (event.target.closest(".member-top") || event.target.closest(".member-line")) {
        setCardOpen(card, !card.classList.contains("is-open"));
      }
    });
  }

  /* =========================================================
     Bio composer dialog
     ========================================================= */

  var dialog = doc.getElementById("bioDialog");
  var previewBox = doc.getElementById("bioPreview");
  var jsonBox = doc.getElementById("bioJson");

  var fields = {
    name: doc.getElementById("bioName"),
    nameEn: doc.getElementById("bioNameEn"),
    program: doc.getElementById("bioProgram"),
    email: doc.getElementById("bioEmail"),
    headline: doc.getElementById("bioHeadline"),
    bioKo: doc.getElementById("bioKo"),
    bioEn: doc.getElementById("bioEn"),
    interests: doc.getElementById("bioInterests"),
    keywords: doc.getElementById("bioKeywords"),
    links: doc.getElementById("bioLinks")
  };

  var PROGRAM_TAG = { phd: "박사과정", ms: "석사과정", researcher: "연구원" };
  var currentId = null;
  var lastFocus = null;

  function splitList(value) {
    return String(value || "")
      .split(/[,\n]/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function parseLinks(value) {
    return String(value || "")
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean)
      .map(function (line) {
        var parts = line.split("|");
        if (parts.length >= 2) {
          return { label: parts[0].trim(), href: parts.slice(1).join("|").trim() };
        }
        return { label: line, href: line };
      });
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function currentEntry() {
    var program = fields.program && fields.program.value ? fields.program.value : "ms";
    var name = fields.name ? fields.name.value.trim() : "";
    var nameEn = fields.nameEn ? fields.nameEn.value.trim() : "";
    return {
      id: currentId || slugify(nameEn || name) || "new-member",
      name: name,
      nameEn: nameEn,
      program: program,
      tag: T(PROGRAM_TAG[program] || "연구원"),
      headline: fields.headline ? fields.headline.value.trim() : "",
      bioKo: fields.bioKo ? fields.bioKo.value.trim() : "",
      bioEn: fields.bioEn ? fields.bioEn.value.trim() : "",
      interests: splitList(fields.interests ? fields.interests.value : ""),
      keywords: splitList(fields.keywords ? fields.keywords.value : ""),
      email: fields.email ? fields.email.value.trim() : "",
      links: parseLinks(fields.links ? fields.links.value : "")
    };
  }

  function jsonOf(entry) {
    return JSON.stringify(entry, null, 2);
  }

  function updateComposer() {
    if (!dialog) return;
    var entry = currentEntry();
    if (previewBox) {
      previewBox.innerHTML = memberCard(entry, { preview: true });
    }
    if (jsonBox) {
      jsonBox.textContent = jsonOf(entry);
    }
  }

  function resetComposer() {
    Object.keys(fields).forEach(function (key) {
      var el = fields[key];
      if (!el) return;
      if (el.tagName === "SELECT") el.selectedIndex = 0;
      else el.value = "";
    });
    currentId = null;
    updateComposer();
  }

  function fillComposer(m) {
    resetComposer();
    if (!m) return;
    currentId = m.id || null;
    if (fields.name) fields.name.value = m.name || "";
    if (fields.nameEn) fields.nameEn.value = m.nameEn || "";
    if (fields.program) {
      fields.program.value = m.program === "phd" || m.program === "ms" ? m.program : "researcher";
    }
    if (fields.email) fields.email.value = m.email || "";
    if (fields.headline) fields.headline.value = m.headline || "";
    if (fields.bioKo) fields.bioKo.value = m.bioKo || "";
    if (fields.bioEn) fields.bioEn.value = m.bioEn || "";
    if (fields.interests) fields.interests.value = (m.interests || []).join(", ");
    if (fields.keywords) fields.keywords.value = (m.keywords || []).join(", ");
    if (fields.links) {
      fields.links.value = (m.links || [])
        .map(function (link) {
          return (link.label || "") + "|" + (link.href || "");
        })
        .join("\n");
    }
    updateComposer();
  }

  function openBioDialog(memberId) {
    if (!dialog) return;
    lastFocus = doc.activeElement;
    var member = members.filter(function (m) {
      return m.id === memberId;
    })[0];
    if (member && member.program === "pi") {
      fillComposer(member);
    } else if (memberId && memberId !== "new") {
      fillComposer(member || null);
    } else {
      resetComposer();
    }
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    doc.documentElement.style.overflow = "hidden";
    if (fields.name) {
      window.setTimeout(function () {
        fields.name.focus();
      }, 60);
    }
  }

  function closeBioDialog() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  if (dialog) {
    doc.querySelectorAll("[data-bio-open]").forEach(function (button) {
      button.addEventListener("click", function () {
        openBioDialog(button.getAttribute("data-bio-open"));
      });
    });

    Object.keys(fields).forEach(function (key) {
      var el = fields[key];
      if (!el) return;
      el.addEventListener("input", updateComposer);
      el.addEventListener("change", updateComposer);
    });

    var closeBtn = doc.getElementById("bioClose");
    if (closeBtn) closeBtn.addEventListener("click", closeBioDialog);
    if (dialog.addEventListener) {
      dialog.addEventListener("close", function () {
        doc.documentElement.style.overflow = "";
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      });
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) closeBioDialog();
      });
      dialog.addEventListener("cancel", function () {
        doc.documentElement.style.overflow = "";
      });
    }

    var copyJsonBtn = doc.getElementById("bioCopyJson");
    if (copyJsonBtn) {
      copyJsonBtn.addEventListener("click", function () {
        copyText(
          jsonOf(currentEntry()),
          T("JSON을 복사했습니다. data/members.js 에 붙여 넣으세요"),
          T("복사하지 못했습니다. 아래 내용을 직접 선택해 주세요")
        );
      });
    }

    var mailBtn = doc.getElementById("bioMail");
    if (mailBtn) {
      mailBtn.addEventListener("click", function () {
        var entry = currentEntry();
        var who = entry.name || "FEI · HEL member";
        var subject = "[FEI · HEL] 소개글 제출 — " + who;
        var body =
          "FEI · HEL 홈페이지 구성원 소개글을 제출합니다.\n\n" +
          jsonOf(entry) +
          "\n\n위 내용을 data/members.js 의 제 항목에 반영해 주세요.\n";
        window.location.href =
          "mailto:bkim5020@gnu.ac.kr?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(body);
      });
    }

    var downloadBtn = doc.getElementById("bioDownload");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", function () {
        var entry = currentEntry();
        var text = jsonOf(entry) + "\n";
        try {
          var blob = new Blob([text], { type: "application/json" });
          var url = URL.createObjectURL(blob);
          var link = doc.createElement("a");
          link.href = url;
          link.download = "fei-hel-profile-" + (entry.id || "member") + ".json";
          doc.body.appendChild(link);
          link.click();
          doc.body.removeChild(link);
          window.setTimeout(function () {
            URL.revokeObjectURL(url);
          }, 1000);
          showToast(T("소개글 파일을 내려받았습니다"));
        } catch (err) {
          copyText(text, T("파일을 만들 수 없어 JSON을 복사했습니다"), T("복사하지 못했습니다"));
        }
      });
    }

    var resetBtn = doc.getElementById("bioReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        resetComposer();
        if (fields.name) fields.name.focus();
      });
    }

    updateComposer();
  }


  /* =========================================================
     Hero banner — pointer + scroll parallax
     The photograph itself breathes and drifts in CSS (style.css);
     each [data-depth] layer above it moves a little differently here.
     ========================================================= */

  var heroStage = doc.querySelector(".hero-stage");

  if (heroStage && !reduceMotion) {
    var artLayers = Array.prototype.slice.call(heroStage.querySelectorAll("[data-depth]"));
    var artX = 0;
    var artY = 0;
    var artTX = 0;
    var artTY = 0;
    var artInView = true;
    var artFrame = null;

    var artTick = function () {
      artFrame = null;
      artX += (artTX - artX) * 0.08;
      artY += (artTY - artY) * 0.08;
      var rect = heroStage.getBoundingClientRect();
      var scrollPush = 0;
      if (rect.height) {
        var centre = rect.top + rect.height / 2;
        scrollPush = (centre - window.innerHeight / 2) / window.innerHeight;
        scrollPush = Math.max(-1.4, Math.min(1.4, scrollPush)) * -1;
      }
      artLayers.forEach(function (layer) {
        var depth = parseFloat(layer.getAttribute("data-depth") || "1");
        var x = artX * depth * 6;
        var y = artY * depth * 2.6 + scrollPush * depth * 5;
        layer.style.transform = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px)";
      });
      if (Math.abs(artTX - artX) > 0.002 || Math.abs(artTY - artY) > 0.002) {
        artFrame = window.requestAnimationFrame(artTick);
      }
    };

    var artKick = function () {
      if (artFrame == null && artInView) artFrame = window.requestAnimationFrame(artTick);
    };

    window.addEventListener(
      "pointermove",
      function (event) {
        if (!artInView) return;
        var rect = heroStage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        artTX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
        artTY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
        artKick();
      },
      { passive: true }
    );

    window.addEventListener("scroll", artKick, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          artInView = entries[0].isIntersecting;
          if (artInView) artKick();
        },
        { rootMargin: "120px" }
      ).observe(heroStage);
    }
  }

  /* ---------- language change ---------- */

  doc.addEventListener("fei:i18nchange", function () {
    renderMembers();
    renderGallery();
    if (dialog && dialog.open) updateComposer();
  });
})();
