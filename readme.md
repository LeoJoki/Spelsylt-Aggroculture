# Spelmotor för 2D-spel

## Introduktion

Det här repot är skapat med vite och innehåller en enkel spelmotor för 2D-spel med JavaScript och HTML5 Canvas. Spelmotorn hanterar grundläggande funktioner som spelobjekt, uppdateringsloop, rendering och input-hantering.

Vi använder Vite för att snabbt kunna starta och utveckla spelet med moderna JavaScript-funktioner och modulhantering. Kommandot för att initiera ett projkekt med Vite är:

```bash
npm create vite@latest
```

Men det är redan gjort i  detta repo, så du kan klona det direkt och börja utveckla ditt spel.

```bash
git clone <repo-url>
cd <repo-directory>
npm install
npm run dev
```

## Filstruktur

- `index.html`: Huvud-HTML-filen som laddar spelet.
- `src/`: Källkoden för spelet.
  - `Game.js`: Huvudklassen för spelet som hanterar spelloopen och spelobjekten.
  - `GameObject.js`: Bas-klass för alla spelobjekt.
  - `Rectangle.js`: Exempel på ett spelobjekt som är en rektangel.
  - `InputHandler.js`: Hanterar användarinput från tangentbordet.
- `style.css`: Grundläggande CSS för spelet.

## Kodstil

I det här projektet så använder vi import och export för att hantera moduler. Varje klass är sin egen fil och importeras där den behövs.

**Namnkonventioner:**
- Variabler och funktioner: `camelCase` (t.ex. `deltaTime`, `gameObjects`)
- Klasser: `PascalCase` (t.ex. `GameObject`, `Rectangle`)
- Klassfiler: `PascalCase.js` (t.ex. `Game.js`, `GameObject.js`)
- Konstanter: `UPPER_SNAKE_CASE` (t.ex. `MAX_SPEED`, `CANVAS_WIDTH`)

**Kodformat:**
- Inga semikolon i slutet av rader (modern JavaScript-standard)
- 4 mellanslag för indentering
- En klass per fil

## Förklaring av koden

### main.js

Denna fil startar spelet genom att skapa en instans av `Game`-klassen och initiera spelloopen. Det är alltså setup-koden för spelet.

### Game.js

Denna fil innehåller `Game`-klassen som är hjärtat i spelmotorn. Den hanterar:
- Skapandet av spelobjekt.
- Uppdateringsloopen som körs varje frame.
- Rendering av spelobjekt på canvas.
- Hantering av användarinput via `InputHandler`-klassen.

### InputHandler.js

Denna fil innehåller `InputHandler`-klassen som lyssnar på tangentbordsinput. Klassen sparar status för nedtryckta tangenter och tillhandahåller metoder för att kontrollera dessa.

Vi kan använda detta för att påverka spelobjekt i `Game.js`, till exempel genom att öka hastigheten på en rektangel när en viss tangent är nedtryckt.

I exemplet kan du använda tangenterna 'r' och 'b' för att sätta fart på rektanglarna.

### GameObject.js

Denna fil innehåller bas-klass för alla spelobjekt. Den definierar grundläggande egenskaper som position, storlek och metoder för uppdatering och rendering. Alla specifika spelobjekt (som rektanglar) kommer att ärva från denna klass.

#### Rectangle.js

Denna fil innehåller en specifik implementation av ett spelobjekt, nämligen en rektangel. Den ärver från `GameObject`-klassen och implementerar egna metoder för att rita sig själv på canvas.


