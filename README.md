# RenitasPalace

Een simpele basiswebsite die je direct kunt openen voor je vriendin, nu met een Google Calendar-koppeling op **bezet/vrij niveau** (zonder eventnamen of beschrijvingen).

## Wat zit erin?

- Home hero met titel en korte intro
- "Nu bezig met" statusblok
- Google Calendar agenda-overzicht op basis van **busy blocks**
- Countdown naar volgende date

## Bestanden

- `index.html` – structuur van de pagina
- `styles.css` – styling (zachte roze stijl, mobielvriendelijk)
- `script.js` – voorbeelddata + Google Calendar FreeBusy API + countdown

## Lokaal draaien

Optie 1: dubbelklik op `index.html`.

Optie 2 (aanrader): start een lokale server:

```bash
python3 -m http.server 8000
```

Open dan: `http://localhost:8000`

## Google Calendar koppelen (zonder details te tonen)

Deze site gebruikt de endpoint:

- `POST https://www.googleapis.com/calendar/v3/freeBusy`

Daardoor laat je alleen zien wanneer je bezet bent, niet **wat** de afspraak is.

### Stap 1: API key maken

1. Maak een project in Google Cloud.
2. Zet de **Google Calendar API** aan.
3. Maak een API key.

### Stap 2: Calendar ID pakken

- Open Google Calendar → instellingen van je kalender → "Calendar ID".

### Stap 3: Leestoegang regelen

- Deel die kalender met het account of maak hem zichtbaar volgens je gewenste privacy-instelling.
- Let op: als de kalender niet toegankelijk is voor de API-call, krijg je een foutmelding.

### Stap 4: In de site invullen

- Vul API key + Calendar ID in de velden.
- Klik op "Opslaan" en daarna op "Agenda laden".

Instellingen worden lokaal in `localStorage` bewaard op dat apparaat.

## Privacy

- Deze versie toont alleen blokken "Bezet" met begin/eindtijd.
- Geen event-titels, beschrijvingen of locaties.
- Wil je later nog veiliger: zet een kleine backend ertussen zodat je API key niet in de browser staat.
