# Kisoroszi Településterv – lakossági véleményező oldal

Statikus weboldal (`site/`), amely részenként összefoglalja a Településtervet, és a válaszokat egy Google Formba küldi.

## 1. Google Form létrehozása (kb. 5 perc)

1. Nyissa meg: https://script.google.com → **Új projekt**. Nevezze el pl. „Kisoroszi vélemények”.
2. A bal oldali **Fájlok** listában:
   - a meglévő `Kód.gs` (`Code.gs`) fájlt nevezze át `content.gs`-re, és másolja bele a `site/content.js` **teljes** tartalmát;
   - **+ → Szkript**: `create-form` néven, tartalma: `tools/create-form.gs`;
   - **+ → Szkript**: `osszesites` néven, tartalma: `tools/osszesites.gs`.
3. Mentés (Ctrl/Cmd+S). Felül a függvénylistában válassza a **createForm**-ot → **Futtatás**.
   Első alkalommal engedélyt kér („Ellenőrizetlen alkalmazás” → Speciális → Ugrás… → Engedélyezés). Ez a saját szkriptje, nyugodtan engedélyezheti.
4. A **Végrehajtási napló** végén ezt látja:
   ```
   formId: "1FAIpQL....",
   entries: {"kitolto_azonosito":"entry.123", ...},
   ```
   Ezt a két sort másolja be a `site/form-config.js` megfelelő két sora helyére.
5. A naplóban szereplő **Űrlap szerkesztése** linken ellenőrizze, hogy az űrlap **közzé van-e téve**
   (jobb felső sarok: „Közzététel” / „Published”), és a **Beállítások → Válaszok** alatt **ne** legyen bekapcsolva a
   „Bejelentkezés szükséges” vagy az „1 válaszra korlátozás”.

## 2. Kipróbálás

Nyissa meg a `site/index.html`-t a böngészőben, töltsön ki egy részt, és küldje el. Pár másodpercen belül meg kell
jelennie egy új sornak a „Kisoroszi Településterv – válaszok” táblázatban. A teszt sort utána törölheti a táblázatból.

Amíg a `formId` üres, az oldal **teszt módban** fut: sárga sáv jelzi, és semmit nem küld el.

## 3. Közzététel GitHub Pages-en

```
cd telepules_rendezes
git init && git add site README.md tools && git commit -m "Véleményező oldal"
gh repo create kisoroszi-telepulesterv --public --source=. --push
gh api -X POST repos/{owner}/kisoroszi-telepulesterv/pages -f "source[branch]=main" -f "source[path]=/"
```
Az oldal címe: `https://<felhasználónév>.github.io/kisoroszi-telepulesterv/site/`.

(A PDF-ek nem kerülnek fel, az oldal a kisoroszi.hu-ra hivatkozik.)

## 4. Lezárás és összesítés

- Az oldal a `form-config.js`-ben megadott `closeAt` időpontban (alapból **2026. nov. 16. 14:00**) automatikusan lezár.
  A Formot is lezárhatja: Apps Scriptben a **closeForm** függvény, vagy a Formon „Válaszok elfogadása” kikapcsolása.
- **Gyors áttekintés:** a Google Form „Válaszok” fülén kérdésenként grafikonok láthatók. Ezt a linket át is adhatja.
  (Figyelem: ha valaki egy részt módosítás után újra elküldött, ott kétszer számít.)
- **Pontos összesítés:** Apps Scriptben futtassa az **osszesites** függvényt. A válaszok táblázatában három lap készül:
  - **Összevont:** kitöltőnként egy sor;
  - **Összesítés:** kérdésenként darabszám és %, összesen és lakos / üdülőtulajdonos / … szerint bontva;
  - **Szöveges vélemények:** szó szerint, név csak ahol a kitöltő hozzájárult.

  Átadás előtt nézze át a szöveges véleményeket. A táblázat Fájl → Letöltés → PDF menüvel menthető.

## Fájlok

- `site/content.js`: minden szöveg és kérdés (a Form is ebből készül; ha kérdést módosít, a Formot újra kell generálni)
- `site/form-config.js`: Form azonosítók, lezárási idő, adatkezelő
- `site/app.js`, `site/style.css`, `site/index.html`: az oldal
- `tools/create-form.gs`, `tools/osszesites.gs`: Google Apps Script
