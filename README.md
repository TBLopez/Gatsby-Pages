# Firefly Terminal Portfolio

Interactive terminal-themed portfolio for Tony Khawaja-Lopez. Built with [Astro](https://astro.build), Tailwind CSS, and JetBrains Mono.

## Features

- **Terminal UI** — command-driven interface with tab completion, history, typewriter effects
- **5 Theme Palettes** — matrix/amber/ice/dracula/mono, switchable via `theme <name>` command
- **Matrix Rain** — toggleable CRT matrix effect (`matrix on` / `matrix off`)
- **Notion CMS** — project data sourced from a Notion database at build time
- **Achievement System** — unlockable badges for discovering easter eggs
- **CRT Scanline Overlay** — theme-aware retro display effect
- **SFX** — Web Audio API sound effects (muted by default, opt-in on first interaction)
- **Accessibility** — skip link, ARIA labels, reduced-motion support, keyboard navigation
- **Responsive** — mobile drawer sidebar, adaptive layout

## Commands

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `whoami` | Display operator info |
| `ls` | List project archives |
| `cat <file>` | Open archive inline |
| `neofetch` | System information |
| `theme <name>` | Switch palette |
| `matrix` | Toggle rain effect |
| `tail` | Toggle log feed pane |
| `reboot` | Replay boot sequence |
| `achievements` | Show operator badges |
| `contact` | Show contact channels |
| `clear` | Clear terminal (Ctrl+L) |

## Setup

```bash
# Install dependencies
npm install

# Optional: Notion CMS integration
cp .env.example .env
# Add NOTION_API_KEY and NOTION_DATA_SOURCE_ID (or NOTION_DATABASE_ID)

# Dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_API_KEY` | No | Notion integration token |
| `NOTION_DATA_SOURCE_ID` | No | Notion data source ID (v5 SDK) |
| `NOTION_DATABASE_ID` | No | Notion database ID (fallback) |

Without Notion env vars, the site runs in local mode with only the built-in files.

## Deploy

```bash
npm run deploy
```

Deploys to GitHub Pages via `gh-pages` using the CNAME configured in `public/CNAME`.
