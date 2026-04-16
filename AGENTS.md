# Maydash — agent instructions

## What this project is
A two-person async collaborative brainstorming board. One board per browser session. Cards can be notes, images (URL), or links. Realtime sync via Supabase. No auth — identity is a name stored in localStorage.

## Stack — use exactly these, no substitutions
- React + Vite (JavaScript, not TypeScript)
- Supabase JS client v2: @supabase/supabase-js
- react-masonry-css for the grid layout
- date-fns for timestamps
- Syne font from Google Fonts (weights 400 500 600 700 800)
- No other UI libraries. No Tailwind. No CSS-in-JS. Plain CSS with custom properties.

## Commands to run the project
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`

## Environment variables required
VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must exist in .env
Do not hardcode these values. Read them from import.meta.env.

## Non-negotiable rules
- The app name is Maydash everywhere — in the UI, in code comments, in the wordmark
- Do not add routing libraries. The app is a single page.
- Do not add authentication. Identity is localStorage only.
- Do not add drag-and-drop. Position swap uses up/down buttons.
- Do not add a backend server. Supabase is the only backend.
- Do not add Tailwind or any CSS framework.
- Do not use TypeScript.
- All CSS must use the custom properties defined in index.css — no hardcoded colors anywhere in component files.
- Google Fonts link must be in index.html, not imported in JS.

## Definition of done
- [ ] `npm run build` completes with no errors
- [ ] First visit shows a name entry screen
- [ ] After entering a name, a board is created in Supabase and a welcome card appears
- [ ] Cards can be added (note, image, link types)
- [ ] Cards render with correct border color and tinted background from the color picker
- [ ] Click-to-edit works on card title and body
- [ ] Soft delete animates the card out and sets deleted=true in Supabase
- [ ] Position swap (up/down) works and persists to Supabase
- [ ] Copy link button flashes "COPIED ✓" for 2 seconds
- [ ] Settings gear opens a panel to rename the board, saves to Supabase
- [ ] Two browser tabs showing the same URL both reflect a card added in one tab within 2 seconds
- [ ] Skeleton cards appear on load and disappear when data arrives
- [ ] Card entrance animation plays on add and on realtime arrival
- [ ] Syne font renders on all text
- [ ] Board title is large, uppercase, Syne 800
- [ ] App works at mobile width (single column below 700px)
