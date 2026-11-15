/*
 * Az oldal teljes tartalma: részek, összefoglalók, kérdések.
 * Ugyanezt a QUESTIONS listát használja a tools/create-form.gs is a Google Form létrehozásához.
 *
 * Kérdéstípusok:
 *   scale    – 1–5 skála (low/high felirattal)
 *   grid     – intézkedések rácsa (sorok), egységes oszlopokkal (GRID_COLUMNS)
 *   radio    – egy választás
 *   checkbox – több választás (max: legfeljebb ennyi)
 *   text     – hosszabb szöveg
 *   short    – rövid szöveg
 *   email    – e-mail cím
 */

const SOURCES = {
  page: "https://www.kisoroszi.hu/hirek/kisoroszi-uj-telepulestervenek-elokeszitese",
  terv: "https://www.kisoroszi.hu/uploads/editors/Hirek/onkormanyzat/2026%20%C3%96NK/002-kisoroszi-telepulesterv-telepulesfejlesztesi-terv-egyeztetesi.pdf",
  vizsgalat: "https://www.kisoroszi.hu/uploads/editors/Hirek/onkormanyzat/2026%20%C3%96NK/001-kisoroszi-telepulesterv-megalapozo-vizsgalat-egyeztetesi.pdf",
};

const GRID_COLUMNS = ["Támogatom", "Semleges", "Nem támogatom", "Nem tudom megítélni"];

const AGREE = (id, what) => ({
  id, type: "scale",
  label: `Mennyire ért egyet ${what}?`,
  low: "Egyáltalán nem", high: "Teljesen",
});

const COMMENT = (id) => ({
  id, type: "text",
  label: "Mi hiányzik, mivel nem ért egyet, mit javasol?",
  hint: "Szó szerint, név nélkül kerül az összesítésbe.",
});

const SECTIONS = [
  /* ------------------------------------------------------------------ */
  {
    id: "R0",
    nav: "Önről",
    title: "Néhány adat Önről",
    intro: `<p>Ezek az adatok segítenek abban, hogy az összesítésben látszódjon, mit gondolnak például az állandó lakosok
      és az üdülőtulajdonosok, vagy a különböző korosztályok. <strong>Minden kérdés kihagyható.</strong></p>`,
    questions: [
      { id: "nev", type: "short", label: "Név (nem kötelező)" },
      { id: "nev_hozzajarulas", type: "radio",
        label: "Szerepelhet a neve a véleménye mellett az önkormányzatnak átadott összesítésben?",
        options: ["Igen, szerepelhet", "Nem, csak név nélkül"] },
      { id: "kapcsolat", type: "radio", label: "Milyen a kapcsolata Kisoroszival?",
        options: ["Állandó lakos", "Üdülő- vagy ingatlantulajdonos (nem állandó lakos)", "Itt dolgozom / vállalkozásom van itt", "Egyéb"] },
      { id: "evek", type: "radio", label: "Mióta kötődik Kisoroszihoz?",
        options: ["5 évnél rövidebb ideje", "5–20 éve", "Több mint 20 éve", "Itt születtem"] },
      { id: "kor", type: "radio", label: "Korcsoport",
        options: ["30 év alatt", "30–49", "50–64", "65 vagy több"] },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "R1",
    nav: "Helyzetkép, jövőkép",
    title: "Hol tart ma a falu, és merre menne?",
    short: [
      "Az állandó népesség 2011 és 2024 között 975-ről 1048 főre nőtt, de csak a beköltözők miatt: több a haláleset, mint a születés.",
      "Az öregedési index 123-ról 177-re emelkedett, ez a Dunakanyar egyik legmagasabb értéke.",
      "Autóval csak egyetlen út vezet a faluba (Tahitótfalu felől). Árvíznél a falu akár 6–8 napra is elzáródhat.",
      "A legnagyobb gondnak a szezonális tömegturizmust tartja a vizsgálat: a Szigetcsúcsra tartó forgalom az Ófalun halad át.",
      "<strong>A terv jövőképe:</strong> csendes, családbarát „sziget-falu”, amely <em>nem</em> akar térségi központ lenni. Gazdasága a szelíd turizmusra, a helyi kisvállalkozásokra és a hagyományos szilvatermesztésre épül.",
    ],
    details: `
      <h4>A terv négy fő célja (Bevezető)</h4>
      <ul>
        <li><strong>Integrált tervezés:</strong> a fejlesztési célok és az építési szabályok összehangolása.</li>
        <li><strong>Értékőrző szabályozás:</strong> az Ófalu karakterének védelme, a „tájba nem illő, túlzó beépítések” megakadályozása.</li>
        <li><strong>Kulturális központ:</strong> a Hősök tere, a templomok és egy helytörténeti értéktár összekötése („kulturális tengely”).</li>
        <li><strong>Természet és helyi gazdaság:</strong> a Duna-part, a Szigetcsúcs, a Natura 2000 területek és az ivóvízbázis védelme a szelíd turizmus és a helyi termelők támogatásával együtt.</li>
      </ul>
      <h4>A terv kilenc célterülete</h4>
      <p>Társadalom: <em>T1</em> családok és fiatalok, <em>T2</em> egészség, idősek, sport, <em>T3</em> helyi identitás és közösség.
         Gazdaság: <em>G1</em> turizmus, <em>G2</em> helyi gazdaság.
         Környezet: <em>K1</em> falukép, <em>K2</em> közlekedés, <em>K3</em> közművek és árvíz, <em>K4</em> természet és klíma.
         A következő részek ezeket mutatják be egyenként.</p>
      <h4>Mit mutat a helyzetfeltárás?</h4>
      <ul>
        <li>Erősen javult a képzettség (felsőfokú végzettség 22%, ez az országos átlag fölött van), és a vállalkozások száma 212-ről 280-ra nőtt, főként a tudás- és kreatív iparban.</li>
        <li>Az egy főre jutó jövedelem közel háromszorosára nőtt, de a térségben még mindig az alsó harmadban van.</li>
        <li>A 2026-os aszály új kockázatot hozott: rekordalacsony Duna, kiszáradó ártéri erdők, és a rév is akadozhat alacsony vízállásnál.</li>
      </ul>
      <figure>
        <img src="img/terkep-belterulet.jpg" alt="Probléma- és értéktérkép, belterület" loading="lazy">
        <figcaption>Probléma- és értéktérkép, belterület. A narancs cikcakk vonal az időszakos turisztikai terhelést jelöli.
          Forrás: Megalapozó vizsgálat, 131. oldal.</figcaption>
      </figure>
      <figure>
        <img src="img/terkep-kulterulet.jpg" alt="Probléma- és értéktérkép, külterület" loading="lazy">
        <figcaption>Probléma- és értéktérkép, külterület. Forrás: Megalapozó vizsgálat, 131. oldal.</figcaption>
      </figure>`,
    source: "Településfejlesztési terv 3–7. oldal; Megalapozó vizsgálat 120–132. oldal",
    questions: [
      AGREE("jovokep", "a terv jövőképével (csendes, családbarát sziget-falu, nem térségi központ)"),
      { id: "gondok", type: "checkbox", max: 3, label: "Ön szerint melyek ma Kisoroszi legnagyobb gondjai? (legfeljebb 3)",
        options: [
          "Turisztikai forgalom, parkolás",
          "Egyetlen közúti kapcsolat (elzártság)",
          "Túlépítés, a falukép változása",
          "Utak, járdák állapota, por",
          "Közművek (szennyvíz, csapadékvíz, ivóvíz)",
          "Árvízveszély",
          "Egészségügyi és idősellátás",
          "Fiatalok, családok helyzete (óvoda, iskola, lakhatás)",
          "Természeti értékek romlása",
          "Közösségi élet, tájékoztatás",
          "Egyéb",
        ] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "T1",
    nav: "Családok, fiatalok",
    title: "T1 – Családbarát és fiatalos közösség",
    short: [
      "Cél, hogy Kisoroszi ne „alvófalu” vagy üdülőfalu legyen, hanem a fiatal családok is itt maradjanak.",
      "Óvoda, mini bölcsőde és alsó tagozatos iskola korszerűsítése és bővítése.",
      "Biztonságosabb iskolába járás Tahitótfaluba (felső tagozat).",
      "Coworking iroda a távmunkában dolgozóknak, új játszóterek, közösségi parkok.",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li>Az óvoda és a mini bölcsőde energetikai korszerűsítése és bővítése (cselekvési program: <em>P9</em>).</li>
        <li>Az iskola szaktermének, tornaszobájának és udvarának megújítása, akadálymentes játszóudvar.</li>
        <li>Az iskolások szállításának és átjutásának javítása Tahitótfaluba.</li>
        <li>Környezet- és vízvédelmi nevelési programok („Kisoroszi: az édesvíz faluja”).</li>
        <li>Játszóterek, közösségi parkok, Tündérkert.</li>
        <li>Coworking iroda és távmunka-infrastruktúra.</li>
        <li>Önkormányzati támogatás a helyiek letelepedéséhez és otthonteremtéséhez.</li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>Az óvoda és mini bölcsőde 50 férőhelyes. Az alsó tagozatra 20–32 gyerek jár.</li>
        <li>Felső tagozat és középiskola nincs helyben: Szentendrére, Vácra vagy Budapestre kell ingázni.</li>
      </ul>`,
    source: "Településfejlesztési terv 8–10. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Óvoda és mini bölcsőde korszerűsítése, bővítése",
          "Iskola (szakterem, tornaszoba, udvar) megújítása",
          "Iskolabusz / biztonságos átjutás Tahitótfaluba",
          "Coworking iroda",
          "Új játszóterek, közösségi parkok, Tündérkert",
          "Letelepedési, otthonteremtési támogatás",
        ] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "T2",
    nav: "Egészség, idősek, sport",
    title: "T2 – Egészség, idősellátás, esélyegyenlőség, sport",
    short: [
      "Korszerűbb háziorvosi rendelő és helybe hozott szűrővizsgálatok.",
      "Kis, családias nyugdíjas otthon és idősek klubja a sportpálya környékén.",
      "Falubusz, bővülő házi segítségnyújtás.",
      "Akadálymentes középületek és közterületek.",
      "A sportpálya felújítása és egy fedett sportcsarnok.",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li>A háziorvosi rendelő műszaki és eszközfejlesztése (<em>P10</em>), szűrőbuszok, egészségfejlesztési programok.</li>
        <li><strong>Nyugdíjas otthon és nyugdíjas klub (<em>P5</em>):</strong> „családias léptékű, a falu vérkeringésébe (a sportpálya környezetébe) integrált bentlakásos idősek otthona és nappali közösségi klub”.</li>
        <li>Idősek klubja, szociális alapszolgáltatási központ, a házi gondozás bővítése, falubusz, az idősek digitális felzárkóztatása.</li>
        <li>Közintézmények és közterületek fizikai és infokommunikációs akadálymentesítése.</li>
        <li><strong>Sportpálya és fedett sportcsarnok (<em>P6</em>):</strong> „négyévszakos, fedett sportcsarnok”, futópálya, műfüves kis focipálya.</li>
        <li>A golfpálya és a lovardák adottságainak kihasználása, vízisport-oktatás, sportrendezvények.</li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>Egy háziorvos, egy fogorvosi rendelő és védőnői szolgálat van a faluban.</li>
        <li>A helyzetfeltárás szerint az ellátás legnagyobb kockázata, hogy árvíz idején a falu elzáródik.</li>
        <li>Az öregedési index a Dunakanyar egyik legmagasabb értéke (177).</li>
      </ul>`,
    source: "Településfejlesztési terv 10–13. oldal, cselekvési program 27–35. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Háziorvosi rendelő korszerűsítése",
          "Rendszeres szűrőbusz, szűrőprogramok",
          "Családias nyugdíjas otthon a sportpálya környékén",
          "Idősek klubja, házi gondozás bővítése",
          "Falubusz",
          "Középületek, közterületek akadálymentesítése",
          "Sportpálya felújítása + fedett sportcsarnok",
        ] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "T3",
    nav: "Kultúra, közösség",
    title: "T3 – Helyi identitás, kultúra, civil közösség",
    short: [
      "Tájház és helytörténeti értéktár a falu központjában.",
      "Az Újváry-műterem és -múzeum felújítása, bővítése.",
      "„Kulturális tengely”: a Hősök tere, a múzeum és a templomok összekötése.",
      "Párbeszéd a régi és az új lakók között, a civil szervezetek támogatása.",
      "Jobb lakossági tájékoztatás és bevonás a döntésekbe.",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li><strong>Kisoroszi Tájház és helytörténeti értéktár (<em>P11</em>):</strong> állandó bemutatótér a művészeti hagyományokról és a sváb/magyar paraszti múltról.</li>
        <li>Az Újváry Ignác Múzeum bővítése és felújítása.</li>
        <li>Kulturális tengely: Tájház, Hősök tere, templomok és közösségi terek összekötése rendezvényekkel.</li>
        <li>Művésztelepek, alkotótáborok, helyi kiállítások támogatása.</li>
        <li>Programok az új beköltözők és a tősgyökeres lakók párbeszédéért.</li>
        <li>Civil szervezetek működési és pályázati támogatása.</li>
        <li>A lakossági tájékoztatási csatornák és a lakossági bevonás fejlesztése.</li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>Két műemlék templom van a faluban (katolikus, 1719; református, 1803), és 102 épület áll helyi védelem alatt.</li>
        <li>Az 1898-ban épült Ujváry-műterem a sziget művésztelepi hagyományának ritka, eredeti állapotú emléke. A hasznosítása rendezetlen.</li>
        <li>Élénk civil élet van (pl. Kékszilva Táncegyüttes, FaGyi, KAKAÓ Egyesület), de a vizsgálat szerint „jellemzően néhány elkötelezett önkéntesen múlik”.</li>
      </ul>`,
    source: "Településfejlesztési terv 13–15. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Tájház és helytörténeti értéktár",
          "Újváry-műterem / múzeum felújítása",
          "Kulturális tengely (Hősök tere – múzeum – templomok)",
          "Civil szervezetek támogatása",
          "Régi és új lakók párbeszédét segítő programok",
          "Jobb lakossági tájékoztatás és bevonás",
        ] },
      { id: "tajekozodas", type: "checkbox", label: "Honnan értesül a falu ügyeiről?",
        options: ["Kisoroszi Hírmondó", "Önkormányzati honlap", "Facebook-csoportok", "Hirdetőtábla", "Ismerősöktől", "Lakossági fórum", "Egyéb"] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "G1",
    nav: "Turizmus",
    title: "G1 – Turizmus és rekreáció",
    short: [
      "A terv nem tömegturizmust akar, hanem „minőségi szelídturizmust”, amely a lakók nyugalmát is tiszteletben tartja.",
      "A Szigetcsúcs terhelésének szabályozása: látogatóirányító és parkolórendszer.",
      "A szigetcsúcsi kemping fejlesztése, úszó vendéglátóhely a Duna-parton.",
      "Tanösvények, látogatóközpont, túraútvonalak; fesztiválok (pl. „Édesvíz Fesztivál”).",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li>A Szigetcsúcs turisztikai terhelésének szabályozása, intelligens látogatóirányító és parkolórendszer.</li>
        <li><strong>A szigetcsúcsi kemping fejlesztése (<em>P4</em>):</strong> korszerű vizesblokkok és vendéglátó infrastruktúra.</li>
        <li><strong>Vízi vendéglátóhely és büfé (<em>P2</em>):</strong> tájba illő, úszó vendéglátóhely(ek) a Duna-parton.</li>
        <li>Látogatóközpont, tanösvények, táblarendszer a Natura 2000 területeken (<em>H8</em>).</li>
        <li>Közös ajánlatok a vízi, kerékpáros, lovas és golfturizmus összekapcsolásával.</li>
        <li>Program a magánszállások minősítésére és fejlesztésének támogatására, gasztronómiai programok.</li>
        <li>„A Víz Napja” és „Édesvíz Fesztivál” rendezvénysorozat.</li>
        <li>Sziget-kerülő gyalogos, kerékpáros és vízi túraútvonalak, digitális túraajánlók, QR-kódos tanösvények.</li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>A vizsgálat szerint a Szigetcsúcsra tartó tömeg jelenleg csak az Ófalun át jut el. „Alternatív, nem motoros közlekedési infrastruktúra és drasztikus korlátozás nélkül a jelenség nem kezelhető megfelelően.”</li>
        <li>„A turizmusból nem származik megfelelő mértékű profit, amelyet fejlesztésekre fordíthatna a település.”</li>
        <li>A szállás- és vendéglátóhelyek száma 2011 óta 13–16 között stagnál. A turisztikai kínálat jelentős része nem regisztrált keretek között működik.</li>
      </ul>`,
    source: "Településfejlesztési terv 15–16. oldal; Megalapozó vizsgálat 132. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "mennyiseg", type: "radio", label: "Milyen turizmust szeretne Kisorosziban?",
        options: ["Kevesebb turistát", "Ugyanennyit, de jobban szabályozva", "Több turistát, minőségi szolgáltatásokkal", "Nem tudom"] },
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Szigetcsúcs látogatóirányítás, terheléskorlátozás",
          "Szigetcsúcsi kemping fejlesztése",
          "Úszó vendéglátóhely a Duna-parton",
          "Látogatóközpont, tanösvények, táblák",
          "Fesztiválok (pl. Édesvíz Fesztivál)",
          "Golf- és lovasturizmus bekapcsolása",
          "Magánszállások minősítése, támogatása",
        ] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "G2",
    nav: "Helyi gazdaság",
    title: "G2 – Helyi gazdaság és értékteremtés",
    short: [
      "Helyi termelői és kézműves piac a Hősök terén.",
      "Saját védjegy: „Kisoroszi Szilva és Kézműves Brand”.",
      "A hagyományos szilvatermesztés és az aszálytűrő kertészet támogatása.",
      "Pályázati, jogi és üzleti tanácsadás a helyi kisvállalkozásoknak.",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li><strong>Helyi termelői piac (<em>P12</em>):</strong> esztétikus árusítóhely a falu központjában, a Hősök terén.</li>
        <li>Helyi termékvédjegy kidolgozása és marketingje.</li>
        <li>Mintaprogramok a szilvatermesztésre, a gyümölcsfeldolgozásra és az aszálytűrő kertészetre.</li>
        <li>Tanácsadás a mikrovállalkozásoknak, helyi beszállítói együttműködések.</li>
        <li>A helyi szolgáltatók és kézműves mesterségek megőrzésének támogatása.</li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>280 regisztrált vállalkozás működik a faluban, kb. 37%-uk tudásalapú vagy kreatívipari.</li>
        <li>A vízbázis-védelmi korlátozások szűkítik a mezőgazdaság mozgásterét (SWOT).</li>
      </ul>`,
    source: "Településfejlesztési terv 16–18. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Termelői és kézműves piac a Hősök terén",
          "„Kisoroszi Szilva és Kézműves” védjegy",
          "Szilva- és aszálytűrő kertészeti mintaprogram",
          "Tanácsadás helyi kisvállalkozásoknak",
        ] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "K1",
    nav: "Falukép, építés",
    title: "K1 – Épített környezet és falukép",
    short: [
      "Az Ófalu faluképének szigorú védelme, a „túlzó, tájidegen beépítések” megakadályozása.",
      "A helyi értékvédelmi rendelet felülvizsgálata, ösztönzők a hagyományos építkezéshez.",
      "A Hősök tere megújítása, a Rév utca sétálóutcává alakítása, Duna-parti sétány.",
      "A légvezetékek szakaszos földbe helyezése, a keleti településrész közterületeinek rendezése.",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li>Az Ófalu történeti faluképének, építészetének és utcaképének szigorú helyi védelme.</li>
        <li>A helyi értékvédelmi rendelet felülvizsgálata és szigorítása, ösztönzők a hagyományos építkezéshez.</li>
        <li>Tájba nem illő, túlzó beépítések megakadályozása a rendezési eszközökkel (építési szabályzat).</li>
        <li>A Hősök tere és a sétányok megújítása. Közkert és játszóterek, kiemelten a Hősök tere északi fele (<em>P7</em>).</li>
        <li><strong>A Rév utca sétálóutcává alakítása (<em>P14</em>)</strong>, gyalogos kapcsolat a Hősök tere és a Duna-parti sétány között (<em>H1</em>).</li>
        <li>A villany- és hírközlési légkábelek szakaszos földbe helyezése.</li>
        <li>A keleti településrész kiépítetlen, mélyen fekvő közterületeinek rendezése.</li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>Az Ófalura jellemző a fésűs, előkert nélküli, földszintes, nyeregtetős beépítés. Az újabb lakóterületeken nem alakult ki egységes karakter.</li>
        <li>Kisoroszi már 2007-ben helyi értékvédelmi rendeletet alkotott. A 2018-as településképi rendelet 102 ingatlant véd.</li>
        <li>A vizsgálat szerint „az agglomerációs beépítési nyomás veszélyeztetheti az Ófalu egységes, hagyományos karakterét”.</li>
      </ul>`,
    source: "Településfejlesztési terv 18–19. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Az Ófalu szigorúbb védelme",
          "Túlzó, tájidegen beépítések korlátozása",
          "Ösztönzők a hagyományos építkezéshez",
          "A Hősök tere megújítása",
          "A Rév utca sétálóutcává alakítása",
          "Légkábelek földbe helyezése",
          "A keleti településrész közterületeinek rendezése",
        ] },
      { id: "sajat_telek", type: "radio",
        label: "Elfogadna-e szigorúbb építési szabályokat a saját telkére is (pl. épületmagasság, tetőforma, beépíthetőség)?",
        options: ["Igen", "Részben", "Nem", "Nincs telkem / nem érint"] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "K2",
    nav: "Közlekedés",
    title: "K2 – Közlekedés, utak, elérhetőség",
    short: [
      "A cél nem több autó, hanem több irányból elérhető falu: rév, híd, hajó, kerékpár.",
      "Látogatói parkoló („falukapu”) a falu bejáratánál, hogy kevesebb autó menjen át az Ófalun.",
      "Utcák portalanítása, járdák, forgalomcsillapítás.",
      "A kismarosi rév újraindítása, gyalogos-kerékpáros Duna-híd, hajójárat Vác felé, EuroVelo 6 kerékpárút.",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li><strong>Falubejárati látogatói parkoló (<em>P13</em>):</strong> „falukapu” jellegű, okosmegoldásokkal támogatott parkoló mikromobilitási ponttal (pl. bérelhető kerékpár, roller), amely „tehermentesíti az Ófalu szűk utcáit a Szigetcsúcs felé irányuló autóforgalomtól”.</li>
        <li><strong>Utcák felújítása (<em>H4</em>):</strong> burkolatfelújítás, portalanítás, járdák, forgalomcsillapítás.</li>
        <li>A Tahitótfalu felőli bekötőút felújítása (<em>H5</em>).</li>
        <li>Csatlakozás az EuroVelo 6 nemzetközi kerékpárúthoz (<em>H2</em>).</li>
        <li>Gyalogos-kerékpáros Duna-híd Visegrád vagy Dunabogdány felé.</li>
        <li>A Kisoroszi–Kismaros közötti nagy-dunai rév újraindítása (<em>H3</em>).</li>
        <li>Menetrend szerinti hajójárat Vác felé (<em>H7</em>), kishajó- és csónakkikötők (<em>P1</em>).</li>
        <li>A busz-menetrendek térségi összehangolása.</li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>Autóval csak egy úton lehet a faluba jutni. Árvíznél ez akár 6–8 napra elzáródhat.</li>
        <li>2026-ban a rekordalacsony Duna más révátkelőknél fennakadást okozott, ez Kisoroszit is fenyegeti.</li>
        <li>A járdák kiépítettsége hiányos, kerékpáros infrastruktúra nincs.</li>
      </ul>`,
    source: "Településfejlesztési terv 19–21. oldal, cselekvési program 27–35. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Látogatói parkoló a falu bejáratánál",
          "Utcák portalanítása, járdák, forgalomcsillapítás",
          "A bekötőút felújítása",
          "EuroVelo 6 kerékpáros csatlakozás",
          "Gyalogos-kerékpáros Duna-híd",
          "A kismarosi rév újraindítása",
          "Hajójárat Vác felé",
          "Kishajó- és csónakkikötők",
          "Busz-menetrendek összehangolása",
        ] },
      { id: "autos_korlatozas", type: "radio",
        label: "Elfogadná-e, hogy a látogatók autóval csak a falu bejáratáig (a látogatói parkolóig) jöhessenek?",
        options: ["Igen, egész évben", "Csak szezonban / hétvégén", "Nem", "Nem tudom"] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "K3",
    nav: "Közművek, árvíz",
    title: "K3 – Közművek és árvízvédelem",
    short: [
      "A szennyvízcsatorna kiépítése a hiányzó utcákban, 100%-os rákötés.",
      "Az ivóvízbázis szigorú védelme, a régi vízvezetékek cseréje.",
      "Csapadékvíz-elvezetés, árkok, vízmegtartó megoldások (esőkertek, szürkevíz).",
      "Árvízvédelmi gát (védmű) a keleti lakó- és üdülőterületeken.",
      "A zártkertek fokozatos közművesítése.",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li>Az ivóvízbázis monitoringja és védelme, a hálózat rekonstrukciója.</li>
        <li>A szennyvízhálózat bővítése a hiányzó utcákban, a rákötési arány 100%-ra emelése (<em>H6</em>).</li>
        <li>A csapadékvíz-csatornák és nyílt árkok felújítása.</li>
        <li>„Kék-zöld” megoldások: vízmegtartó, szikkasztó és szürkevíz-hasznosító rendszerek.</li>
        <li><strong>Árvízvédelmi védmű</strong> a keleti lakó- és üdülőterületeken, tájba illeszkedő kivitelben.</li>
        <li>Az árvízi és vis maior terv felülvizsgálata, a védekezési eszközök fejlesztése.</li>
        <li><strong>A zártkerti területek szakaszos és szabályozott közművesítése.</strong></li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>A faluban nincs elsőrendű árvízvédelmi védvonal.</li>
        <li>Vannak ingatlanok vezetékes ivóvíz és szennyvízcsatorna nélkül. A nem megfelelően tárolt szennyvíz a talajvizet szennyezheti, és alatta országos jelentőségű ivóvízbázis van.</li>
        <li>A csapadékvizet főleg burkolatlan nyílt árkok vezetik el, egyes utcákban semmi sincs.</li>
        <li>A helyzetfeltárás veszélyként említi „a beépítési nyomás fokozódását a tájképvédelmi terület övezetében”. A zártkertek közművesítése a beépítést is megkönnyítheti.</li>
      </ul>`,
    source: "Településfejlesztési terv 21–22. oldal; Megalapozó vizsgálat 123, 127, 129. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Szennyvízcsatorna a hiányzó utcákban",
          "Ivóvízhálózat cseréje, vízbázis-védelem",
          "Csapadékvíz-elvezetés, árkok felújítása",
          "Esőkertek, vízmegtartás, szürkevíz-hasznosítás",
          "Árvízvédelmi gát a keleti részen",
          "Zártkertek közművesítése",
        ] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "K4",
    nav: "Természet, környezet",
    title: "K4 – Természetvédelem, zöldenergia, klíma",
    short: [
      "A Cseres-tó rehabilitációja: részben természetes strand, részben horgásztó.",
      "Az invazív fafajok (akác, bálványfa) irtása a Natura 2000 területeken.",
      "Utcafásítás, árnyékot adó fasorok.",
      "LED közvilágítás, napelemek ösztönzése.",
      "Hulladékudvar és kamerák az illegális szemételhelyezés ellen, a felhagyott bánya rendezése.",
    ],
    details: `
      <h4>Mit javasol a terv?</h4>
      <ul>
        <li><strong>A Cseres-tó komplex fejlesztése (<em>P3</em>):</strong> a volt bányató ökológiai rehabilitációja, „modern infrastruktúrával ellátott természetes strand, valamint kulturált horgász-kiállások”.</li>
        <li>A Natura 2000 területek védelme, az invazív fajok szisztematikus irtása.</li>
        <li>Utcafásítás, klímatűrő fasorok.</li>
        <li>A közvilágítás LED-esre cserélése, megújuló energia a lakossági és önkormányzati épületeken.</li>
        <li><strong>„Zöld” hulladékudvar (<em>P8</em>):</strong> kamerával védett szelektív gyűjtőpont, a kamerás hálózat bővítése.</li>
        <li>A felhagyott bánya rekultivációja.</li>
      </ul>
      <h4>Háttér</h4>
      <ul>
        <li>A falu területének jelentős része nemzeti park és Natura 2000 terület. Kb. 210 hektár erdő van, szinte mind védelmi rendeltetésű.</li>
        <li>A Cseres-tó ingatlanjogi helyzete rendezetlen, a növényzete és a biztonsága bizonytalan.</li>
        <li>A golfpálya vízigénye magas, a biológiai sokfélesége alacsony (SWOT).</li>
        <li>2026-ban az aszály miatt már augusztusban jelentős lombvesztés volt az ártéri erdőkben.</li>
      </ul>`,
    source: "Településfejlesztési terv 22–24. oldal; Megalapozó vizsgálat 121–122, 127. oldal",
    questions: [
      AGREE("cel", "ezzel a céllal"),
      { id: "intezkedesek", type: "grid", label: "Mennyire támogatja az alábbi intézkedéseket?",
        rows: [
          "Cseres-tó: természetes strand + horgásztó",
          "Invazív fafajok irtása",
          "Utcafásítás, árnyékoló fasorok",
          "LED közvilágítás",
          "Napelemek ösztönzése",
          "Hulladékudvar, kamerák",
          "A felhagyott bánya rendezése",
        ] },
      COMMENT("megj"),
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "R9",
    nav: "Összegzés",
    title: "Összegzés",
    intro: `<p>Végül néhány összegző kérdés. Ha valamelyik részt kihagyta, ott is nyugodtan visszaléphet.</p>`,
    questions: [
      { id: "top3", type: "checkbox", max: 3, label: "Melyik 3 terület a legfontosabb az Ön számára?",
        options: [
          "T1 – Családok, fiatalok, oktatás",
          "T2 – Egészség, idősek, sport",
          "T3 – Kultúra, közösség",
          "G1 – Turizmus szabályozása",
          "G2 – Helyi gazdaság",
          "K1 – Falukép, építési szabályok",
          "K2 – Közlekedés, utak",
          "K3 – Közművek, árvízvédelem",
          "K4 – Természet, környezet",
        ] },
      { id: "hianyzik", type: "text", label: "Mi az, ami teljesen hiányzik a tervből?" },
      { id: "uzenet", type: "text", label: "Egyéb üzenet az önkormányzatnak" },
      { id: "email", type: "email", label: "E-mail cím, ha szeretne értesítést az összesítésről (nem kötelező)",
        hint: "Az e-mail címet nem adjuk át senkinek, csak az értesítéshez használjuk." },
    ],
  },
];

/* Lapos kérdéslista (a Form létrehozásához és a beküldéshez). */
function buildQuestionList() {
  const list = [
    { key: "kitolto_azonosito", type: "short", label: "Kitöltő azonosító (automatikus)", section: "_meta" },
    { key: "resz", type: "short", label: "Rész (automatikus)", section: "_meta" },
  ];
  for (const s of SECTIONS) {
    for (const q of s.questions) {
      list.push(Object.assign({}, q, { key: `${s.id}_${q.id}`, section: s.id, sectionTitle: s.title }));
    }
  }
  return list;
}

if (typeof module !== "undefined") module.exports = { SECTIONS, GRID_COLUMNS, SOURCES, buildQuestionList };
