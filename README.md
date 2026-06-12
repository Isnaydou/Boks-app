# VECHTSTIJL — Fight Gear Checklist

Een strakke, mobile-first checklist-app voor vechtsporters: pak je tas in, vink je spullen af en stap klaar de mat op. Ontworpen naar het beeld van een native Android-app op een Samsung Galaxy S24 Ultra — diep zwart, agressieve accenten (bloedrood, goud, neon geel) en vette typografie.

## Features

- **Home screen** — grid van je sporten met voortgang per tas, plus een Floating Action Button om eigen sporten toe te voegen (met icoon- en kleurkeuze).
- **Checklist per sport** — tik om spullen af te vinken, met voortgangsbalk en een gouden *“Klaar voor de strijd”*-status als alles is ingepakt.
- **Beschermde bewerkmodus** — *Spullen toevoegen* en *Spullen verwijderen* zitten achter het kebab-menu (⋮) rechtsboven, zodat je nooit per ongeluk iets wist. Sport verwijderen vraagt extra bevestiging.
- **Opslag** — alles (afvinkstatus én eigen sporten) wordt bewaard in `localStorage`, dus je lijst staat er na een herstart nog precies zo bij.
- Voorgevuld met checklists voor **MMA**, **Jiu-jitsu**, **Worstelen** en **Muay thai**.

## Tech

- React 19 (één component: [`src/App.jsx`](src/App.jsx))
- Vite 7 + Tailwind CSS 4
- lucide-react icons
- Zelf-gehoste fonts: Anton (display) en Inter (UI)

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # productie-build naar dist/
npm run preview  # serveer de build lokaal
```

Op schermen ≥1024px wordt de app in een S24 Ultra-achtig telefoonframe gerenderd (punch-hole camera, statusbalk, gesture-pill); op mobiel vult hij gewoon het hele scherm.
