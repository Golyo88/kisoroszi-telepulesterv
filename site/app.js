/* Kisoroszi Településterv – véleményező oldal */
(function () {
  "use strict";

  const STORE_KEY = "kisoroszi-velemeny-v1";
  const TEST_MODE = !FORM_CONFIG.formId;
  const CLOSE_AT = new Date(FORM_CONFIG.closeAt);

  /* ---------- állapot ---------- */
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (s && s.id) return Object.assign({ answers: {}, sent: {} }, s);
    } catch (e) { /* privát mód stb. */ }
    return { id: uuid(), answers: {}, sent: {} };
  }
  let state = loadState();
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* nincs tárolás */ }
  }

  const isClosed = () => new Date() >= CLOSE_AT;

  /* ---------- segédek ---------- */
  const el = (tag, attrs, ...children) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "html") n.innerHTML = v;
      else if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined) n.append(c);
    return n;
  };
  const keyOf = (s, q) => `${s.id}_${q.id}`;

  function sectionAnswers(s) {
    const out = {};
    for (const q of s.questions) {
      const v = state.answers[keyOf(s, q)];
      if (v === undefined || v === "" || (Array.isArray(v) && !v.length) ||
          (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length)) continue;
      out[keyOf(s, q)] = v;
    }
    return out;
  }
  const fingerprint = (obj) => JSON.stringify(obj);

  function sectionStatus(s) {
    const a = sectionAnswers(s);
    const sent = state.sent[s.id];
    if (!Object.keys(a).length) return sent ? "sent" : "empty";
    if (!sent) return "draft";
    return sent === fingerprint(a) ? "sent" : "changed";
  }

  /* ---------- kérdések megjelenítése ---------- */
  function renderQuestion(s, q) {
    const key = keyOf(s, q);
    const name = "q_" + key;
    const val = state.answers[key];
    const onChange = (v) => { state.answers[key] = v; saveState(); refreshStatus(); };
    const wrap = el("fieldset", { class: "q q-" + q.type });
    wrap.append(el("legend", {}, q.label));
    if (q.hint) wrap.append(el("p", { class: "hint" }, q.hint));

    if (q.type === "scale") {
      const row = el("div", { class: "scale" });
      row.append(el("span", { class: "scale-end" }, q.low));
      for (let i = 1; i <= 5; i++) {
        const id = `${name}_${i}`;
        row.append(el("label", { class: "scale-opt", for: id },
          el("input", { type: "radio", name, id, value: String(i), checked: val === String(i),
            onchange: () => onChange(String(i)) }),
          el("span", {}, String(i))));
      }
      row.append(el("span", { class: "scale-end" }, q.high));
      wrap.append(row);
    }

    if (q.type === "radio" || q.type === "checkbox") {
      const list = el("div", { class: "opts" });
      const isCb = q.type === "checkbox";
      const current = isCb ? (Array.isArray(val) ? val.slice() : []) : val;
      q.options.forEach((opt, i) => {
        const id = `${name}_${i}`;
        const input = el("input", {
          type: isCb ? "checkbox" : "radio", name, id, value: opt,
          checked: isCb ? current.includes(opt) : current === opt,
          onchange: (e) => {
            if (!isCb) return onChange(opt);
            let arr = Array.isArray(state.answers[key]) ? state.answers[key].slice() : [];
            if (e.target.checked) {
              if (q.max && arr.length >= q.max) {
                e.target.checked = false;
                flash(wrap, `Legfeljebb ${q.max} választható.`);
                return;
              }
              arr.push(opt);
            } else arr = arr.filter((x) => x !== opt);
            onChange(arr);
          },
        });
        list.append(el("label", { class: "opt", for: id }, input, el("span", {}, opt)));
      });
      if (!isCb) {
        list.append(el("button", { type: "button", class: "link-btn",
          onclick: () => { list.querySelectorAll("input").forEach((i) => (i.checked = false));
            delete state.answers[key]; saveState(); refreshStatus(); } }, "Válasz törlése"));
      }
      wrap.append(list);
    }

    if (q.type === "grid") {
      const cur = val && typeof val === "object" ? val : {};
      const table = el("div", { class: "grid", role: "table" });
      q.rows.forEach((rowLabel, r) => {
        const rname = `${name}_r${r}`;
        const row = el("div", { class: "grid-row", role: "row" });
        row.append(el("div", { class: "grid-label", role: "rowheader" }, rowLabel));
        const choices = el("div", { class: "grid-choices", role: "radiogroup", "aria-label": rowLabel });
        GRID_COLUMNS.forEach((col, c) => {
          const id = `${rname}_${c}`;
          choices.append(el("label", { class: "chip chip-" + c, for: id },
            el("input", { type: "radio", name: rname, id, value: col, checked: cur[r] === col,
              onchange: () => {
                const v = Object.assign({}, state.answers[key] || {});
                v[r] = col; onChange(v);
              } }),
            el("span", {}, col)));
        });
        row.append(choices);
        table.append(row);
      });
      wrap.append(table);
    }

    if (q.type === "text") {
      wrap.append(el("textarea", { name, rows: 4, maxlength: 4000,
        oninput: (e) => onChange(e.target.value) }, val || ""));
    }
    if (q.type === "short" || q.type === "email") {
      wrap.append(el("input", { type: q.type === "email" ? "email" : "text", name, value: val || "",
        autocomplete: q.type === "email" ? "email" : (q.id === "nev" ? "name" : "off"),
        maxlength: 200, oninput: (e) => onChange(e.target.value) }));
    }
    return wrap;
  }

  function flash(node, msg) {
    let m = node.querySelector(".flash");
    if (!m) { m = el("p", { class: "flash", role: "alert" }); node.append(m); }
    m.textContent = msg;
    clearTimeout(m._t);
    m._t = setTimeout(() => m.remove(), 3000);
  }

  /* ---------- részek ---------- */
  function renderSection(s, idx) {
    const sec = el("section", { class: "part", id: s.id, "aria-labelledby": s.id + "_h" });
    sec.append(el("div", { class: "part-head" },
      el("span", { class: "part-num" }, `${idx + 1} / ${SECTIONS.length}`),
      el("h2", { id: s.id + "_h" }, s.title)));

    if (s.intro) sec.append(el("div", { class: "intro", html: s.intro }));
    if (s.short) {
      sec.append(el("div", { class: "short" },
        el("h3", {}, "Röviden"),
        el("ul", {}, s.short.map((t) => el("li", { html: t })))));
    }
    if (s.details) {
      sec.append(el("details", { class: "details" },
        el("summary", {}, "Részletek: mit javasol a terv, és mi a háttér?"),
        el("div", { html: s.details })));
    }
    if (s.source) {
      sec.append(el("p", { class: "source" }, "Forrás: " + s.source + " · ",
        el("a", { href: SOURCES.page, target: "_blank", rel: "noopener" }, "a tervdokumentumok a kisoroszi.hu-n")));
    }

    const form = el("form", { class: "qs", novalidate: true, onsubmit: (e) => { e.preventDefault(); submitSection(s, idx); } });
    form.append(el("h3", {}, s.questions.length > 1 ? "Az Ön véleménye" : "Az Ön véleménye"));
    s.questions.forEach((q) => form.append(renderQuestion(s, q)));
    const status = el("p", { class: "status", id: s.id + "_status", "aria-live": "polite" });
    const btn = el("button", { type: "submit", class: "btn", id: s.id + "_btn" },
      idx < SECTIONS.length - 1 ? "Válaszaim elküldése és tovább" : "Válaszaim elküldése");
    const skip = idx < SECTIONS.length - 1
      ? el("a", { href: "#" + SECTIONS[idx + 1].id, class: "skip" }, "Kihagyom ezt a részt →") : null;
    form.append(el("div", { class: "actions" }, btn, skip), status);
    sec.append(form);
    return sec;
  }

  /* ---------- beküldés ---------- */
  function encode(answers, sectionId) {
    const p = new URLSearchParams();
    const E = FORM_CONFIG.entries;
    const add = (k, v) => {
      if (TEST_MODE) p.append(k, v);
      else if (E[k]) p.append(E[k], v);
      else console.warn("Nincs entry ehhez:", k);
    };
    add("kitolto_azonosito", state.id);
    add("resz", sectionId);
    for (const [k, v] of Object.entries(answers)) {
      if (Array.isArray(v)) v.forEach((x) => add(k, x));
      else if (typeof v === "object") {
        for (const [r, col] of Object.entries(v)) {
          const ids = E[k];
          if (TEST_MODE) p.append(`${k}[${r}]`, col);
          else if (Array.isArray(ids) && ids[r]) p.append(ids[r], col);
          else console.warn("Nincs entry ehhez a rácssorhoz:", k, r);
        }
      } else add(k, v);
    }
    return p;
  }

  async function submitSection(s, idx) {
    const btn = document.getElementById(s.id + "_btn");
    const status = document.getElementById(s.id + "_status");
    const next = SECTIONS[idx + 1];
    const goNext = () => { if (next) document.getElementById(next.id).scrollIntoView({ behavior: "smooth" }); };

    if (isClosed()) { status.textContent = "A véleménygyűjtés lezárult, új válasz már nem küldhető."; return; }
    const answers = sectionAnswers(s);
    if (!Object.keys(answers).length) { goNext(); return; }
    if (document.getElementById("hp_website").value) { goNext(); return; } // spam-csapda

    btn.disabled = true;
    status.className = "status";
    status.textContent = "Küldés…";
    try {
      const body = encode(answers, s.id);
      if (TEST_MODE) {
        console.log("[TESZT MÓD] beküldés:", s.id, Object.fromEntries(body.entries()), answers);
        await new Promise((r) => setTimeout(r, 300));
      } else {
        await fetch(`https://docs.google.com/forms/d/e/${FORM_CONFIG.formId}/formResponse`, {
          method: "POST", mode: "no-cors", credentials: "omit", body,
        });
      }
      state.sent[s.id] = fingerprint(answers);
      saveState();
      refreshStatus();
      status.className = "status ok";
      status.textContent = TEST_MODE ? "Teszt mód: a válasz nem lett elküldve (lásd konzol)." : "Köszönjük, a válaszait megkaptuk.";
      setTimeout(goNext, 600);
    } catch (err) {
      console.error(err);
      status.className = "status err";
      status.textContent = "Nem sikerült elküldeni (nincs internetkapcsolat?). A válaszai megmaradtak, próbálja újra.";
    } finally {
      btn.disabled = isClosed();
    }
  }

  /* ---------- állapotjelzés ---------- */
  const STATUS_TEXT = { empty: "", draft: "Kitöltve, még nincs elküldve", sent: "Elküldve ✓", changed: "Módosítva – küldje el újra" };
  function refreshStatus() {
    let sentCount = 0;
    for (const s of SECTIONS) {
      const st = sectionStatus(s);
      if (st === "sent" && state.sent[s.id]) sentCount++;
      const navItem = document.querySelector(`[data-nav="${s.id}"]`);
      if (navItem) navItem.dataset.status = st;
      const badge = document.getElementById(s.id + "_badge");
      if (badge) badge.textContent = STATUS_TEXT[st];
    }
    const bar = document.getElementById("progress-bar");
    const txt = document.getElementById("progress-text");
    if (bar) bar.style.width = (100 * sentCount / SECTIONS.length) + "%";
    if (txt) txt.textContent = `${sentCount} / ${SECTIONS.length} rész elküldve`;
    renderMailto();
  }

  /* ---------- saját nevében: e-mail az önkormányzatnak ---------- */
  function collectTexts() {
    const parts = [];
    for (const s of SECTIONS) {
      for (const q of s.questions) {
        const v = state.answers[keyOf(s, q)];
        if (q.type === "text" && v && v.trim()) parts.push(`${s.title}\n${q.label}\n${v.trim()}`);
      }
    }
    return parts;
  }
  function renderMailto() {
    const box = document.getElementById("mailto-box");
    if (!box) return;
    const texts = collectTexts();
    const name = (state.answers["R0_nev"] || "").trim();
    let body = "Tisztelt Önkormányzat!\n\nA Településterv (2026. októberi munkaközi változat) egyeztetési anyagához az alábbi észrevételeket teszem:\n\n"
      + (texts.length ? texts.join("\n\n") : "[Írja ide az észrevételeit]")
      + "\n\nTisztelettel:\n" + (name || "[név, lakcím]");
    const full = body;
    if (body.length > 1800) body = body.slice(0, 1800) + "\n\n[…a szöveg túl hosszú, a többit kérjük, másolja be…]";
    const href = `mailto:${FORM_CONFIG.officialEmail}?subject=${encodeURIComponent("Észrevételek a Településtervhez")}&body=${encodeURIComponent(body)}`;
    box.querySelector("a.btn").setAttribute("href", href);
    box.querySelector("textarea").value = full;
  }

  /* ---------- oldal felépítése ---------- */
  function build() {
    document.querySelectorAll("[data-controller-name]").forEach((n) => (n.textContent = FORM_CONFIG.controller.name));
    document.querySelectorAll("[data-controller-email]").forEach((n) => {
      n.textContent = FORM_CONFIG.controller.email; if (n.tagName === "A") n.href = "mailto:" + FORM_CONFIG.controller.email;
    });
    document.querySelectorAll("[data-official-email]").forEach((n) => {
      n.textContent = FORM_CONFIG.officialEmail; if (n.tagName === "A") n.href = "mailto:" + FORM_CONFIG.officialEmail;
    });
    document.querySelectorAll("[data-official-deadline]").forEach((n) => (n.textContent = FORM_CONFIG.officialDeadline));
    const closeTxt = CLOSE_AT.toLocaleString("hu-HU", { month: "long", day: "numeric", weekday: "long", hour: "2-digit", minute: "2-digit" });
    document.querySelectorAll("[data-close-at]").forEach((n) => (n.textContent = closeTxt));

    const nav = document.getElementById("toc-list");
    SECTIONS.forEach((s, i) => {
      nav.append(el("li", { "data-nav": s.id },
        el("a", { href: "#" + s.id }, el("span", { class: "toc-num" }, String(i + 1)), el("span", {}, s.nav)),
        el("span", { class: "toc-badge", id: s.id + "_badge" })));
    });

    const main = document.getElementById("parts");
    SECTIONS.forEach((s, i) => main.append(renderSection(s, i)));

    if (TEST_MODE) document.getElementById("test-banner").hidden = false;
    if (isClosed()) {
      document.getElementById("closed-banner").hidden = false;
      document.querySelectorAll(".qs button[type=submit]").forEach((b) => (b.disabled = true));
    }

    document.getElementById("clear-data").addEventListener("click", () => {
      if (!confirm("Biztosan törli az erről az eszközről mentett válaszait? (A már elküldött válaszokat ez nem érinti.)")) return;
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* */ }
      location.reload();
    });
    document.getElementById("copy-text").addEventListener("click", () => {
      const ta = document.querySelector("#mailto-box textarea");
      ta.select();
      (navigator.clipboard ? navigator.clipboard.writeText(ta.value) : Promise.reject()).catch(() => document.execCommand("copy"));
      flash(document.getElementById("mailto-box"), "A szöveg a vágólapra került.");
    });

    refreshStatus();
  }

  document.addEventListener("DOMContentLoaded", build);
})();
