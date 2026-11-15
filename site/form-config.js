/*
 * Google Form beállítások.
 * A "formId" és az "entries" részt a tools/create-form.gs generálja – a kimenetét ide kell bemásolni.
 * Amíg a formId üres, az oldal TESZT MÓDBAN fut: semmit nem küld el, csak a böngésző konzoljára írja a válaszokat.
 */
const FORM_CONFIG = {
  formId: "",
  entries: {},

  // A beküldés lezárása (helyi idő). Ezután az oldal már nem fogad válaszokat.
  closeAt: "2026-11-16T14:00:00+01:00",

  // Adatkezelő (adatkezelési tájékoztatóhoz).
  controller: { name: "Borics Nándor", email: "nandor.borics@gmail.com" },

  // Az önkormányzat hivatalos beküldési címe (a saját nevében beküldőknek).
  officialEmail: "hivatal@kisoroszi.hu",
  officialDeadline: "2026. november 16., hétfő 17:00",
};
