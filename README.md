# Pro-Mentis — Klinika Psychoterapii

One-page website implemented from the Claude Design handoff bundle
(`design-bundle/`). Plain HTML/CSS/JS — no build step. Open `index.html`
in a browser (or serve the folder) to view.

## Files

| File           | Purpose |
|----------------|---------|
| `index.html`   | The page markup + sticky-header / reveal-on-scroll + the **Warianty** switcher (vanilla JS). |
| `styles.css`   | Base design system — tokens, typography, default section layouts. |
| `variants.css` | Alternative section layouts + the global axes + the switcher panel styling. |
| `assets/`      | `heart.png` (mark) and `logo-full.png` (full logo). |
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

## Placeholders to replace before launch

All copy is realistic Polish placeholder text. Still needed from the client:

- Real phone number (currently `+48 000 000 000` in the header, Kontakt and footer).
- Clinic description / final hero wording (the Word file mentioned in the chat).
- The 5 therapists: names, roles, photos, bios (Zespół section).
- Real street address + landmark, and a Google Maps embed (replaces the map placeholder in Dojazd).
- The ZnanyLekarz booking widget embed code (replaces the placeholder in Kontakt).
