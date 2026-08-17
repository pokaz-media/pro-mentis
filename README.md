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
    team/               10 therapist portraits, square 900×900 JPEG
_source/                local only, git-ignored — never shipped
```

`_source/` holds the material this site was built from: the original Claude
Design export (`design-bundle/`) and the client's per-round source files
(`klient-2026-06-runda-2/`, `klient-2026-08-runda-3/` — untouched photos,
`GODZINY PRACY.xlsx`, the signage PDF the reception photo was lifted from).
Processed, web-ready copies live in `assets/img/`; the originals stay out of git.

## Sections

Hero · Oferta · Cennik · Zespół · Misja · Dojazd · Kontakt · Zapisy — all direct
children of `<main>`, each with an `id` the nav links to.

**Oferta** — 12 tiles. They are kept 1:1 in sync with the `Usługa` dropdown in
the Zapisy form and with the Cennik; changing one means changing all three.

**Cennik** — 7 `.price-group` blocks (konsultacje, seksuologia, dietetyka,
mediacje, zajęcia grupowe, diagnoza, pozostałe). Each row carries a duration and
`.tag` chips for the channels you can book it through.

**Zespół** — 10 expandable cards. Photo, name, role, intro, pull quote and that
person's hours are always visible; second paragraph, credentials, experience and
the supervision note sit behind a `Pełny profil` `<details>` toggle (no JS).
Grid is 3-up ≥1081px, 2-up 781–1080px, 1-up ≤780px; a lone card on the last row
is centred. The same hours also appear as a combined table at the end of Kontakt,
inside an `overflow-x: auto` wrapper so it scrolls on phones instead of widening
the page.

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
- **ZnanyLekarz** — profile/widget embed code (replaces the placeholder in
  Kontakt) and the **online calendar** for pro-mentis.pl. Until both are live the
  `.price-legend-soon` note in Cennik says so; delete that paragraph once they
  work.
- **Dietetyk kliniczny** — the service is in Oferta and Cennik, but there is no
  bio or photo for the dietitian in Zespół.
- **Katarzyna Wójcikowska** and **Dominika Krawczyk** are missing from
  `GODZINY PRACY.xlsx`; their cards say "terminy ustalane indywidualnie".
- The `STACJONARNIE` / `ON-LINE` columns in the schedule are empty, so the site
  cannot yet say who works remotely — though the hero claims "Online i
  konsultacje stacjonarne".
- Confirm **Agnieszka** vs **Paula** Jurczyk (bio and photo say Agnieszka, the
  schedule says Paula) and that the ADHD test is **DIVA-5** (written `DIRA 5` in
  the e-mail).
- Clinic opening hours in Dojazd and the footer read `Pon.–Pt. 8:00–21:00 ·
  Sob. 9:00–15:00`, but no specialist is scheduled past 21:00 or after 12:00 on
  Saturday — confirm whether those are reception hours.
- A real Google Maps embed for Dojazd (the address links already open Google
  Maps; the in-page map is a generic embed).
- A **vector (SVG) full logo** for the footer — only the heart mark is vector.
- A `Polityka prywatności` page for the form's RODO consent link (`href="#"`).
