# Steg 9: GameBase - Abstraktion och återanvändning

Efter 8 steg har vi byggt ett komplett plattformsspel! Men vad händer om vi vill skapa ett annat typ av spel - ett space shooter till exempel? Då skulle vi behöva kopiera mycket kod från `Game.js`, och snart har vi duplicerad kod överallt. Det är här **abstraktion** och **arv** kommer in.

## Vad lär vi oss?

I detta steg fokuserar vi på:
- **Abstract Base Class** - Skapa en grundklass som andra klasser ärver från
- **Arv (Inheritance)** - Återanvänd gemensam funktionalitet
- **Template Method Pattern** - Definiera struktur, låt subklasser fylla i detaljer
- **Separation of Concerns** - Dela upp ansvar mellan klasser
- **DRY (Don't Repeat Yourself)** - Undvik duplicerad kod

## Översikt

För att göra vår kod återanvändbar skapar vi:
1. **GameBase** - Abstract basklass med gemensam funktionalitet
2. **Game** - Refaktorerad till att extendera GameBase
3. **Tydlig separation** - Vad är generellt vs plattformsspel-specifikt

## Problemet - Spelspecifik kod i Game.js

Efter 8 steg innehåller `Game.js` en stor blandning av generella spelfunktioner och plattformsspel-specifik logik. Det är något som byggts upp under de tidigare stegen. 
Det går att argumentera för att det är felaktiga designval att introducera så mycket spelspecifik logik i Game-klassen men samtidigt så blir det väldigt svårt att hänga med i vad vi gör om allt ska delas upp i för många filer och klasser från början.

Men för att nu refaktorisera spelmotorn så att den är redo för flera speltyper så behöver vi separera det som är **generellt** från det som är **plattformsspel-specifikt**. Ni känner förhoppningsvis igen tänket med att hitta det som är gemensamt och det som är specifikt.

**Generella saker (alla speltyper behöver):**
- InputHandler, UserInterface, Camera
- Game state (PLAYING, GAME_OVER, WIN)
- Score system
- Fiender och projektiler
- World bounds

**Plattformsspel-specifika saker:**
- Gravity och friction
- Plattformar
- Mynt som samlas in
- Plattformskollisioner

**Vad händer om vi vill skapa ett space shooter?**
- Inget gravity system
- Inga plattformar
- Kanske power-ups istället för mynt
- Men samma input, UI, camera, score, fiender, projektiler!

## Lösningen - Abstract Base Class

Vi skapar `GameBase` - en abstrakt basklass som innehåller allt som är **gemensamt** för alla speltyper. Sedan låter vi `Game` ärva från `GameBase` och implementera all plattformsspel-specifik logik. Samma mönster som vi har använt för `GameObject` och `Rectangle`.

### Vad är en Abstract Base Class?

En abstract class är en klass som inte kan instansieras direkt. Den fungerar som en mall för andra klasser. Om vi ska använda hus-analogin från när vi förklarat OOP tidigare så är `GameBase` vad som krävs för att skapa ett hus, väggar och annat som krävs för att det ska bli ett hus. Sedan kan vi skapa olika typer av hus (t.ex. villa, lägenhet) som ärver från `GameBase` och lägger till sina egna specifika detaljer. Sedan när vi faktiskt bygger ett hus så skapar vi en instans av en specifik typ av hus, inte av `GameBase` direkt.

### Struktur

```
GameBase (abstract)
├── Properties: width, height, score, gameState, camera, enemies, projectiles
├── Methods: addProjectile(), getProjectileClass()
├── Abstract: init(), restart(), update(), draw()
│
├── Game (plattformsspel)
│   ├── Extends GameBase
│   ├── Adds: gravity, friction, platforms, coins
│   └── Implements: init(), restart(), update(), draw()
│
└── SpaceShooter (framtida)
    ├── Extends GameBase
    ├── Adds: asteroids, powerups, scrolling background
    └── Implements: init(), restart(), update(), draw()
```

## Implementering
### GameBase.js

Vi börjar med att skapa den abstrakta basklassen `GameBase.js`, du kan titta på koden i filen [src/GameBase.js](src/GameBase.js).

### Viktiga delar

#### Constructor check

I konstruktorn kollar vi om någon försöker skapa en instans av `GameBase` direkt, om så är fallet kastar vi ett error.

```javascript
if (new.target === GameBase) {
    throw new Error('GameBase är en abstract class')
}
```

#### Gemensamma properties

Här försöker vi samla alla properties som är gemensamma för alla speltyper. Det är inget facit eller rätt eller fel, utan en bedömning av vad som är generellt vs specifikt.
Om vi skapar en farming-simulator i framtiden så kanske vi inte behöver `enemies` eller `projectiles`.

- `width, height` - Canvas storlek
- `worldWidth, worldHeight` - Världens storlek (för scrolling)
- `gameState` - State machine
- `score` - Poängsystem
- `inputHandler, ui, camera` - Gemensamma system
- `enemies[]` - De flesta spel har fiender

#### Abstract methods

Vissa av metoderna vill vi "tvinga" subklasser att implementera själva, eftersom de är spelspecifika. Vi gör detta genom att skapa **abstrakta metoder** som kastar ett error om de inte implementeras.
Det är mest ett hjälpmedel för att undvika misstag, inget måste. Men när vi har det på plats så berättar vi för andra utvecklare (och oss själva) att dessa metoder MÅSTE implementeras i subklasserna.

```javascript
init() {
    throw new Error('init() måste implementeras')
}
```

### Game.js - Refaktorerad med arv

Nu kan vi komma igång med att refaktorisera `Game.js` för att ärva från `GameBase`. Titta på den refaktorerade koden i [src/Game.js](src/Game.js). Vi vill ladda in de plattformsspel-specifika delarna i `Game.js` och låta `GameBase` hantera det generella.

### Vad händer när vi gör `new Game(800, 600)`?

1. **Game constructor körs**
   ```javascript
   constructor(width, height) {
       super(width, height)  // Anropar GameBase constructor
   ```

2. **GameBase constructor körs**
   - Skapar `inputHandler`, `ui`, `camera`
   - Sätter `score = 0`, `gameState = 'PLAYING'`
   - Initialiserar `enemies = []`

3. **Tillbaka till Game constructor**
   - Lägger till `gravity`, `friction` (plattformsspel-specifikt)
   - Lägger till `coinsCollected`, `totalCoins`
   - Anropar `this.init()`

4. **Game.init() körs**
   - Skapar `player`, `platforms`, `coins`, `enemies`
   - Skapar `projectiles = []` (plattformsspel-specifikt)

**Resultat:** Ett `Game`-objekt som har både GameBase funktionalitet OCH plattformsspel-funktionalitet!

## Varför är detta bättre?

Förhoppningsvis är inte abstraktionen sådär jätteförvirrande och att du kan se fördelarna med att dela upp koden på detta sätt. Fördelarna är om vi tittar på vad Game.js innehöll så kan vi se att Input, UI, Camera, Score, GameState, Enemies och Projectiles är kod som skulle dupliceras i varje spel vi skapar. 

```
Game.js (300 rader)
├── Input, UI, Camera (50 rader)
├── Score, GameState (20 rader)
├── Enemies, Projectiles (80 rader)
├── Platforms, Coins (50 rader)
└── Game loop (100 rader)
```

## Design patterns

### Template Method Pattern

GameBase definierar "mallen" för hur ett spel ska fungera:
```
1. Konstruktor, Skapa gemensamma system
2. init(), Skapa spelobjekt, tänk level
3. update(deltaTime), Uppdatera logik
4. draw(ctx), Rita logik
5. restart(), Återställ spelet
```

Subklasser "fyller i detaljerna" men följer samma struktur.

### Separation of Concerns

**GameBase ansvarar för:**
- Gemensamma system (input, UI, camera)
- Definiera interface (abstrakta metoder)
- Minimala gemensamma properties (score, gameState, enemies)

**Game ansvarar för:**
- Plattformsspel-specifik logik
- Skapa och hantera plattformsobjekt
- Implementera game loop för plattformsfysik
- Projektil-system (addProjectile, projectiles array)

**Varför är detta bra?**
Varje klass har ett tydligt ansvar. Om något med camera är fel - kolla GameBase. Om plattformskollisioner är fel - kolla Game.

### Open/Closed Principle

> "Open for extension, closed for modification"

- **Open:** Vi kan extendera GameBase med nya speltyper (SpaceShooter, TwinStick)
- **Closed:** Vi behöver inte ändra GameBase när vi lägger till nya spel

Detta är en av SOLID-principerna för objektorienterad design.

## OOP principer och koncept

I det här steget så har vi använt flera viktiga OOP-principer och koncept. Vi börjar med arv, där `Game` ärver från `GameBase`, vilket gör att vi kan återanvända gemensam funktionalitet utan att duplicera kod.

Men vi har också ett tydligt exempel på abstraktion, där `GameBase` fungerar som en abstrakt basklass som definierar ett interface för alla speltyper. Detta gör att vi kan skapa olika spel (som plattformsspel eller space shooter) utan att behöva oroa oss för de specifika detaljerna i varje speltyp.

Samtidigt så har vi också tittat på ett steg i vårt kodande där det var dags att refaktorisera och organisera koden bättre. Genom att skapa `GameBase` så har vi separerat det generella från det specifika, vilket gör koden mer modulär och lättare att underhålla.
Detta är också ett exempel på "Separation of Concerns", där varje klass har ett tydligt ansvar och fokus.