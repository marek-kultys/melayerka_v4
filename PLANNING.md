# Mela Yerka Web Presence — Planning Notes

**Date:** 2026-05-16

## Context

Mela Yerka has three distinct but related businesses:

1. **Fine Art** — visual artist portfolio (`melayerka.com`)
2. **Mural Painting** — sgraffito mural business (`trowelandlime.com`)
3. **Gardening** — new garden design/maintenance business (no site yet)

The three businesses form a coherent arc: fine art → outdoor murals → garden design. Mela's artistic profile is a USP for the gardening business — customers value her artistic sensibility, and longer term she plans to design gardens, not just maintain them.

The goal is to reflect this unified identity online while keeping each business independently accessible.

---

## Current State of the Repos

### melayerka_art (`melayerka.com`)
- Raw static HTML, no build system
- 107 hand-coded HTML files (73 artwork pages across 6 series + ~34 other pages)
- Foundation CSS + jQuery 1.10.2
- Minimalist, image-first design (black/red)
- Typekit fonts, Retina.js, dark mode toggle
- High maintenance friction: nav, head, and footer duplicated across all 107 files
- A `templates/` directory exists with `painting.html`, `painting_dark.html`, `gallery.html`, `showcase.html`, `text.html` — templating was clearly intended but never completed

### trowel-and-lime (`trowelandlime.com`)
- Jekyll 3.10.0 + GitHub Pages
- Liquid templates, Sass/SCSS with Bourbon and Neat
- Modular, well-structured, low maintenance friction
- Yellow/black branded design (Playfair Display headings, Raleway body)
- Gallery of sgraffito case studies, blog, How We Work section

---

## Chosen Strategy: Option 1 — melayerka.com as the Hub

### Structure

```
melayerka.com          ← new hub/directory landing page
melayerka.com/art      ← melayerka_v4 (fine art portfolio)
melayerka.com/murals   ← trowel-and-lime (mural business)
melayerka.com/gardens  ← new repo (gardening business)
```

### Rationale

- `melayerka.com` has domain history and established SEO — it is the natural home for her unified identity
- `trowelandlime.com` has minimal traffic; the brand can migrate under the melayerka.com umbrella without meaningful SEO loss
- The hub landing page frames the art → murals → gardens narrative for first-time visitors
- Each business remains independently accessible at its own path

---

## Rebuilding melayerka_v4 in Jekyll

### Conclusion: Do it as part of the hub migration

Rebuilding melayerka_art in Jekyll is **highly feasible** and is the right call to make alongside the `/art` subpath move, rather than as a separate project. Reasons:

1. **The move forces a path update anyway.** Moving to `melayerka.com/art` requires updating relative paths across all 107 files in the current static HTML version (melayerka_art). In Jekyll, setting `baseurl: /art` in `_config.yml` handles this automatically.

2. **The structure is already template-shaped.** Every artwork page shares identical `<head>`, nav, and footer — only title, dimensions, year, image filename, and prev/next links vary. The existing `templates/` directory confirms this was the original intent.

3. **Global changes become trivial.** Adding the hub back-link to nav = edit one `_includes/nav.html`. Adding a new artwork = one file with front matter. Currently both require touching 107 files.

4. **Jekyll is already used for trowel-and-lime**, so the toolchain is familiar.

### What the rebuild involves

| Task | Effort |
|---|---|
| Create `_layouts/` from existing templates | Low — templates already exist |
| Create `_includes/` for nav + head | Low — extract from any existing page |
| Convert 73 artwork pages to front matter files | Medium — scriptable |
| Convert ~15 text pages (bio, exhibitions, etc.) | Low |
| Set `baseurl: /art` in `_config.yml` | Trivial |
| Test and verify URLs | Medium |

Estimated effort: **3–4 days**, less if artwork page conversion is scripted.

### Trickiest part

Prev/next navigation between artwork pages. Jekyll collections order by filename alphabetically. Current filenames (`01_3deers.html`, `01_hunter.html`, etc.) are already ordered this way, so `page.previous` / `page.next` should work without extra configuration.

---

## Decisions

### Hub repo
A new dedicated repo (e.g. `melayerka-hub` or `melayerka-www`) will serve the hub landing page. It is conceptually separate from all three businesses — a small directory page, not part of any sub-site — and should be independently deployable. Each sub-site repo uses its own `baseurl`. If GitHub Pages subpath routing proves fiddly, Netlify is a clean fallback for multi-repo-to-subpath configuration.

### Hub linking to sub-sites
All three sub-site links on the hub open with `target="_blank"`. Each sub-site has its own distinct design, navigation, and topic and should be experienced as a standalone property. No "back to hub" navigation is needed on any of the three sub-sites.

### Domain strategy
- Keep `melayerka.com` as the single domain for all three sub-sites.
- Abandon `trowelandlime.com` — but first set up a 301 redirect from `trowelandlime.com → melayerka.com/murals` and keep it running for 6–12 months before letting the domain expire, to preserve existing backlinks and bookmarks.

---

## Next Steps

- [ ] Design the hub landing page for `melayerka.com` (new dedicated repo)
- [ ] Set up new repo for the gardening business (Jekyll, modelled on trowel-and-lime)
- [ ] Rebuild melayerka_v4 in Jekyll with `baseurl: /art`
- [ ] Migrate trowel-and-lime to serve under `melayerka.com/murals`
- [ ] Set up 301 redirect from `trowelandlime.com` to `melayerka.com/murals`
- [ ] Update DNS / GitHub Pages config for all three paths
