/**
 * Kisoroszi Településterv – összesítés
 *
 * A weboldal részenként küldi be a válaszokat, ezért egy kitöltőhöz több sor tartozik
 * (közös "Kitöltő azonosító"). Ez a szkript a válaszok táblázatában három új lapot készít:
 *
 *   "Összevont"            – kitöltőnként egy sor (részenként a legutolsó beküldés számít)
 *   "Összesítés"           – kérdésenként / intézkedésenként darabszám és %, összesen és
 *                            a "kapcsolat" (állandó lakos, üdülőtulajdonos, ...) szerint bontva
 *   "Szöveges vélemények"  – minden szöveges válasz szó szerint; név csak ha hozzájárult
 *
 * Futtatás: az osszesites függvény (ugyanabban a projektben, mint a create-form.gs).
 * Bármikor újrafuttatható, a lapokat újragenerálja.
 */

function osszesites() {
  const props = PropertiesService.getScriptProperties();
  const ss = SpreadsheetApp.openById(props.getProperty("SHEET_ID"));
  const src = ss.getSheets().filter(function (s) { return s.getFormUrl(); })[0] || ss.getSheets()[0];
  const data = src.getDataRange().getValues();
  if (data.length < 2) { Logger.log("Még nincs válasz."); return; }
  const header = data[0];
  const rows = data.slice(1);
  const col = function (title) { return header.indexOf(title); };

  const questions = buildQuestionList();
  const idCol = col("Kitöltő azonosító (automatikus)");
  const partCol = col("Rész (automatikus)");
  const tsCol = 0;

  // oszlop(ok) kérdésenként
  const qCols = {};
  questions.forEach(function (q) {
    const t = sectionTitleOf_(q);
    if (q.type === "grid") qCols[q.key] = q.rows.map(function (r) { return col(t + " [" + r + "]"); });
    else qCols[q.key] = col(t);
  });

  // --- összevonás: kitöltő → rész → legutolsó sor
  const people = {};
  rows.forEach(function (r) {
    const id = r[idCol]; const part = r[partCol];
    if (!id || !part) return;
    people[id] = people[id] || { id: id, parts: {} };
    const prev = people[id].parts[part];
    if (!prev || r[tsCol] >= prev[tsCol]) people[id].parts[part] = r;
  });
  const merged = Object.keys(people).map(function (id) {
    const p = people[id]; const out = { _id: id };
    questions.forEach(function (q) {
      if (q.section === "_meta") return;
      const r = p.parts[q.section]; if (!r) return;
      const c = qCols[q.key];
      out[q.key] = Array.isArray(c) ? c.map(function (i) { return i >= 0 ? r[i] : ""; }) : (c >= 0 ? r[c] : "");
    });
    return out;
  });

  const qs = questions.filter(function (q) { return q.section !== "_meta"; });

  // --- "Összevont" lap
  const mHeader = ["Kitöltő azonosító"];
  qs.forEach(function (q) {
    const t = sectionTitleOf_(q);
    if (q.type === "grid") q.rows.forEach(function (r) { mHeader.push(t + " [" + r + "]"); });
    else mHeader.push(t);
  });
  const mRows = merged.map(function (m) {
    const line = [m._id];
    qs.forEach(function (q) {
      const v = m[q.key];
      if (q.type === "grid") q.rows.forEach(function (_, i) { line.push(v ? v[i] : ""); });
      else line.push(v === undefined ? "" : v);
    });
    return line;
  });
  writeSheet_(ss, "Összevont", [mHeader].concat(mRows));

  // --- "Összesítés" lap
  const groupsQ = qs.filter(function (q) { return q.key === "R0_kapcsolat"; })[0];
  const groups = ["Mindenki"].concat(groupsQ ? groupsQ.options : []).concat(["Nem adta meg"]);
  const groupOf = function (m) { return m.R0_kapcsolat ? m.R0_kapcsolat : "Nem adta meg"; };
  const out = [["Kitöltők száma (egyedi)", merged.length], []];
  const countsHeader = ["Kérdés", "Válasz"].concat(groups.map(function (g) { return g + " (db)"; }))
    .concat(groups.map(function (g) { return g + " (%)"; }));

  function tally(label, options, getVals) {
    out.push([label]);
    out.push(countsHeader);
    const totals = groups.map(function (g) {
      return merged.filter(function (m) {
        const v = getVals(m); return v.length && (g === "Mindenki" || groupOf(m) === g);
      }).length;
    });
    options.forEach(function (opt) {
      const counts = groups.map(function (g) {
        return merged.filter(function (m) {
          return (g === "Mindenki" || groupOf(m) === g) && getVals(m).indexOf(String(opt)) >= 0;
        }).length;
      });
      const pct = counts.map(function (c, i) { return totals[i] ? Math.round(1000 * c / totals[i]) / 10 : ""; });
      out.push(["", String(opt)].concat(counts).concat(pct));
    });
    out.push(["", "Válaszolók"].concat(totals));
    out.push([]);
  }
  const splitVals = function (v) {
    if (v === undefined || v === null || v === "") return [];
    return String(v).split(", ").map(function (s) { return s.trim(); });
  };

  qs.forEach(function (q) {
    const t = sectionTitleOf_(q);
    if (q.type === "scale") tally(t, ["1", "2", "3", "4", "5"], function (m) { return splitVals(m[q.key]); });
    if (q.type === "radio") tally(t, q.options, function (m) { return m[q.key] ? [String(m[q.key])] : []; });
    if (q.type === "checkbox") {
      tally(t, q.options, function (m) {
        // A checkbox-válaszok vesszővel vannak összefűzve; a vesszőt tartalmazó opciókat egyben keressük.
        const v = m[q.key]; if (!v) return [];
        return q.options.filter(function (o) { return String(v).indexOf(o) >= 0; });
      });
    }
    if (q.type === "grid") {
      q.rows.forEach(function (r, i) {
        tally(t + " – " + r, GRID_COLUMNS, function (m) { return m[q.key] && m[q.key][i] ? [String(m[q.key][i])] : []; });
      });
    }
  });
  writeSheet_(ss, "Összesítés", out);

  // --- "Szöveges vélemények" lap
  const texts = [["Rész", "Kérdés", "Vélemény", "Név (ha hozzájárult)"]];
  merged.forEach(function (m) {
    const name = (m.R0_nev_hozzajarulas === "Igen, szerepelhet" && m.R0_nev) ? m.R0_nev : "";
    qs.forEach(function (q) {
      if (q.type !== "text") return;
      const v = m[q.key]; if (!v || !String(v).trim()) return;
      texts.push([q.sectionTitle, q.label, String(v).trim(), name]);
    });
  });
  writeSheet_(ss, "Szöveges vélemények", texts);

  Logger.log("Kész: " + ss.getUrl());
}

function writeSheet_(ss, name, rows) {
  let sh = ss.getSheetByName(name);
  if (sh) sh.clear(); else sh = ss.insertSheet(name);
  const width = rows.reduce(function (w, r) { return Math.max(w, r.length); }, 1);
  const padded = rows.map(function (r) { const x = r.slice(); while (x.length < width) x.push(""); return x; });
  sh.getRange(1, 1, padded.length, width).setValues(padded);
  sh.setFrozenRows(name === "Összesítés" ? 0 : 1);
  if (name === "Szöveges vélemények") { sh.setColumnWidth(3, 600); sh.getRange(1, 3, padded.length, 1).setWrap(true); }
}
