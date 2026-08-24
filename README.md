# Pro-Mentis — Klinika Psychoterapii

One-page site for a psychotherapy clinic in Łódź. Plain HTML/CSS/JS, **no build
step and no dependencies** — open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000     # → http://localhost:8000
```

## Layout

```
index.html              the whole page — markup + one <script> block
regulamin.html          terms of service (client's document, transcribed)
polityka-prywatnosci.html  RODO information clause (client's document)
dziekujemy.html         post-submit thank-you page (FormSubmit `_next` target)
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
    team/               10 therapist portraits, square (900×900, one 800×800)
_source/                local only, git-ignored — never shipped
```

`_source/` holds the material this site was built from: the original Claude
Design export (`design-bundle/`) and the client's per-round source files
(`klient-2026-06-runda-2/`, `klient-2026-08-runda-3/` — untouched photos,
`GODZINY PRACY.xlsx`, the signage PDF the reception, building and sign photos
were lifted from). Processed, web-ready copies live in `assets/img/`; the
originals stay out of git.

All ten portraits are **square** and framed head-and-shoulders at a comparable
head size, so the grid reads as one set — `object-position: center 20%` is
therefore a no-op for every one of them. Dariusz Drużyński and Dominika Krawczyk
used to be the two exceptions (a 1000×1188 standing shot and an 879×768 seated
one, both cropped by `object-fit` at render time and visibly wider than the rest);
they are now re-cropped from the round-2 originals — Dariusz from `1a.jpg`
(3314×3937, a 1950px square at 52% width, head top at 6.5%), Dominika from
`1000040782.jpg` (only 879×768, so a 460px square at 56% width upscaled to
800×800 — still >2× the 302px render box, but she is the one portrait with no
resolution to spare; a better original would be worth asking for).

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

## Navigation

Desktop shows the seven inline `.nav-links`. Below **980px** those would vanish
entirely, so `.menu-toggle` (a three-bar button that morphs into an ×) turns the
same `<nav>` into a full-width panel absolutely positioned under the fixed
header, plus a `.nav-phone` tap-to-call row that only exists in that panel —
`.header-cta .phone-link` is hidden below 620px, so without it a phone visitor
had no visible number in the header at all. State is one class, `.nav-open`, on
`.site-header`; the panel closes on link click, Escape, a click outside the
header and on resize back above 980px, and `aria-expanded` tracks it. The script
is duplicated in all four pages along with the header markup.

## Legal pages

`regulamin.html` and `polityka-prywatnosci.html` are the client's own documents,
transcribed rather than rewritten. Both are linked from `.footer-bottom` on every
page; the form's RODO checkbox points at the privacy clause and `.form-hint` at
the regulamin. Styling lives in the `.legal-*` block in `styles.css` (one text
measure shared by the TOC and the body, `§` headings separated by rules,
`scroll-margin-top` so anchors clear the sticky header).

Header and footer are **copied** into all three files — there is no build step
and no includes, so a change to either means editing three files. The two legal
pages were generated from one skeleton so their header and footer are byte-identical;
keep them that way. Their nav uses `index.html#…`, not bare `#…`.

Only typographical repairs were made to the source text: a doubled verb in §1
pkt 3 (`zostaje ulegnie` → `ulegnie`), stray markdown `**` markers dropped or
rendered as the bold they clearly meant, `art. 6 ust. 1 lit., a` → `lit. a`, the
run-on list of visit formats in §2 pkt 1 split into a nested list, and §2
renumbered 1–9 (the source restarted at `1.` mid-paragraph, so it had two items
numbered 1). Nothing else in the wording was touched — if the substance needs to
change, it changes in the client's document first.

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

The legend above the table is one `<li>` per channel, each **chip + a single
`<span>`** — with the text as loose inline nodes the flex container broke every
wrapped line back to the left margin. Keep the wrapper span.

`Kalendarz online` sits **only on the three seksuologia rows** — the calendar we
would build on pro-mentis.pl cannot sync with ZnanyLekarz's, so per the client's
own rule it is limited to the services ZnanyLekarz does not cover. The four
psychotherapy rows carry `ZnanyLekarz` instead. Move the chips if that changes.

As of 24 Aug 2026 ZnanyLekarz booking is **live**, so those four chips are real
`<a class="tag tag-link">` links to the facility profile (`target="_blank"`,
`rel="noopener nofollow"`) — no `data-usluga`, so the form-prefill script ignores
them. `Kalendarz online` is the only channel still `.tag-soon`, and
`.price-legend-soon` now talks about that calendar alone. Worth asking the client
whether the seksuologia rows should also get a `ZnanyLekarz` chip — the original
rule for splitting them assumed ZnanyLekarz booking did not work at all.

**Zespół** — 10 expandable cards. Photo, name, role, intro, pull quote and that
person's hours are always visible; second paragraph, credentials, experience and
the supervision note sit behind a `Pełny profil` `<details>` toggle (no JS).
Grid is 3-up ≥1081px, 2-up 781–1080px, 1-up ≤780px (`minmax(0, 1fr)`
everywhere — a bare `1fr` lets a long institution name set the track's
min-content and push the card out of the grid on narrow phones); a lone card on
the last row is centred.

Cards in a row are **equal height** (`align-items: stretch`) with `Pełny profil`
pinned to the card bottom (`margin-top: auto`), so the buttons line up. Opening
one card would otherwise stretch its neighbours and strand their buttons a
thousand pixels down, so a small script adds `.has-open` to the grid whenever any
`<details>` is open, which reverts the row to natural heights until it closes. The same hours also appear as a combined table at the end of Kontakt,
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
submit so replies go straight back to the patient, and `_next` sends the patient
to `dziekujemy.html` afterwards instead of FormSubmit's own English thank-you
page. `_next` is an **absolute URL** (`https://www.pro-mentis.pl/dziekujemy.html`)
because FormSubmit requires one — it only resolves once the domain points at this
site, so test the form after the DNS switch, not before.

`_captcha` is left at `true`: every submission goes through a reCAPTCHA page on
formsubmit.co before the redirect. That is friction on a clinic contact form, but
turning it off is a spam-protection decision for the client, not a layout fix —
the `_honey` honeypot stays either way. On the production host the
`action` can be swapped for a PHP `mail()` handler — see the comment above the
`<form>`.

## Still needed from the client

- **Activate the form — this is the one hard launch blocker.** Verified on
  23 Aug 2026 by posting a test submission: FormSubmit answered *"This form needs
  Activation. We've sent you an email containing an 'Activate Form' link."* Until
  somebody with access to `kontakt@pro-mentis.pl` clicks that link, **every
  zgłoszenie is silently dropped** — the patient still gets a thank-you page. The
  activation e-mail is already in that mailbox (subject from formsubmit.co); one
  click is all it needs. Re-test end-to-end afterwards.
  While in there: the free tier puts the recipient address in the page source
  (`action="…/kontakt@pro-mentis.pl"`), which spam crawlers harvest. After
  activation FormSubmit offers an aliased `…/el/xxxxx` endpoint — swap the
  `action` to it.
- **Hosting/DNS.** `pro-mentis.pl` and `www` currently resolve to Squarespace and
  serve a *Coming Soon* page; mail (MX) is Google Workspace, so `kontakt@` is
  live. Going live means repointing the A/CNAME records at wherever this static
  site is hosted, and leaving MX alone.
- **Put the clinic logo on the ZnanyLekarz profile.** The embedded widget renders
  a grey placeholder avatar because the facility has no logo uploaded — it is the
  one visibly unfinished element in Kontakt.
- Card payment went live in round 4, so the `(wkrótce)` marker is gone from the
  Płatność note — and with it the `.soon` rule, which nothing else used.
- **ZnanyLekarz booking is live** (client enabled it 24 Aug 2026 — the widget's
  button changed from *Pokaż opinie* to *Umów wizytę*). The widget in Kontakt is
  the client's snippet from their panel, verbatim, plus the
  `platform.docplanner.com` loader; the script replaces the fallback
  `a.zl-facility-url` with an iframe that sizes itself. `.widget-note` under it is
  gone — it only existed to explain that booking did not work yet. What is still
  outstanding there: **the facility has no logo uploaded**, so the widget renders
  a grey placeholder avatar — the one visibly unfinished element in Kontakt.
- The **online calendar** on pro-mentis.pl is still not built; it is the only
  channel left marked `.tag-soon`, and `.price-legend-soon` is the paragraph to
  delete when it works.
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
- Clinic opening hours now read `Pon.–Pt. 8:00–21:00 · Sob. 9:00–15:00` in all
  four places (Dojazd, the phone line in Kontakt, the footer on every page, and
  the thank-you page) — Kontakt and the footers had drifted to the weekday-only
  version. No specialist is scheduled past 21:00 or after 12:00 on Saturday, so
  confirm these are reception hours rather than appointment hours.
- **The regulamin describes a booking-and-prepayment flow the site does not
  have.** §2 requires remote and most stationary visits to be paid through the
  website within 30 minutes of booking, via an external operator (Paynow) — but
  there is no online calendar, no checkout and no payment integration on
  pro-mentis.pl, and ZnanyLekarz booking is switched off too. A patient cannot
  comply with a clause that still imposes consequences on them (automatic
  cancellation, full fee on a <48h cancellation). Either the flow gets built or
  the clause has to describe what actually happens.
- The BLIK number in §2 pkt 8 was `660424742`; per the client it is the clinic's
  contact number, so it now reads `+48 693 979 397` like everywhere else.
- **`Wersja dokumentu: 23 sierpnia 2026`** on both legal pages is the day they
  were published — the client's documents carry no date of their own.
- The form links the regulamin but does **not** require accepting it, while the
  regulamin says placing a reservation equals acceptance. If sending the form is
  meant to be that acceptance, it needs its own checkbox.
- `dziekujemy.html` cites **112** and the 24h Centrum Wsparcia line
  **800 70 2222**. Have the clinic confirm the number they want patients sent to.
- A real Google Maps embed for Dojazd (the address links already open Google
  Maps; the in-page map is a generic embed).
- A **vector (SVG) full logo** for the footer — only the heart mark is vector.
- **Photos of the rooms** and the reception from a second angle. The building and
  the entrance sign in Dojazd were lifted from the signage PDF, so they are the
  *visualisation* renders — worth confirming the window films are actually up
  before those two go live. When room photos arrive, the `.locate-photos` block
  is the pattern to copy (and probably the moment to promote it to its own
  `Poradnia` section).
- **The regulamin describes a booking-and-prepayment flow the site does not
  have.** §2 requires remote and most stationary visits to be paid through the
  website within 30 minutes of booking, via an external operator (Paynow) — but
  there is no online calendar, no checkout and no payment integration on
  pro-mentis.pl, and ZnanyLekarz booking is switched off too. As published, that
  clause describes something a patient cannot do. Either the flow gets built or
  the clause needs rewording.
- **BLIK number in §2 pkt 8 is `660424742`**, which is not the clinic's contact
  number (`693 979 397`) shown everywhere else on the site. Confirm it is right
  before patients start sending money to it.
- **`Wersja dokumentu: 23 sierpnia 2026`** on both legal pages is the day they
  were published — the client's documents carry no date of their own. Replace it
  with the real effective date if there is one.
- The form is a contact request, not a booking, so it only *links* the regulamin
  instead of asking the visitor to accept it. If sending the form is meant to be
  an acceptance, that needs its own checkbox.
- **`Edukacyjne warsztaty seksuologiczne` — 100 zł per participant or per
  group?** The client wrote "cena 100,00 pln dla grupy minimum 4 osób". The row
  follows the same convention as TUS and Grupa wsparcia, i.e. it reads as the
  price one participant pays; if it is 100 zł for the whole group, the amount
  needs an explicit `<small>za grupę</small>`.
