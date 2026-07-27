# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page bilingual (English/Arabic) contact page for Sherif Pharmacy, plus a companion page to generate/print a QR code that links to it. No build step, no framework, no package manager — plain HTML/CSS/JS served as static files.

## Running / testing

There is no build, lint, or test tooling. To preview locally, serve the directory as static files, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html` (main contact page) and `http://localhost:8000/qr.html` (QR generator/print page).

## Architecture

- `index.html` — the public contact page. All visible copy is duplicated in `app.js`'s `translations` object and injected via `data-i18n="key"` attributes — there is no copy directly hardcoded for display text in the HTML beyond fallback English. When editing user-facing text, update **both** the `en` and `ar` entries in `translations` (in `app.js`) and, if adding a new string, add a matching `data-i18n` attribute in `index.html`.
- `app.js` — vanilla JS, no dependencies. Handles: i18n (language detected from `localStorage` or `navigator.language`, persisted on toggle, toggles `<html lang>`/`dir` for RTL), the Vodafone Cash number copy-to-clipboard + toast, and the discount-program accordion. Functions are initialized at the bottom of the file (`initLanguage()`, `initVodafoneCopy()`, `initDiscountAccordion()`) — new features should follow the same `initX()` + call-at-bottom pattern.
- `qr.html` — self-contained page (own inline `<style>` and `<script>`) that renders a QR code (via `public/qrcode.min.js`, a vendored copy of `davidshimjs-qrcodejs`) pointing at `index.html`, with an input to override the target URL for when the site is hosted elsewhere, plus PNG download and print support. Not linked to `styles.css`.
- `styles.css` — used only by `index.html`. Uses CSS custom properties defined on `:root` for the color/spacing system; RTL styling is handled via `html[dir="rtl"]` / `html[lang="ar"]` selectors rather than a separate stylesheet.
- `public/assets/` — logo, favicon, and payment method icons (InstaPay, Vodafone Cash) referenced by both pages.

## Content notes

- Contact details (phone number for calls/WhatsApp, InstaPay link, Vodafone Cash number, Google Maps link) are hardcoded directly in `index.html`'s `href`/`data-phone` attributes — there's no config/constants file.
- Arabic strings use Arabic-Indic numerals (e.g. `٥٬٠٠٠`) and RTL-appropriate phrasing, not just translated text — preserve that style when editing.
