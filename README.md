# RenitasPalace

Starterplan voor een persoonlijke website voor je vriendin, met focus op jouw planning, updates en leuke extra's.

## 1) Stack (snel en simpel)

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Data + Auth:** Supabase (PostgreSQL + login)
- **Hosting:** Vercel

Waarom deze keuze:
- snel op te zetten;
- gratis tiers zijn vaak genoeg voor een privéproject;
- makkelijk later uit te breiden.

## 2) MVP-functionaliteiten (eerste versie)

Bouw eerst deze pagina's:

1. **Home**
   - korte welkomsttekst;
   - "nu bezig met" status;
   - komende afspraak (eerst handmatig).

2. **Schedule**
   - tabs: Vandaag / Deze week / Alles;
   - events met tijd, titel, locatie, notitie;
   - kleur per categorie (werk, sport, vrij, date).

3. **Memories (optioneel in v1)**
   - foto + caption + datum.

4. **Login/Privacy**
   - alleen jij en je vriendin hebben toegang.

## 3) Database schema (Supabase)

Maak deze tabellen aan:

### `events`
- `id` (uuid, pk)
- `title` (text, not null)
- `description` (text, nullable)
- `start_at` (timestamptz, not null)
- `end_at` (timestamptz, nullable)
- `category` (text, default `other`)
- `location` (text, nullable)
- `created_at` (timestamptz, default now)

### `status_updates`
- `id` (uuid, pk)
- `content` (text, not null)
- `created_at` (timestamptz, default now)

### `memories`
- `id` (uuid, pk)
- `image_url` (text, not null)
- `caption` (text, nullable)
- `memory_date` (date, nullable)
- `created_at` (timestamptz, default now)

### Row Level Security
- zet RLS aan op alle tabellen;
- policy: alleen ingelogde gebruikers met expliciete toegang mogen lezen/schrijven.

## 4) Projectstructuur

```txt
renitas-palace/
  app/
    (private)/
      page.tsx              # Home dashboard
      schedule/page.tsx     # Overzicht planning
      memories/page.tsx     # Foto/herinneringen
    login/page.tsx          # Inloggen
    layout.tsx
    globals.css
  components/
    schedule/
      event-card.tsx
      schedule-tabs.tsx
    ui/
      badge.tsx
      card.tsx
  lib/
    supabase/
      client.ts
      server.ts
    utils/
      date.ts
  types/
    database.ts
  .env.local
```

## 5) Installatiestappen

```bash
# 1) nieuw project
npx create-next-app@latest renitas-palace --ts --tailwind --eslint --app
cd renitas-palace

# 2) supabase client
npm i @supabase/supabase-js @supabase/ssr

# 3) datum helpers
npm i date-fns
```

Environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 6) Bouwvolgorde (weekendplan)

### Dag 1
- project opzetten;
- Supabase koppelen;
- loginflow maken;
- `events` ophalen en tonen in eenvoudige lijst.

### Dag 2
- tabs Vandaag/Week/Alles;
- categorie-kleuren + betere UI;
- statusblok op home;
- deploy naar Vercel en testen op mobiel.

## 7) Uitbreidingen voor v2

- **Google Calendar sync** via API;
- **Push/Telegram notificaties** bij belangrijke events;
- **Countdown widget** naar volgende date;
- **Shared notes** (korte berichtjes voor elkaar);
- **Spotify embed** met jullie playlist.

## 8) Security checklist

- gebruik altijd auth (geen publieke planning);
- zet RLS aan en test policies;
- gebruik alleen server-side keys in veilige context;
- draai nooit secrets mee naar de browser;
- voeg simpele rate limiting toe op schrijf-acties.

## 9) Definition of Done (MVP)

- login werkt;
- home toont recente status + eerstvolgend event;
- schedule toont events per tab;
- data komt uit Supabase;
- site staat live op Vercel;
- mobiele weergave is bruikbaar.

---

Als je wilt, kan de volgende stap zijn dat we hier direct de echte Next.js basisbestanden in deze repo scaffolden.
