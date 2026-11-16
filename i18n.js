/* =========================================================
   FEI · HEL — language switching (KR · EN · JP · ZH)
   No dependencies.
   - dictionary lives in i18n-data.js (window.FEI_I18N_DATA)
   - translates text nodes, attributes and a few HTML blocks
   - every translation is computed from the original Korean text,
     so switching KR → EN → JP → ZH never loses the source
   - restores the exact Korean DOM when switching back to KR
   - ?lang=ko|en|ja|zh and localStorage (fei-hel-lang)
   ========================================================= */

(function () {
  "use strict";

  var DATA = window.FEI_I18N_DATA || { text: {}, html: {}, patterns: [] };
  var STORE_KEY = "fei-hel-lang";
  var LANGS = ["ko", "en", "ja", "zh"];
  var HTML_LANG = { ko: "ko", en: "en", ja: "ja", zh: "zh-Hans" };
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  var ATTRS = ["aria-label", "alt", "placeholder", "title"];

  var current = "ko";
  var dict = { en: {}, ja: {}, zh: {} };
  var patterns = [];

  /* ---------- dictionary ---------- */

  Object.keys(DATA.text || {}).forEach(function (key) {
    var entry = DATA.text[key] || {};
    LANGS.forEach(function (lang) {
      if (lang === "ko") return;
      if (entry[lang]) dict[lang][key] = entry[lang];
    });
  });

  (DATA.patterns || []).forEach(function (rule) {
    if (!rule || !rule.re) return;
    patterns.push({
      re: new RegExp(rule.re),
      en: rule.en || "",
      ja: rule.ja || "",
      zh: rule.zh || ""
    });
  });

  function normalize(value) {
    return String(value == null ? "" : value)
      .replace(/[\s\u00a0\u200b]+/g, " ")
      .trim();
  }

  function translate(value, lang) {
    if (lang === "ko") return null;
    var key = normalize(value);
    if (!key) return null;
    var table = dict[lang] || {};
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    for (var i = 0; i < patterns.length; i += 1) {
      var rule = patterns[i];
      var tpl = rule[lang];
      if (!tpl) continue;
      var m = key.match(rule.re);
      if (!m) continue;
      return tpl.replace(/\{(\d+)\}/g, function (all, n) {
        return m[Number(n)] == null ? "" : m[Number(n)];
      });
    }
    return null;
  }

  function t(value) {
    var out = translate(value, current);
    return out == null ? value : out;
  }

  /* ---------- originals ---------- */

  var textOrig = new WeakMap(); // text node -> original string
  var attrOrig = new WeakMap(); // element -> { attr: original }
  var textList = [];
  var attrList = [];
  var blockOrig = new WeakMap();

  function resetStores() {
    textOrig = new WeakMap();
    attrOrig = new WeakMap();
    textList = [];
    attrList = [];
  }

  /* ---------- what to leave alone ---------- */

  function skipped(el) {
    for (var node = el; node && node !== document.documentElement; node = node.parentElement) {
      if (node.hasAttribute && (node.hasAttribute("lang") || node.hasAttribute("data-i18n-skip"))) {
        return true;
      }
      if (node.tagName && SKIP_TAGS[node.tagName]) return true;
    }
    return false;
  }

  /* ---------- text nodes ---------- */

  function writeText(node, base, translated) {
    var lead = base.match(/^\s*/)[0];
    var trail = base.match(/\s*$/)[0];
    node.nodeValue = lead + translated + trail;
  }

  function applyText(node) {
    if (!node || node.nodeType !== 3) return;
    var parent = node.parentElement;
    if (!parent || skipped(parent)) return;

    var stored = textOrig.get(node);
    var base = stored == null ? node.nodeValue : stored;
    var trimmed = normalize(base);
    if (!trimmed) return;

    var translated = translate(trimmed, current);
    if (stored == null) {
      if (translated == null) return;
      textOrig.set(node, base);
      textList.push(node);
    }
    writeText(node, base, translated == null ? base.trim() : translated);
  }

  function walkText(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      applyText(root);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && skipped(root)) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while ((node = walker.nextNode())) {
      applyText(node);
    }
  }

  /* ---------- attributes ---------- */

  function applyAttrs(root) {
    if (!root || root.nodeType !== 1) return;
    var list = [root];
    var found = root.querySelectorAll(ATTRS.map(function (a) { return "[" + a + "]"; }).join(","));
    for (var i = 0; i < found.length; i += 1) list.push(found[i]);
    list.forEach(function (el) {
      if (!el || el.nodeType !== 1) return;
      if (skipped(el)) return;
      var store = attrOrig.get(el);
      ATTRS.forEach(function (attr) {
        if (!el.hasAttribute(attr)) return;
        var base = store && store[attr] != null ? store[attr] : null;
        if (base == null) {
          var now = el.getAttribute(attr);
          var out = translate(now, current);
          if (out == null) return;
          store = store || {};
          store[attr] = now;
          attrOrig.set(el, store);
          attrList.push(el);
          el.setAttribute(attr, out);
          return;
        }
        var translated = translate(base, current);
        el.setAttribute(attr, translated == null ? base : translated);
      });
    });
  }

  /* ---------- head ---------- */

  function applyHead() {
    var htmlEl = document.documentElement;
    var baseTitle = htmlEl.getAttribute("data-i18n-orig-title");
    if (baseTitle == null) {
      baseTitle = document.title;
      htmlEl.setAttribute("data-i18n-orig-title", baseTitle);
    }
    var out = translate(baseTitle, current);
    document.title = out == null ? baseTitle : out;

    var metas = document.querySelectorAll(
      'meta[name="description"], meta[property="og:title"], meta[property="og:description"]'
    );
    for (var i = 0; i < metas.length; i += 1) {
      var el = metas[i];
      var base = el.getAttribute("data-i18n-orig");
      if (base == null) {
        base = el.getAttribute("content");
        el.setAttribute("data-i18n-orig", base);
      }
      var content = translate(base, current);
      el.setAttribute("content", content == null ? base : content);
    }
  }

  /* ---------- HTML blocks ---------- */

  function applyBlocks() {
    var blocks = document.querySelectorAll("[data-i18n-html]");
    for (var i = 0; i < blocks.length; i += 1) {
      var el = blocks[i];
      var key = el.getAttribute("data-i18n-html");
      var entry = (DATA.html || {})[key];
      if (!entry) continue;
      var base = blockOrig.get(el);
      if (base == null) {
        base = el.innerHTML;
        blockOrig.set(el, base);
      }
      var html = entry[current];
      if (html && current !== "ko") el.innerHTML = html;
      else if (el.innerHTML !== base) el.innerHTML = base;
    }
  }

  function restoreBlocks() {
    var blocks = document.querySelectorAll("[data-i18n-html]");
    for (var i = 0; i < blocks.length; i += 1) {
      var el = blocks[i];
      var base = blockOrig.get(el);
      if (base != null && el.innerHTML !== base) el.innerHTML = base;
    }
  }

  /* ---------- applying ---------- */

  function apply(root) {
    applyBlocks();
    applyHead();
    var scope = root && root.nodeType ? root : document.body;
    walkText(scope);
    applyAttrs(scope.nodeType === 1 ? scope : document.body);
    updateButtons();
  }

  function restoreKorean() {
    for (var i = 0; i < textList.length; i += 1) {
      var node = textList[i];
      var original = textOrig.get(node);
      if (original != null) node.nodeValue = original;
    }
    for (var j = 0; j < attrList.length; j += 1) {
      var el = attrList[j];
      var store = attrOrig.get(el);
      if (!store) continue;
      Object.keys(store).forEach(function (attr) {
        el.setAttribute(attr, store[attr]);
      });
    }
    resetStores();
  }

  /* ---------- switcher ---------- */

  function updateButtons() {
    var buttons = document.querySelectorAll(".lang-switch [data-lang]");
    for (var i = 0; i < buttons.length; i += 1) {
      var btn = buttons[i];
      var on = btn.getAttribute("data-lang") === current;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  function syncUrl(lang) {
    if (!history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      if (lang === "ko") url.searchParams.delete("lang");
      else url.searchParams.set("lang", lang);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (err) {
      /* sandboxed context */
    }
  }

  function setLang(lang, options) {
    options = options || {};
    lang = String(lang || "").toLowerCase();
    if (LANGS.indexOf(lang) < 0) lang = "ko";
    var changed = lang !== current;

    if (lang === "ko") {
      restoreBlocks();
      restoreKorean();
      current = "ko";
      document.documentElement.setAttribute("lang", "ko");
      applyBlocks();
      applyHead();
      updateButtons();
    } else {
      current = lang;
      document.documentElement.setAttribute("lang", HTML_LANG[lang] || lang);
      apply();
    }

    try {
      localStorage.setItem(STORE_KEY, current);
    } catch (err) {
      /* private mode */
    }
    if (options.url !== false) syncUrl(current);
    if (changed) {
      document.dispatchEvent(new CustomEvent("fei:i18nchange", { detail: { lang: current } }));
    }
    return current;
  }

  function initialLang() {
    var fromQuery = null;
    try {
      fromQuery = new URL(window.location.href).searchParams.get("lang");
    } catch (err) {
      fromQuery = null;
    }
    if (fromQuery && LANGS.indexOf(fromQuery.toLowerCase().slice(0, 2)) >= 0) {
      return fromQuery.toLowerCase().slice(0, 2);
    }
    var stored = null;
    try {
      stored = localStorage.getItem(STORE_KEY);
    } catch (err) {
      stored = null;
    }
    if (stored && LANGS.indexOf(stored) >= 0) return stored;
    return "ko";
  }

  function bindSwitcher() {
    var group = document.querySelector(".lang-switch");
    if (!group) return;
    group.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-lang]");
      if (!btn) return;
      setLang(btn.getAttribute("data-lang"));
      btn.blur();
    });
  }

  /* ---------- watch content rendered later ---------- */

  function watch() {
    if (!window.MutationObserver || !document.body) return;
    var observer = new MutationObserver(function (mutations) {
      if (current === "ko") return;
      for (var i = 0; i < mutations.length; i += 1) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j += 1) {
          var node = added[j];
          if (node.nodeType === 3) applyText(node);
          else if (node.nodeType === 1) {
            walkText(node);
            applyAttrs(node);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- public API ---------- */

  window.FEI_HEL_i18n = {
    lang: function () { return current; },
    t: t,
    translate: function (value, lang) { return translate(value, lang); },
    apply: function () { apply(); },
    setLang: setLang,
    languages: LANGS.slice()
  };
  window.FEI_T = t;

  function boot() {
    bindSwitcher();
    current = initialLang();
    setLang(current, { url: false });
    watch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
