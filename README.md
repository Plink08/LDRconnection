# RenitasPalace

Een simpele basiswebsite die je direct kunt openen voor je vriendin, met Google Calendar via iframe embed.

## Wat zit erin?

- Home hero met titel en korte intro
- "Nu bezig met" statusblok
- Google Calendar agenda via embed (`<iframe ...>`)
- Countdown naar volgende date

## Bestanden

- `index.html` – structuur van de pagina + iframe embed
- `styles.css` – styling (zachte roze stijl, mobielvriendelijk)
- `script.js` – status + countdown

## Lokaal draaien

Optie 1: dubbelklik op `index.html`.

Optie 2 (aanrader):

```bash
python3 -m http.server 8000
```

Open dan `http://localhost:8000`

## Google Calendar embed aanpassen

In `index.html` staat de volledige iframe-URL in de agenda-sectie. Je kunt daar later wijzigen:

- `mode=AGENDA` (of andere view)
- `ctz=Europe/Amsterdam`
- `src=...` kalender-ID's
- `color=...` kleuren

Omdat dit embed is, hoef je geen eigen Google Calendar API code te beheren in JavaScript.
