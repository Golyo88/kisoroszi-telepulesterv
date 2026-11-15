/**
 * Kisoroszi Településterv – Google Form létrehozása
 *
 * Használat (részletesen: README.md):
 *  1. script.google.com → Új projekt.
 *  2. Hozzon létre egy "content.gs" fájlt, és másolja bele a site/content.js TELJES tartalmát.
 *  3. Hozzon létre egy "create-form.gs" és egy "osszesites.gs" fájlt ezekkel a tartalmakkal.
 *  4. Futtassa a createForm függvényt (első futáskor engedélyt kér).
 *  5. A Napló (Execution log) végén megjelenő FORM_CONFIG részt másolja be a site/form-config.js-be.
 */

function sectionTitleOf_(q) {
  return q.section === "_meta" ? q.label : "[" + q.section + "] " + q.label;
}

function createForm() {
  const questions = buildQuestionList();
  const form = FormApp.create("Kisoroszi Településterv – lakossági vélemények");
  form.setDescription(
    "Ezt az űrlapot a véleményező weboldal tölti ki automatikusan. Lakossági kezdeményezés, " +
    "a válaszok összesítve kerülnek Kisoroszi Község Önkormányzatához.");
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(false);

  const entries = {};
  questions.forEach(function (q) {
    const title = sectionTitleOf_(q);
    let item, resp;
    switch (q.type) {
      case "scale":
        item = form.addScaleItem().setTitle(title).setBounds(1, 5).setLabels(q.low, q.high);
        resp = item.createResponse(1);
        break;
      case "radio":
        item = form.addMultipleChoiceItem().setTitle(title).setChoiceValues(q.options);
        resp = item.createResponse(q.options[0]);
        break;
      case "checkbox":
        item = form.addCheckboxItem().setTitle(title).setChoiceValues(q.options);
        resp = item.createResponse([q.options[0]]);
        break;
      case "grid":
        item = form.addGridItem().setTitle(title).setRows(q.rows).setColumns(GRID_COLUMNS);
        resp = item.createResponse(q.rows.map(function () { return GRID_COLUMNS[0]; }));
        break;
      case "text":
        item = form.addParagraphTextItem().setTitle(title);
        resp = item.createResponse("x");
        break;
      default: // short, email
        item = form.addTextItem().setTitle(title);
        resp = item.createResponse("x");
    }
    item.setRequired(false);
    if (q.hint) item.setHelpText(q.hint);

    const url = form.createResponse().withItemResponse(resp).toPrefilledUrl();
    const ids = (url.match(/entry\.\d+/g) || []);
    if (!ids.length) throw new Error("Nem találtam entry azonosítót: " + q.key);
    entries[q.key] = q.type === "grid" ? ids : ids[0];
  });

  // Válaszok táblázatba
  const ss = SpreadsheetApp.create("Kisoroszi Településterv – válaszok");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // Újabb Google Forms: az űrlapot közzé kell tenni, különben nem fogad válaszokat.
  try { form.setPublished(true); } catch (e) { Logger.log("setPublished nem elérhető (ez rendben lehet): " + e); }
  form.setAcceptingResponses(true);

  PropertiesService.getScriptProperties().setProperties({ FORM_ID: form.getId(), SHEET_ID: ss.getId() });

  const published = form.getPublishedUrl(); // .../forms/d/e/<ID>/viewform
  const m = published.match(/\/forms\/d\/e\/([^/]+)\//);
  const formId = m ? m[1] : "";

  Logger.log("Űrlap szerkesztése: " + form.getEditUrl());
  Logger.log("Válaszok táblázata: " + ss.getUrl());
  Logger.log("---- Ezt másolja a site/form-config.js megfelelő soraiba: ----");
  Logger.log('  formId: "' + formId + '",');
  Logger.log("  entries: " + JSON.stringify(entries) + ",");
}

/** A beküldés lezárása (a weboldal is lezár a beállított időpontban). */
function closeForm() {
  const id = PropertiesService.getScriptProperties().getProperty("FORM_ID");
  FormApp.openById(id).setAcceptingResponses(false);
  Logger.log("Az űrlap már nem fogad válaszokat.");
}
