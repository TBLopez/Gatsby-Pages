# tonykl.com

Source for my personal site — a terminal-themed portfolio built with Astro.

Type `help` once it loads.

## Stack

- Astro (static output)
- Tailwind CSS
- Notion API for the project list
- GitHub Pages for hosting

## Local

```bash
npm install
npm run dev
```

Optional: set `NOTION_API_KEY` and `NOTION_DATA_SOURCE_ID` in `.env` to pull the
project list from Notion. Without those, the terminal falls back to the local
file registry.

## Deploy

```bash
npm run deploy
```

Builds to `dist/` and pushes it to the `gh-pages` branch.
