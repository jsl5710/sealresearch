# SEAL — Secure and Ethical AI Lab

Website for the Secure and Ethical AI Lab at the University of Colorado Boulder.

## Stack

- **React 19** + **Vite 7** — modern SPA
- **Tailwind CSS v4** — design tokens in `src/index.css`
- **Framer Motion** — scroll and micro-animations
- Custom cursor + drifting data-node canvas background

## Content model

Everything routine lives in JSON. No component edits needed to add a paper, student, or news item.

```
src/data/
  lab.json           # lab name, mission, contact, socials
  themes.json        # 4 research themes
  people.json        # PI, students, collaborators
  publications.json  # papers (filterable by theme)
  news.json          # news timeline
  openings.json      # Join Us positions
```

## Local dev

```bash
npm install
npm run dev
```

## Deploy

Push to `main`. GitHub Actions builds and publishes to Pages.

To deploy at a project-page URL (e.g. `https://jsl5710.github.io/sealresearch/`), the workflow sets `VITE_BASE=/sealresearch/`. For a custom domain or root user-page deployment, remove that env var from `.github/workflows/deploy.yml`.

## Design tokens

Palette (in `src/index.css`):

| Token | Value | Use |
|---|---|---|
| `ink` | `#0B1929` | deep base |
| `slate` | `#1F2937` | elevated surfaces / glass tint |
| `signal` | `#22D3EE` | electric cyan — clarity, safety |
| `signal-soft` | `#67E8F9` | lighter accent |
| `ember` | `#F5C147` | warm gold — humanity, equity |
| `paper` | `#F8F5F0` | warm off-white for text on dark |
| `mist` | `#94A3B8` | muted body text |

Typography: **Fraunces** (display serif), **Inter** (body), **JetBrains Mono** (mono accents).
