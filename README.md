# RenitasPalace

Een simpele basiswebsite die je direct kunt openen voor je vriendin, met Google Calendar via iframe embed.

## Wat zit erin?

- Home hero met titel en korte intro
- "Nu bezig met" statusblok
- Google Calendar agenda via embed (`<iframe ...>`)
- Countdown naar volgende date
- Couple-platform structuur met eigen data per `coupleId`

## Nieuwe platform structuur (Realtime Database)

Alle relationele data wordt nu opgeslagen onder:

- `couples/{coupleId}/status`
- `couples/{coupleId}/nextDate`
- `couples/{coupleId}/loveMessages`
- `couples/{coupleId}/photos`
- `couples/{coupleId}/game/current`

Zo krijgt elk koppel zijn eigen private ruimte en overschrijft niemand elkaars data.

### Invite flow

- Nieuwe users krijgen automatisch een `coupleId` als die nog niet bestaat.
- Invite links werken via query params, bijvoorbeeld: `https://jouwsite.com/?couple=abc123`.
- Als `couple` in de URL staat, dan wordt die opgeslagen in `localStorage` en gebruikt voor alle reads/writes.

### Basis rules (voorbeeld)

```json
{
  "rules": {
    "couples": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Bestanden

- `index.html` – login pagina
- `home.html` – home dashboard
- `admin-dashboard.html` – content beheer + invite link
- `styles.css` – styling (zachte roze stijl, mobielvriendelijk)
- `script.js` – home realtime reads + games
- `admin-dashboard.js` – admin writes per couple
- `login.js` – login + couple-id resolve flow

## Lokaal draaien

Optie 1: dubbelklik op `index.html`.

Optie 2 (aanrader):

```bash
python3 -m http.server 8000
```

Open dan `http://localhost:8000`
