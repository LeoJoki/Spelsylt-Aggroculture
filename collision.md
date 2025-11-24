# Kollisionsdetektering

I den här delen lär vi oss om kollisionsdetektering - hur vi kan upptäcka när två objekt i spelet kolliderar med varandra. Detta är fundamentalt för att skapa interaktiva spel där spelaren kan plocka upp föremål, stöta på hinder, eller ta skada från fiender.

## Förutsättningar

Innan du börjar med kollisioner bör du ha:
- En fungerande `GameObject`-klass
- En `Player`-klass som kan röra sig (se [player.md](player.md))
- Minst en annan typ av objekt (t.ex. `Rectangle`)

## Vad är AABB-kollision?

AABB står för **Axis-Aligned Bounding Box** - det är den enklaste och snabbaste formen av kollisionsdetektering för rektanglar.

### Hur fungerar det?

Två rektanglar kolliderar om de **överlappar varandra**. För att kolla detta måste alla dessa villkor vara sanna:
- Vänster sida av rektangel A är till vänster om höger sida av rektangel B
- Höger sida av rektangel A är till höger om vänster sida av rektangel B
- Toppen av rektangel A är ovanför botten av rektangel B
- Botten av rektangel A är under toppen av rektangel B

### Implementering i GameObject

I `GameObject`-klassen finns redan metoden `intersects()`:

```javascript
intersects(other) {
    return this.x < other.x + other.width &&
           this.x + this.width > other.x &&
           this.y < other.y + other.height &&
           this.y + this.height > other.y
}
```

### Vad fungerar den med?

✅ **Fungerar med:**
- Rektanglar som är parallella med axlarna (inte roterade)
- Kvadrater
- Alla objekt med `x`, `y`, `width`, och `height`

❌ **Fungerar INTE med:**
- Roterade rektanglar
- Cirklar
- Trianglar eller andra polygoner

## Var ska kollision kontrolleras?

Det är `Game`-klassens ansvar att kontrollera kollisioner. Detta följer **Single Responsibility Principle**:

**Varför Game?**
- ✅ Game har överblick över alla objekt
- ✅ Spelregler hanteras centralt
- ✅ Player behöver inte veta om andra objekt
- ✅ Enklare att testa och underhålla

**Viktigt:** Spelaren ska lagras separat från `gameObjects`-arrayen:

```javascript
// I Game.js constructor
export default class Game {
    constructor(width, height) {
        this.width = width
        this.height = height
        
        this.inputHandler = new InputHandler(this)
        
        // Spelaren separat
        this.player = new Player(this, 50, 50, 50, 50, 'green')
        
        // Andra objekt i en array
        this.gameObjects = [
            new Rectangle(this, 200, 150, 50, 50, 'red'),
            new Rectangle(this, 300, 200, 100, 30, 'blue')
        ]
    }
}
```

## Grundläggande kollisionskontroll

I `Game`-klassens `update()`-metod lägger vi till kollisionskontroll:

```javascript
update(deltaTime) {
    // Uppdatera alla objekt
    this.player.update(deltaTime)
    this.gameObjects.forEach(obj => obj.update(deltaTime))
    
    // Kolla kollision mellan spelaren och andra objekt
    this.gameObjects.forEach(obj => {
        if (this.player.intersects(obj)) {
            console.log('Kollision!') // För testning
            // Här hanterar vi kollisionen
        }
    })
}
```

## Kollisionsrespons - Stoppa spelaren

När vi upptäcker en kollision måste vi **reagera** på den. Det vanligaste är att stoppa spelaren från att gå igenom objektet.

### Enkel version - Flytta tillbaka spelaren

Vi använder `directionX` och `directionY` från `Player`-klassen för att veta åt vilket håll spelaren rör sig:

```javascript
this.gameObjects.forEach(obj => {
    if (this.player.intersects(obj)) {
        // Hantera kollision baserat på riktning
        if (this.player.directionX > 0) { // rör sig åt höger
            this.player.x = obj.x - this.player.width
        } else if (this.player.directionX < 0) { // rör sig åt vänster
            this.player.x = obj.x + obj.width
        }
        
        if (this.player.directionY > 0) { // rör sig neråt
            this.player.y = obj.y - this.player.height
        } else if (this.player.directionY < 0) { // rör sig uppåt
            this.player.y = obj.y + obj.height
        }
    }
})
```

### Varför fungerar detta?

- När spelaren rör sig **åt höger** (`directionX > 0`), placerar vi spelaren precis till **vänster** om objektet
- När spelaren rör sig **åt vänster** (`directionX < 0`), placerar vi spelaren precis till **höger** om objektet
- Samma logik för vertikal rörelse

## Rita spelaren korrekt

För att spelaren ska synas ovanpå andra objekt, rita den sist:

```javascript
draw(ctx) {
    // Rita alla andra objekt först
    this.gameObjects.forEach(obj => obj.draw(ctx))
    
    // Rita spelaren sist (hamnar överst)
    this.player.draw(ctx)
}
```

## Uppgifter

### 1. Grundläggande kollision

Implementera kollisionsdetektering mellan spelaren och flera rektanglar. Testa att spelaren inte kan gå igenom dem.

### 2. Visuell feedback

När spelaren kolliderar med ett objekt, byt färg på objektet eller spelaren för att visa att kollision har inträffat.

```javascript
if (this.player.intersects(obj)) {
    obj.color = 'red' // Ändra färg vid kollision
    // ... hantera kollision
}
```

### 3. En labyrint

Skapa en enkel labyrint med rektanglar som spelaren måste navigera genom:

```javascript
this.gameObjects = [
    // Väggar
    new Rectangle(this, 0, 0, 800, 20, 'gray'),      // Topp
    new Rectangle(this, 0, 460, 800, 20, 'gray'),    // Botten
    new Rectangle(this, 0, 0, 20, 480, 'gray'),      // Vänster
    new Rectangle(this, 780, 0, 20, 480, 'gray'),    // Höger
    
    // Hinder
    new Rectangle(this, 200, 100, 20, 200, 'gray'),
    new Rectangle(this, 400, 200, 20, 200, 'gray')
]
```

### 4. Mål-objekt

Skapa en `Goal`-klass som spelaren kan nå:

```javascript
export default class Goal extends GameObject {
    constructor(game, x, y, size) {
        super(game, x, y, size, size)
        this.color = 'gold'
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}
```

Lägg till i `Game`:

```javascript
this.goal = new Goal(this, 700, 400, 30)

// I update()
if (this.player.intersects(this.goal)) {
    console.log('Du vann!')
    // Visa vinstmeddelande, starta om nivå, etc.
}
```

### 5. Samlingsobjekt

Skapa objekt som spelaren kan plocka upp:

```javascript
// I update()
this.gameObjects.forEach((obj, index) => {
    if (obj.collectible && this.player.intersects(obj)) {
        this.gameObjects.splice(index, 1) // Ta bort objektet
        this.score += 10 // Öka poäng
    }
})
```

## Avancerade koncept

### Problem med AABB-kollision

Den nuvarande implementationen har några begränsningar:

1. **Fästning i hörn** - Om spelaren rör sig diagonalt kan den fastna
2. **Tunneling** - Vid hög hastighet kan spelaren gå igenom tunna objekt
3. **Rotation stöds inte** - Fungerar bara för icke-roterade rektanglar

### Förbättringar

**Separera X och Y kollision:**
Istället för att kontrollera kollision efter att vi har flyttat spelaren, kan vi:
1. Flytta X-position
2. Kolla kollision, fixa X om nödvändigt
3. Flytta Y-position
4. Kolla kollision, fixa Y om nödvändigt

Detta förhindrar att spelaren fastnar i hörn.

## Testfrågor

1. Vad betyder AABB och vilka former fungerar den med?
2. Varför lagras spelaren separat från `gameObjects`-arrayen?
3. Varför är det `Game`-klassen som ansvarar för kollisionsdetektering?
4. När spelaren rör sig åt höger och kolliderar, var placerar vi spelaren?
5. Varför använder vi `directionX` och `directionY` istället för `velocityX` och `velocityY`?
6. Hur tar vi bort ett objekt från `gameObjects`-arrayen när spelaren plockar upp det?
7. Varför ritar vi spelaren sist i `draw()`-metoden?
8. Vad händer om spelaren rör sig väldigt snabbt mot ett tunt objekt? (tunneling)

## Sammanfattning

I den här guiden har vi lärt oss:
- Hur AABB-kollisionsdetektering fungerar
- Var kollisionskontroll ska ske (i `Game`)
- Hur vi stoppar spelaren vid kollision
- Hur vi skapar samlingsobjekt och mål
- Grundläggande begränsningar med AABB

Med dessa kunskaper kan du nu skapa interaktiva spel med hinder, samlingsobjekt, och mål!

## Nästa steg

- Implementera olika typer av objekt (fiender, power-ups, etc.)
- Lägg till ljudeffekter vid kollision
- Skapa flera nivåer med olika layouter
- Experimentera med cirkel-kollision för rundare objekt
