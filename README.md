# Claudia Reedy — Portfolio

A static, hand-editable, framework-free portfolio. Vanilla HTML, CSS, and a single JS file. No build step.

---

## Run locally

From the project root:

```bash
npx serve .
```

Or any equivalent static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:3000` (serve) or `http://localhost:8000` (python).

---

## Deploy

Any static host works — no build step to configure.

**Vercel CLI**
```bash
npx vercel deploy --prod
```

**Netlify CLI**
```bash
npx netlify deploy --prod --dir=.
```

**Cloudflare Pages** (currently in use — supports the password gate below)
1. Push to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo → save (no build command, output dir = `/`).
3. Custom domain: Pages → this project → Custom domains → set `claudiareedy.com`.

**GitHub Pages**
1. Push the repo to GitHub.
2. Settings → Pages → Build and deployment → Source: "Deploy from a branch" → `main` / root.
3. Done. URL appears in the Pages settings within a minute.

**Drag-and-drop** also works on Vercel and Netlify — drop the project folder onto their dashboard upload.

---

## Password protection (Cloudflare Pages only)

The site is gated by HTTP Basic Auth via `functions/_middleware.js`. Cloudflare Pages runs that middleware on every request.

**To enable / change the password:**
1. Cloudflare dashboard → Workers & Pages → this project → Settings → Environment variables.
2. Set under **Production**:
   - `AUTH_USER` — username (defaults to `claudia` if unset)
   - `AUTH_PASS` — the shared password
3. Trigger a redeploy: Deployments → latest → Retry deployment.

**To remove auth (open the site):** delete `AUTH_PASS` in the dashboard and redeploy.

If `AUTH_PASS` is unset, the middleware lets all traffic through — handy for local dev or pre-launch.

---

## File structure

```
.
├── index.html                      Home
├── about.html                      About
├── case-studies/
│   ├── support-portal.html         Case Study 01 — AI workflow
│   ├── icruise.html                Case Study 02 — product redesign + triptych
│   └── nea-hub.html                Case Study 03 — pitch defense + video centerpiece
├── styles/
│   ├── tokens.css                  CSS variables, fonts, base reset, body grain
│   ├── system.css                  Shared components (nav, hero, hook, numbers wrapper, body-section, divider, visual-block, next-up, footer, CTA)
│   ├── case-study.css              Case-study patterns (numbers variants, terminal, triptych, video, timeline, chrono-marker)
│   ├── home.css                    Home-only (hero overrides, intro strip, case list)
│   └── about.css                   About-only (portrait hero, thread, principles, stack, CV)
├── scripts/
│   └── reveal.js                   IntersectionObserver fade-up for [data-reveal] elements
├── assets/
│   ├── images/                     (Empty — see TODO below)
│   └── video/                      (Empty — see TODO below)
└── README.md
```

Every page loads stylesheets in this order: `tokens.css` → `system.css` → page-specific. The cascade is intentional — page-specific overrides the system.

---

## How it's organized (mental model)

- **`tokens.css`** — your design system constants. Change a color or font here and it propagates everywhere. The `--accent` variable (was `--rust`) is set to the same value as `--ink` so the system reads as monochrome; bumping it to a real accent color is a one-line change.
- **`system.css`** — components shared across more than one page. If a pattern repeats on home + about + case studies (nav, footer, CTA strip, hero shell), it lives here.
- **`case-study.css`** — patterns that only appear on case-study pages. The numbers-block inner variants, terminal, triptych (iCruise), video centerpiece + timeline (NEA), and the chrono marker.
- **`home.css` / `about.css`** — page-specific only. Each is a single-page concern.

A few small things that aren't obvious from filenames:

- **`.hero--home` modifier**: the `<section class="hero">` shell is shared, but the home page's hero needs a much larger title than case-study heroes. The home page uses `class="hero hero--home"` and the override lives in `home.css`.
- **`.page-home` / `.page-about` / `.page-case-study` body classes**: present on every page in case you want to scope a future override. Currently the only one in use is `.page-about .cta { margin-top: 60px }` in `about.css`.
- **`[data-reveal]` attribute**: any element with this attribute fades in on scroll. Add it to a section to opt-in; remove it to opt-out. The observer logic lives in `scripts/reveal.js` and respects `prefers-reduced-motion`.

---

## How to add a new case study

1. **Copy** an existing case study HTML as the closest template:
   - `support-portal.html` if you have a stat-driven story (headline number + side stats).
   - `icruise.html` if you have multiple "wins" or a triptych comparison.
   - `nea-hub.html` if you have a video walkthrough and a timeline.
2. **Rename** the file to `case-studies/your-slug.html`.
3. **Edit** the HTML — replace title, eyebrow tags, hook, numbers content, body sections, visual placeholders. Keep class names as-is so the shared CSS still applies.
4. **Add the card to the home page**: open `index.html`, copy one of the `<a class="case-card">…</a>` blocks inside `.case-list`, change the number, tags, title, description, stat line, and `href`.
5. **Wire the next-up footer**: at the bottom of your new case study, set the next-up link to whichever case study should follow. Update the previous case study's next-up to point to yours if you want the chain to flow through.
6. **Update the work count** in `index.html`'s `.work-count` (e.g. `04 / 04`).

No CSS changes should be needed unless your case study introduces a new pattern. If it does, add it to `case-study.css` (not to a page-specific file).

---

## Visual placeholders

Every page renders without any real images. The placeholder boxes (`.visual-frame`, `.case-image`, `.portrait-frame`, `.skin-frame`, `.video-frame`) ship a labeled tag describing what asset belongs in each slot. To swap in real assets:

1. Drop your image into `assets/images/` (or a video into `assets/video/`).
2. In the relevant HTML, replace the `<div class="visual-frame">…</div>` block with an `<img>` (or `<video>`). The frame styling is on `.visual-frame`; the simplest swap is:
   ```html
   <div class="visual-block wide">
     <img src="../assets/images/your-image.png" alt="Description"
          style="width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:4px;">
     <p class="visual-caption">…</p>
   </div>
   ```
3. Or keep `.visual-frame` and add an image inside it as a background — your call which reads cleaner.

---

## TODO for the owner

These are intentionally left undone. Pick them up when you're ready.

- [ ] **Portrait photo** — `assets/images/portrait.jpg` (4:5 editorial). Replace the placeholder in `about.html` inside `.portrait-frame`.
- [ ] **Case-card images** (3 × 4:3) for the home page case list. Replace placeholders inside each `.case-image` block in `index.html`.
- [ ] **Visual placeholders inside case studies** — each case study has 3–4 labeled slots. Look for `<span class="vlabel-tag">` to find them.
- [ ] **NEA full-bleed video** — replace the `.video-placeholder` block in `case-studies/nea-hub.html` with a real `<video>` or YouTube/Vimeo embed.
- [ ] **Triptych skins** — three placeholder frames in `case-studies/icruise.html` (`.skin-frame`).
- [ ] **`contact.html`** — referenced from the nav on home + about (`<a href="#">Contact</a>`). Build using the `.cta` strip pattern from `index.html` or `about.html` as a template, then update the two nav links.
- [ ] **Email + LinkedIn URLs** — currently `href="#"` in the `cta-button` and footer of every page. Search-and-replace.
- [ ] **Résumé PDF** — `cv-link` href in `about.html`.
- [ ] **Logo link target** — currently every `class="logo"` points to `index.html`; if you want it to scroll to top on the home page specifically, swap to `href="#top"` on home.

---

## Maintenance notes

- **Fonts**: Fraunces, Geist, Geist Mono — loaded from Google Fonts on every page. The font URL is identical across all five HTML files; if you ever swap fonts, change all five.
- **Theme color**: `--accent` in `tokens.css`. Set to `#1a1a1a` (same as `--ink`) for the current monochrome look. Bump to anything else (e.g. a real rust `#a04a2c`) and the whole system updates.
- **Reveal animation**: any new section that should fade in on scroll just needs `data-reveal` as an attribute. No JS changes required.
