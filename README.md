# Pro-Mentis — Klinika Psychoterapii

One-page site for a psychotherapy clinic in Łódź. Plain HTML/CSS/JS, **no build
step and no dependencies** — open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000     # → http://localhost:8000
```

## Layout

```
index.html              the whole page — markup + one <script> block
assets/
  css/
    styles.css          design system: tokens, type, section layouts
    variants.css        alternative layouts + design axes (see below)
  img/
    logo-heart.svg      the heart/brain mark — nav, hero, Misja art, favicon
    logo-full.png       full lockup, raster only (footer; SVG still missing)
    heart.png           legacy raster mark, kept for reference
    wnetrze-recepcja.jpg  reception wall photo, used in Misja
    budynek-front.jpg   building from ul. Drewnowska, 1800×900 (Dojazd)
    tablica-wejscie.jpg sign by the entrance, 900×900 (Dojazd)
    team/               10 therapist portraits, square 900×900 JPEG
_source/                local only, git-ignored — never shipped
```

`_source/` holds the material this site was built from: the original Claude
Design export (`design-bundle/`) and the client's per-round source files
(`klient-2026-06-runda-2/`, `klient-2026-08-runda-3/` — untouched photos,
`GODZINY PRACY.xlsx`, the signage PDF the reception, building and sign photos
were lifted from). Processed, web-ready copies live in `assets/img/`; the
originals stay out of git.

Two portraits are **reframed**, not just cropped: Agnieszka Paula Jurczyk's
original is a tall 2985×4459 frame in which no square crop holds both the whole
head and the shoulders, so the head-and-shoulders region is centred in the square
and the plain stucco wall is extended sideways (13% per side — the edge strip
stretched, blurred and re-grained). Beata Jaranowska's is a plain square crop
lowered to `top=170`. If either original is ever replaced, redo the crop rather
than scaling the current file.

## Sections

Hero · Oferta · Cennik · Zespół · Misja · Dojazd · Kontakt · Zapisy — all direct
children of `<main>`, each with an `id` the nav links to.

**Oferta** — 13 tiles. They are kept 1:1 in sync with the `Usługa` dropdown in
the Zapisy form and with the Cennik; changing one means changing all three.

**Cennik** — 7 `.price-group` blocks (konsultacje, seksuologia, dietetyka,
mediacje, zajęcia grupowe, diagnoza, pozostałe). Each row carries a duration and
`.tag` chips for the channels you can book it through.

The chips are not decoration: every `Formularz` chip is an `<a class="tag
tag-link" href="#zapisy" data-usluga="…">` and the script at the bottom of
`index.html` jumps to the form, selects that `data-usluga` in `#f-topic`, writes
the exact row (title + price) into the hidden `Pozycja z cennika` field and
flashes the field. `data-usluga` **must** match an `<option>` in `#f-topic`
verbatim, otherwise the click still scrolls but selects nothing — several rows
deliberately share one option (both seksuologia consultations → `Konsultacja
seksuologiczna`, both dietetyka rows → `Dietetyk kliniczny`). Channels that are
not live yet are `.tag-soon`: dashed, muted, deliberately not clickable.

`Kalendarz online` sits **only on the three seksuologia rows** — the calendar we
would build on pro-mentis.pl cannot sync with ZnanyLekarz's, so per the client's
own rule it is limited to the services ZnanyLekarz does not cover. The four
psychotherapy rows carry `ZnanyLekarz` instead. Move the chips if that changes.

**Zespół** — 10 expandable cards. Photo, name, role, intro, pull quote and that
person's hours are always visible; second paragraph, credentials, experience and
the supervision note sit behind a `Pełny profil` `<details>` toggle (no JS).
Grid is 3-up ≥1081px, 2-up 781–1080px, 1-up ≤780px; a lone card on the last row
is centred. The same hours also appear as a combined table at the end of Kontakt,
inside an `overflow-x: auto` wrapper so it scrolls on phones instead of widening
the page.

### Adding a therapist

Three more profiles are coming, and the hours change over time, so a card is
plain copy-paste — no build step, no JS to touch. Photo first: square, 900×900,
head **and shoulders** in frame (see the note on reframing above), saved as
`assets/img/team/imie-nazwisko.jpg`. Then drop this into `.team-grid.profiles`
in the order the person should appear, and add the same person to the combined
`Godziny przyjęć specjalistów` table at the end of Kontakt.

```html
<article class="member member-detailed">
  <div class="portrait"><img src="assets/img/team/imie-nazwisko.jpg" alt="Imię Nazwisko — rola" loading="lazy"></div>
  <h3>Imię Nazwisko</h3>
  <span class="role">Rola · Druga rola</span>
  <p>Pierwszy akapit — zawsze widoczny.</p>
  <blockquote class="member-quote">Zdanie o podejściu do pracy.</blockquote>
  <div class="member-hours">
    <h4>Godziny przyjęć</h4>
    <ul>
      <li><span>Wtorek</span><b>13:30–18:30</b></li>
    </ul>
    <!-- albo, gdy brak grafiku:
    <p class="hours-individual">Terminy ustalane indywidualnie — prosimy o kontakt z rejestracją.</p> -->
  </div>
  <details class="member-more">
    <summary>Pełny profil</summary>
    <div class="member-more-body">
      <p>Drugi akapit — do kogo skierowana jest oferta.</p>
      <div class="member-creds">
        <h4>Wykształcenie i kwalifikacje</h4>
        <ul><li><b>Uczelnia</b> — kierunek, rok.</li></ul>
        <h4>Doświadczenie kliniczne</h4>
        <ul><li><b>Placówka</b> — stanowisko, lata.</li></ul>
        <h4>Obszary wsparcia i specjalizacji</h4>
        <ul><li>Obszar.</li></ul>
      </div>
      <p class="member-superv">Zdanie o superwizji.</p>
    </div>
  </details>
</article>
```

A new service needs three edits instead: an `.offer-card` tile in Oferta (bump
the `.num`), a `.price-row` in the right Cennik group (with a `Formularz` chip
whose `data-usluga` matches) and an `<option>` in `#f-topic`.

## Design axes (`variants.css`)

The design alternatives the client compared during handoff are still wired up as
`data-*` attributes — the switcher **panel** is gone, but the CSS remains, so any
direction can be restored by editing one attribute rather than rewriting layout.

Values marked † are the stylesheet's base state — they have no selector of their
own, so anything unrecognised falls back to them.

| Where | Attribute | Locked value | Other values |
|---|---|---|---|
| `<html>` | `data-atmo` | `cream` † | `paper`, `cool` |
| `<html>` | `data-accent` | `minimal` (grafit) | `expressive` (strong red), unset † (classic red) |
| `<html>` | `data-anim` | `scale` | `fade`, `slide`, `rise`, `blur`, `none` |
| `<html>` | `data-shape` | `sharp` | `soft`, `round` |
| `<html>` | `data-density` | `regular` † | `compact`, `spacious` |
| `<html>` | `data-font` | `cormorant` † | `lora`, `playfair` |
| `<html>` | `data-bodyfont` | `hanken` † | `mulish`, `worksans` |
| `#hero` | `data-hero` | `editorial` | `centered`, `split`, `banner` |
| `#oferta` | `data-layout` | `grid` † | `cards`, `mosaic`, `list` |
| `#zespol` | `data-layout` | `grid` † | `rows`, `circles`, `minimal` |
| `#misja` | `data-layout` | `split` | `band` †, `light`, `centered` |
| `#dojazd` | `data-layout` | `map-left` † | `map-right`, `map-top`, `cards` |
| `#kontakt` | `data-layout` | `widget-left` † | `widget-right`, `stacked`, `centered` |

Note the accent is **grafit**, not red — red survives only in the logo and the
Misja section. The `#zespol` alternatives (`rows`, `circles`, `minimal`) predate
the current expandable-card profiles and would need rework before use.

## Zapisy form

Submits **by e-mail with no backend** via [FormSubmit](https://formsubmit.co) to
`kontakt@pro-mentis.pl`. A hidden `_replyto` is filled from the e-mail field on
submit so replies go straight back to the patient. On the production host the
`action` can be swapped for a PHP `mail()` handler — see the comment above the
`<form>`.

## Still needed from the client

- **Activate the form.** FormSubmit sends a one-off confirmation e-mail to
  `kontakt@pro-mentis.pl` after the very first submission — somebody with access
  to that mailbox must click the link once before any zgłoszenie arrives.
- **ZnanyLekarz** — profile/widget embed code. Nothing is broken here: the
  `.widget-ph` box in Kontakt is a placeholder waiting for the snippet
  ZnanyLekarz gives you in their panel, and it can only work on the live
  pro-mentis.pl domain (their embed is tied to the profile's host). Paste it in
  place of `.widget-inner`, then drop the `.tag-soon` class from the ZnanyLekarz
  chips in Cennik. Same for the **online calendar** — separate decision, see the
  chip note under Cennik. Until both are live the `.price-legend-soon` paragraph
  says so; delete it once they work.
- **Dietetyk kliniczny** — the service is in Oferta and Cennik, but there is no
  bio or photo for the dietitian in Zespół.
- **Katarzyna Wójcikowska** and **Dominika Krawczyk** are missing from
  `GODZINY PRACY.xlsx`; their cards say "terminy ustalane indywidualnie".
- The `STACJONARNIE` / `ON-LINE` columns in the schedule are empty, so the site
  cannot yet say who works remotely — though the hero claims "Online i
  konsultacje stacjonarne".
- Confirm the ADHD test is **DIVA-5** (written `DIRA 5` in the e-mail). The
  Agnieszka/Paula question is settled — the client calls her **Agnieszka Paula
  Jurczyk**, and that is what the card, the alt text and the schedule now say.
- Clinic opening hours in Dojazd and the footer read `Pon.–Pt. 8:00–21:00 ·
  Sob. 9:00–15:00`, but no specialist is scheduled past 21:00 or after 12:00 on
  Saturday — confirm whether those are reception hours.
- A real Google Maps embed for Dojazd (the address links already open Google
  Maps; the in-page map is a generic embed).
- A **vector (SVG) full logo** for the footer — only the heart mark is vector.
- A `Polityka prywatności` page for the form's RODO consent link (`href="#"`).
- **Photos of the rooms** and the reception from a second angle. The building and
  the entrance sign in Dojazd were lifted from the signage PDF, so they are the
  *visualisation* renders — worth confirming the window films are actually up
  before those two go live. When room photos arrive, the `.locate-photos` block
  is the pattern to copy (and probably the moment to promote it to its own
  `Poradnia` section).
- **`Edukacyjne warsztaty seksuologiczne` — 100 zł per participant or per
  group?** The client wrote "cena 100,00 pln dla grupy minimum 4 osób". The row
  follows the same convention as TUS and Grupa wsparcia, i.e. it reads as the
  price one participant pays; if it is 100 zł for the whole group, the amount
  needs an explicit `<small>za grupę</small>`.
