# Dashletter — agent instructions

## What this project is
A two-person weekly letter app. Each person has a private canvas they build throughout the week. On Sunday the other person's letter is revealed. Past weeks are archived and browsable. Identity is determined by which password the user enters.

## Stack — use exactly these, no substitutions
- React + Vite (JavaScript, not TypeScript)
- Supabase JS client v2: @supabase/supabase-js
- Syne font from Google Fonts (weights 400 500 600 700 800)
- No other UI libraries. No Tailwind. No CSS-in-JS. Plain CSS with custom properties.
- No routing libraries — single-page conditional rendering only.

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`

## Environment variables
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_PASSWORD_A
VITE_PASSWORD_B

Do not hardcode any of these. Read from import.meta.env.

## Non-negotiable rules
- App name is dashletter everywhere — wordmark, code comments, package.json
- Identity comes from password only — Person A's password identifies them as A, Person B's password identifies them as B
- No NameEntryScreen — there is no separate identity selection
- One canvas per person per week
- Week starts Monday 00:00 local time, Sunday is reveal day
- Use Syne font for everything
- All colors must come from CSS custom properties — no hardcoded hex in components
- Do not add Tailwind, TypeScript, routing libraries, or any backend other than Supabase

## Design language
Same Syne typography system as maydash, but with light pink as the primary color instead of yellow. Black secondary remains. Round corners stay. Editorial Swiss feel.
