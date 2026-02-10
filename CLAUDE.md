# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing website for **Ada** — an agentic voice-driven content editor. Hosted on Cloudflare Pages at:

- **https://writewithada.com** (primary domain, project: `writewithada`)
- **https://ada.mattalldian.com** (secondary, project: `ada`)

## Architecture

Static HTML/CSS/JS site — no build step required.

| Path | Purpose |
|------|---------|
| `index.html` | Main landing page |
| `style.css` | Primary stylesheet |
| `brand/index.html` | Brand guidelines page |
| `demo-page.js` | Interactive demo logic |
| `demo-page.css` | Demo-specific styles |
| `fonts/` | Local font files (Literata) |
| `ADA_OVERVIEW.md` | Product overview doc |

## Deployment

The site is served from **three** places. All must be updated for changes to go live:

| URL | Host | Updated by |
|-----|------|-----------|
| `mattalldianhr.github.io/ada/` | GitHub Pages | `git push` (auto) |
| `writewithada.com` | Cloudflare Pages (`writewithada`) | `wrangler pages deploy` (manual) |
| `ada.mattalldian.com` | Cloudflare Pages (`ada`) | `wrangler pages deploy` (manual) |

**`git push` alone only updates GitHub Pages.** The custom domains (`writewithada.com`, `ada.mattalldian.com`) are served by Cloudflare Pages and require manual wrangler deploys.

```bash
# Full deploy (all three targets):
git push origin main                                        # → GitHub Pages (auto)
npx wrangler pages deploy . --project-name writewithada     # → writewithada.com
npx wrangler pages deploy . --project-name ada              # → ada.mattalldian.com
```

Cloudflare Pages edge cache may take 1-2 minutes to propagate after deploy. Verify with `curl -s https://writewithada.com | grep 'v0\.'`.

## Related Repositories

- **App source**: `/Users/mattalldian/Personal/projects/voice-content-editor` (Electron app, `mattalldianhr/ada-source`)
- **Public releases**: `mattalldianhr/ada` on GitHub (DMGs uploaded via `gh release create`)

## Releasing a New App Version

When the app ships a new version:

1. Build + tag in the app repo (see app repo's CLAUDE.md "Release Process" section)
2. Create GitHub release with DMGs on `mattalldianhr/ada-source`
3. Update this repo's `index.html`:
   - Version in hero section (`v{old}` → `v{new}`)
   - Download URLs (both ARM and Intel DMG hrefs)
   - Version note at bottom of download section
4. `git push` + deploy to both Cloudflare Pages projects (see Deployment above)

## Design

- Color palette: Warm paper-like (#FDFCFA), amber accent (#B45309), success green (#059669)
- Typography: Inter (UI), Literata (serif branding)
- Google Fonts for Inter, local files for Literata
