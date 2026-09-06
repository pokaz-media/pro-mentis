# Pro-Mentis — Klinika Psychoterapii

One-page site for a psychotherapy clinic in Łódź. Plain HTML/CSS/JS, **no build
step and no dependencies** — open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000     # → http://localhost:8000
```

## Layout

```
index.html              the whole page — markup + one <script> block
kariera.html            job offers; reachable **only** from the nav, by the client's decision
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
    logo-znanylekarz.png  ZnanyLekarz mark, 64×64, for the booking dialog
    partner-mind4med.png  Mind4Med logo, white margin trimmed (Zespół)
    tlo-splot.png       brain-pattern watermark, used as a CSS mask in the hero
    heart.png           legacy raster mark, kept for reference
    wnetrze-recepcja.jpg  reception — real photo, replaced the render in round 5
    budynek-front.jpg   building from ul. Drewnowska — real photo, replaced the render
    tablica-wejscie.jpg sign by the entrance, 900×900 (Poradnia)
    poradnia/           4 gabinety, poczekalnia, the gate from the street
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

Hero · Oferta · Cennik · Zespół · Misja · Poradnia · Kontakt · Zapisy — all direct
children of `<main>`, each with an `id` the nav links to.

**Poradnia keeps `id="dojazd"`** even though it is labelled Poradnia everywhere a
visitor can see. The three other pages link to `index.html#dojazd`, so renaming the
id would break them; the section was *promoted* rather than replaced when the room
photos arrived in round 5. It now opens with the interior gallery, then the map and
address card under a `Jak do nas trafić` subheading, then the orientation photos
(gate → building → sign, in the order a patient meets them). Adding a nav entry for it was rejected: the bar was already going to eight
items because of Kariera, so `Jak dojechać` was relabelled instead — the new label
is shorter than the old one, so the bar did not grow.

## Navigation

Desktop shows the eight inline `.nav-links`. Below **980px** those would vanish
entirely, so `.menu-toggle` (a three-bar button that morphs into an ×) turns the
same `<nav>` into a full-width panel absolutely positioned under the fixed
header, plus a `.nav-phone` tap-to-call row that only exists in that panel —
`.header-cta .phone-link` is hidden below 620px, so without it a phone visitor
had no visible number in the header at all. State is one class, `.nav-open`, on
`.site-header`; the panel closes on link click, Escape, a click outside the
header and on resize back above 980px, and `aria-expanded` tracks it. The script
is duplicated in all **five** pages along with the header markup.

`Kariera` sits in `.nav-links` **only** — deliberately not in the footer's
`Nawigacja` column, which mirrors the nav on every other item. That is the client's
call, not an oversight; it is the one label that differs between the two lists.

## Legal pages

`regulamin.html` and `polityka-prywatnosci.html` are the client's own documents,
transcribed rather than rewritten. Both are linked from `.footer-bottom` on every
page; the form's RODO checkbox points at the privacy clause and `.form-hint` at
the regulamin. Styling lives in the `.legal-*` block in `styles.css` (one text
measure shared by the TOC and the body, `§` headings separated by rules,
`scroll-margin-top` so anchors clear the sticky header).

Header and footer are **copied** into all five files — there is no build step
and no includes, so a change to either means editing five files. The two legal
pages were generated from one skeleton so their header and footer are byte-identical;
keep them that way. Their nav uses `index.html#…`, not bare `#…`.

Only typographical repairs were made to the source text: a doubled verb in §1
pkt 3 (`zostaje ulegnie` → `ulegnie`), stray markdown `**` markers dropped or
rendered as the bold they clearly meant, `art. 6 ust. 1 lit., a` → `lit. a`, the
run-on list of visit formats in §2 pkt 1 split into a nested list, and §2
renumbered 1–9 (the source restarted at `1.` mid-paragraph, so it had two items
numbered 1). Nothing else in the wording was touched — if the substance needs to
change, it changes in the client's document first.

**Oferta** — 13 tiles, each just a number, a title and a sentence. They are kept
1:1 in sync with the `Usługa` dropdown in the Zapisy form and with the Cennik;
changing one means changing all three. The tiles are **not** links — the
`Dowiedz się więcej →` label that used to appear on hover was removed at the
client's request (it promised a page that does not exist); `.offer-card:hover`
still tints the background. The `.more` rules in `variants.css` (for the `list`
and `mosaic` Oferta layouts) are now dead but left in place, since that file is
the alternative-layout library rather than shipped CSS.

**Cennik** — 7 `.price-group` blocks (konsultacje, seksuologia, dietetyka,
mediacje, zajęcia grupowe, diagnoza, pozostałe). Each row carries a duration and
`.tag` chips for the channels you can book it through.

Two channels only — `Formularz` and `ZnanyLekarz`. A third, `Kalendarz online`
(a booking calendar on pro-mentis.pl), was dropped in September 2026: the client
abandoned the idea, so the chips, the legend row, the `.price-legend-soon`
paragraph and the `.tag-soon` rule are all gone. Don't reintroduce a "coming soon"
channel — if a channel is not live, it does not appear.

The chips are not decoration: every `Formularz` chip is an `<a class="tag
tag-link" href="#zapisy" data-usluga="…">` and the script at the bottom of
`index.html` jumps to the form, selects that `data-usluga` in `#f-topic`, writes
the exact row (title + price) into the hidden `Pozycja z cennika` field and
flashes the field. `data-usluga` **must** match an `<option>` in `#f-topic`
verbatim, otherwise the click still scrolls but selects nothing — several rows
deliberately share one option (both seksuologia consultations → `Konsultacja
seksuologiczna`, both dietetyka rows → `Dietetyk kliniczny`). Every chip is a real link.

The legend above the table is one `<li>` per channel, each **chip + a single
`<span>`** — with the text as loose inline nodes the flex container broke every
wrapped line back to the left margin. Keep the wrapper span.

The four psychotherapy rows carry `ZnanyLekarz`; every row carries `Formularz`.

As of 24 Aug 2026 ZnanyLekarz booking is **live**, so those four chips are real
`<a class="tag tag-link">` links to the facility profile (`target="_blank"`,
`rel="noopener nofollow"`) — no `data-usluga`, so the form-prefill script ignores
them.

**Open question the calendar's removal created:** the three seksuologia rows now
carry `Formularz` alone, because their second chip used to be `Kalendarz online`.
They were split off in the first place under a rule that assumed ZnanyLekarz
booking did not work at all — which is no longer true. Ask the client whether
seksuologia should be bookable through ZnanyLekarz too; if yes, those rows want the
same chip as the psychotherapy ones.

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

Keep `reveal` on the **card**, never on the `.team-grid.profiles` wrapper. The
reveal observer fires when an element enters the viewport, so a container that
is many screens tall behaves badly — with ten detailed profiles the grid is over
10 000 px on a phone. It used to sit on the wrapper with a 12% visibility
threshold, which a block that tall can never reach, so the whole team section
stayed at `opacity: 0` on mobile and tablets. Per-card `reveal` keeps each
animated element around one screen tall.

```html
<article class="member member-detailed reveal">
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
    <p class="member-hours-none">Terminy ustalane indywidualnie — prosimy o kontakt z rejestracją.</p> -->
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

## Booking dialog

`Umów wizytę` no longer jumps to the form. Every instance — the header button on
all five pages and the hero CTA — carries `data-book` and opens a native
`<dialog id="book-choice">` offering two equal paths: ZnanyLekarz (opens the
facility profile in a new tab) and the Pro-Mentis form (`#zapisy`). This replaced
the old behaviour at the client's request: the form was the only route, and the
ZnanyLekarz widget sat about eight screens down where nobody scrolled to it.

`<dialog>` supplies Escape, the focus trap and `::backdrop` for free, so the script
only binds the triggers, closes on backdrop click and closes when an option is
picked. Two things that will bite if the block is ever moved:

- **The `<dialog>` markup must sit before the `<script>` block.** It lives right
  after `</footer>`. Placed after the script — the obvious spot, just before
  `</body>` — `getElementById` returns `null` at execution time and the IIFE
  returns early, silently leaving the old jump-to-form behaviour.
- **`margin: auto` is set explicitly.** The global `* { margin: 0 }` reset kills the
  centring a modal `<dialog>` normally gets for free, and it renders pinned to the
  top-left corner.

Without JS, or on a browser with no `<dialog>`, the buttons stay ordinary links to
`#zapisy` — the behaviour the site had before.

## Obszar trudności → specialists

The Zapisy form has a second, optional `<select id="f-obszar">` under the service
picker. Choosing an area renders a panel naming the specialists who cover it. Choosing an area renders a panel naming the specialists who cover it, each
linking to `#spec-…` on their card; the chosen area is also submitted, so
reception knows what the call is about before it starts.

This is a **separate axis from `#f-topic`**, on purpose. `#f-topic` lists *services*
(Psychoterapia indywidualna, Dietetyk kliniczny) and is contract-bound to the
Cennik chips — `data-usluga` has to match an `<option>` verbatim. Areas are
*problems* (lęk, żałoba, seksualność), and one problem can be served by several
services, so overloading the existing select would have broken the price-chip
prefill.

Every `.member` now carries `id="spec-<imie-nazwisko>"` plus `scroll-margin-top`,
so the links clear the sticky header.

**The map is a clinical claim, not decoration.** It routes a patient to a named
therapist; if it is wrong, they get sent to the wrong person. The 16 areas were
derived from the `Obszary wsparcia i specjalizacji` blocks on the ten cards, so
nothing in it was invented, and it went live on 7 Sep 2026 on the client's own
say-so. Treat it as live copy: **any edit to a card's areas has to come back to the
map, and the other way round** — the two drifting apart is how a patient ends up
booked with the wrong specialist.

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
- ~~The **online calendar** on pro-mentis.pl~~ — dropped in September 2026 at the
  client's request. All traces removed: chips, legend row, the "wkrótce" paragraph
  and the `.tag-soon` / `.price-legend-soon` rules.
- **Dietetyk kliniczny** — the service is in Oferta and Cennik, but there is no
  bio or photo for the dietitian in Zespół.
- **Mind4Med has no vector or transparent logo.** What we have is a 1038×1037 PNG
  of a solid royal-blue (`#063FA6`) square. It is a foreign, saturated mark against
  a cream/red/graphite palette, so it is not blended in — it gets its own white
  card in the `Partner szkoleniowy` strip at the end of Zespół. Ask for an SVG.
- **The area → specialist map needs the clinic's sign-off** before it is treated as
  authoritative (see *Obszar trudności* above).
- **Kariera has no self-service.** Adding an offer means editing `kariera.html` —
  one `<article class="job">` to copy, with the empty state as a sibling. The
  client asked for "the ability to add job offers"; if that means *they* add them,
  it needs a data file and an editor, which is a separate piece of work.
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
- ~~Photos of the rooms~~ — **arrived in round 5** and the section was promoted to
  `Poradnia` as anticipated. Worth knowing: `wnetrze-recepcja.jpg` and
  `budynek-front.jpg` used to be *visualisation renders* (grey placeholder
  rectangles where the window films now are, a logo pasted onto a bare wall); both
  are real photographs now. `tablica-wejscie.jpg` is still the one composite left —
  a real photo of the site with the sign face pasted in — but the sign genuinely
  exists, visible in `budynek-front.jpg`.
  Four of the client's originals carried their rotation **only in EXIF**; it is
  baked into the pixels in `assets/`. If those source files are ever reprocessed,
  run `ImageOps.exif_transpose` first — compression tools drop the tag and the
  photo silently lands on its side.
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
