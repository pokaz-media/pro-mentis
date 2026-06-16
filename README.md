# Pro-Mentis — Klinika Psychoterapii

One-page website implemented from the Claude Design handoff bundle
(`design-bundle/`). Plain HTML/CSS/JS — no build step. Open `index.html`
in a browser (or serve the folder) to view.

## Files

| File           | Purpose |
|----------------|---------|
| `index.html`   | The page markup (Hero · Oferta · **Cennik** · Zespół · Misja · Dojazd · Kontakt · **Zapisy/formularz**) + sticky-header / reveal-on-scroll + the **Warianty** switcher (vanilla JS). |
| `styles.css`   | Base design system — tokens, typography, default section layouts (incl. Cennik + signup form). |
| `variants.css` | Alternative section layouts + the global axes + the switcher panel styling. |
| `assets/`      | `logo-heart.svg` (clean vector heart — used for the mark, hero/mission art and favicon), `heart.png` (legacy raster), `logo-full.png` (full logo, still raster). |
| `design-bundle/` | The original Claude Design export (prototype HTML, chat transcript, screenshots) kept for reference. |

## The "Warianty" switcher

The bottom-right panel lets you compare the design alternatives the client
asked for and pick a direction. It was rebuilt in plain JavaScript (the
prototype used React + Babel loaded from a CDN, which isn't needed for a
real site). Choices apply instantly via `data-*` attributes and are saved
to `localStorage`, so the page reopens with your last selection.

- **Section layouts (4 each):** Hero · Oferta · Zespół · Misja · Dojazd · Kontakt
- **Atmosphere & colour:** background (krem / papier / chłodny), accent (grafit / klasyczny / wyrazisty)
- **Motion & form:** entrance transitions, corner radius, density
- **Typography:** heading font (Cormorant / Lora / Playfair), body font (Hanken / Mulish / Work Sans)

**Loaded defaults** (the state saved in the handoff): editorial hero,
grid Oferta, grid Zespół, split Misja, map-left Dojazd, widget-left Kontakt,
cream background, expressive red accent, scale transition, sharp corners,
regular density, Cormorant + Hanken.

Once a final combination is chosen, the switcher can be deleted (the
second `<script>` block + the `.pm-*` rules at the bottom of `variants.css`)
and the chosen values baked into the markup's `data-*` attributes.

## Signup form (Zapisy)

The bottom section is a contact / booking form that submits **by e-mail with no
backend** via [FormSubmit](https://formsubmit.co) to `kontakt@pro-mentis.pl`.

- **First-time activation:** FormSubmit sends a one-off confirmation e-mail to
  `kontakt@pro-mentis.pl` after the very first submission — click the link there
  once and submissions start arriving. Until then the mailbox must exist.
- On the production host (`pro-mentis.pl`) the `action` can be swapped for a
  own PHP `mail()` handler — see the comment above the `<form>` in `index.html`.
- The RODO consent links to a **privacy policy page that does not exist yet**
  (`href="#"` placeholder) — add `Polityka prywatności` content before launch.

## Placeholders to replace before launch

All copy is realistic Polish placeholder text. Still needed from the client:

- Real phone number (currently `+48 000 000 000` in the header, Kontakt and footer).
- Clinic description / final hero wording (the Word file mentioned in the chat).
- The 5 therapists: names, roles, photos, bios (Zespół section).
- A real Google Maps embed for the Dojazd section (address is now `ul. Drewnowska 102, Łódź`;
  the address links open Google Maps, but the in-page map is still a placeholder).
- The ZnanyLekarz booking widget embed code (replaces the placeholder in Kontakt).
- A **vector (SVG) version of the full logo** for the footer — only the heart mark
  is vector so far; the footer still uses the raster `logo-full.png`.
- A `Polityka prywatności` page for the form's RODO consent link.
