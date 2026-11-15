/*
 * Google Form beállítások.
 * A "formId" és az "entries" részt a tools/create-form.gs generálja – a kimenetét ide kell bemásolni.
 * Amíg a formId üres, az oldal TESZT MÓDBAN fut: semmit nem küld el, csak a böngésző konzoljára írja a válaszokat.
 */
const FORM_CONFIG = {
  formId: "1FAIpQLScIj7B5BYxZxtsINRgVXb18qXH2mmEn4w6oM_IPQwVOOSxVHg",
  entries: {"kitolto_azonosito":"entry.1399434758","resz":"entry.1085010882","R0_nev":"entry.1801267382","R0_nev_hozzajarulas":"entry.2107681625","R0_kapcsolat":"entry.750970547","R0_evek":"entry.466273105","R0_kor":"entry.569288448","R1_jovokep":"entry.642227247","R1_gondok":"entry.2032759563","R1_megj":"entry.572522808","T1_cel":"entry.491298660","T1_intezkedesek":["entry.711077247","entry.213705311","entry.1746560992","entry.880582808","entry.361484146","entry.683855722"],"T1_megj":"entry.873916459","T2_cel":"entry.83295043","T2_intezkedesek":["entry.1070964588","entry.1511306829","entry.1659894378","entry.23023588","entry.1346105788","entry.964033266","entry.1809979217"],"T2_megj":"entry.1873525679","T3_cel":"entry.923529247","T3_intezkedesek":["entry.1333136256","entry.882112163","entry.1005490020","entry.993478667","entry.811364868","entry.1515997451"],"T3_tajekozodas":"entry.855594762","T3_megj":"entry.1216909126","G1_cel":"entry.119107494","G1_mennyiseg":"entry.411300001","G1_intezkedesek":["entry.709730278","entry.1463951472","entry.251237146","entry.551796755","entry.1683438502","entry.1438528789","entry.2003731554"],"G1_megj":"entry.1586641827","G2_cel":"entry.1147042319","G2_intezkedesek":["entry.1963968581","entry.226354907","entry.758530764","entry.1216200842"],"G2_megj":"entry.372092829","K1_cel":"entry.815393331","K1_intezkedesek":["entry.1073108500","entry.1271185642","entry.1976853128","entry.1675318698","entry.1251917563","entry.1355276661","entry.816038108"],"K1_sajat_telek":"entry.1857249335","K1_megj":"entry.655438096","K2_cel":"entry.914822118","K2_intezkedesek":["entry.1688393699","entry.1784334188","entry.492244672","entry.1774342122","entry.741815749","entry.846103156","entry.1838753179","entry.290233121","entry.156454094"],"K2_autos_korlatozas":"entry.160515491","K2_megj":"entry.1376609901","K3_cel":"entry.1362006668","K3_intezkedesek":["entry.827988602","entry.357525773","entry.1991746933","entry.666654854","entry.837004525","entry.303475812"],"K3_megj":"entry.132516361","K4_cel":"entry.267012135","K4_intezkedesek":["entry.393628521","entry.47417504","entry.925165680","entry.474747170","entry.568299196","entry.2062744554","entry.37498194"],"K4_megj":"entry.1282299526","R9_top3":"entry.209088791","R9_hianyzik":"entry.208527482","R9_uzenet":"entry.1187820430","R9_email":"entry.1288014700"},

  // A beküldés lezárása (helyi idő). Ezután az oldal már nem fogad válaszokat.
  closeAt: "2026-11-16T16:30:00+01:00",

  // Adatkezelő (adatkezelési tájékoztatóhoz).
  controller: { name: "Borics Nándor", email: "nandor.borics@gmail.com" },

  // Az önkormányzat hivatalos beküldési címe (a saját nevében beküldőknek).
  officialEmail: "hivatal@kisoroszi.hu",
  officialDeadline: "2026. november 16., hétfő 17:00",
};
