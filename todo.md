# Twin-Stick Shooter - Implementation TODO

## Overview

Create a third game type (twin-stick shooter) that demonstrates GameBase flexibility. Branches from `14-audio` where all basic systems are complete.

**Branch:** `17-twinstick` (from `14-audio`)

## Design Decisions Needed

### 1. Input Scheme
- [ ] **Option A:** WASD movement + Mouse aim/shoot (most common twin-stick)
- [ ] **Option B:** Arrow keys movement + WASD aim/shoot (dual keyboard, no mouse)
- [ ] **Option C:** Gamepad support (left stick move, right stick aim)

**Recommendation:** Start with Option A (WASD + Mouse) - most intuitive for students

### 2. Camera Behavior
- [ ] **Fixed arena view** - Camera doesn't move, see entire arena
- [ ] **Follow player** - Camera follows player in larger arena
- [ ] **Zoom out on danger** - Dynamic camera based on enemy proximity

**Recommendation:** Fixed arena view for simplicity (like classic twin-stick games)

### 3. Visual Style
- [ ] **Top-down sprites** - Find/create top-down character sprites
- [ ] **Rotated sprites** - Rotate existing side-view sprites (easier, might look odd)
- [ ] **Simple shapes** - Circles/triangles initially, sprites later

**Recommendation:** Simple shapes initially, then upgrade to sprites

### 4. Enemy Types
- [ ] **Melee rushers** - Run straight at player
- [ ] **Ranged shooters** - Keep distance, shoot projectiles
- [ ] **Tank enemies** - Slow, high health
- [ ] **Fast dodgers** - Quick, low health, erratic movement

**Recommendation:** Start with melee rushers, add variety later

### 5. Win/Progression System
- [ ] **Wave-based survival** - Survive X waves to win
- [ ] **Endless high-score** - Survive as long as possible
- [ ] **Arena progression** - Clear arena, move to next

**Recommendation:** Wave-based survival (fits educational progression)

### 6. Arena Design
- [ ] **Single enclosed arena** - Walls on all sides
- [ ] **Wraparound arena** - Enemies/player wrap at edges
- [ ] **Multi-room** - Different connected areas

**Recommendation:** Single enclosed arena with walls

---

## Implementation Checklist

### Phase 1: Core Systems

#### InputHandler Enhancement
- [ ] Add mouse position tracking
  - Track `mouseX`, `mouseY` relative to canvas
  - Track `mouseDown` state (left click)
  - Optional: Track `rightMouseDown` for secondary weapon
- [ ] Add mouse event listeners
  - `mousemove` - Update mouse position
  - `mousedown` - Track mouse button state
  - `mouseup` - Release mouse button
- [ ] Add mouse utility methods
  - `getMouseX()` - Returns mouse X in world coordinates
  - `getMouseY()` - Returns mouse Y in world coordinates
  - `isMouseDown()` - Check if mouse button pressed

**Code Example:**
```javascript
// InputHandler.js additions
constructor(game) {
    // ... existing code ...
    
    this.mouseX = 0
    this.mouseY = 0
    this.mouseDown = false
    
    const canvas = document.querySelector('#game')
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect()
        this.mouseX = e.clientX - rect.left
        this.mouseY = e.clientY - rect.top
    })
    
    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left click
            this.mouseDown = true
        }
    })
    
    canvas.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            this.mouseDown = false
        }
    })
}
```

#### TwinStickGame Class
- [ ] Create `src/twinstick/TwinStickGame.js` extending GameBase
- [ ] Set up arena dimensions (e.g., 800x600 fixed size)
- [ ] Initialize camera (fixed at 0,0)
- [ ] Create arena walls/boundaries
- [ ] Set up wave system properties
  - Current wave number
  - Enemies per wave
  - Wave spawn timer

**Constructor Setup:**
```javascript
export default class TwinStickGame extends GameBase {
    constructor(width, height) {
        super(width, height)
        
        // Arena is fixed size (no scrolling)
        this.worldWidth = width
        this.worldHeight = height
        
        // Camera stays fixed
        this.camera.x = 0
        this.camera.y = 0
        
        // Wave system
        this.currentWave = 1
        this.maxWaves = 10
        this.enemiesPerWave = 5
        this.waveSpawnTimer = 0
        this.waveDelay = 3000 // 3 seconds between waves
        
        // Arena boundaries
        this.walls = []
        
        this.init()
    }
}
```

---

### Phase 2: Player Character

#### TopDownPlayer Class
- [ ] Create `src/twinstick/TopDownPlayer.js` extending GameObject
- [ ] Implement 8-directional movement (WASD)
  - No gravity - free movement
  - Normalize diagonal movement (prevent faster diagonal)
  - Add friction/deceleration for smooth feel
- [ ] Implement mouse-aimed rotation
  - Calculate angle to mouse: `Math.atan2(mouseY - playerY, mouseX - playerX)`
  - Store rotation angle for rendering
- [ ] Implement shooting towards mouse
  - Create projectiles in direction of mouse
  - Shoot cooldown system
  - Automatic fire when mouse held (optional)
- [ ] Add health system
  - Reuse from platformer Player (maxHealth, health, invulnerability)
- [ ] Render player
  - Simple: Circle with line showing direction
  - Advanced: Sprite rotated to face mouse

**Movement Logic:**
```javascript
update(deltaTime) {
    // Get input direction
    let dirX = 0
    let dirY = 0
    
    if (this.game.inputHandler.keys.has('w')) dirY = -1
    if (this.game.inputHandler.keys.has('s')) dirY = 1
    if (this.game.inputHandler.keys.has('a')) dirX = -1
    if (this.game.inputHandler.keys.has('d')) dirX = 1
    
    // Normalize diagonal movement
    if (dirX !== 0 && dirY !== 0) {
        dirX *= 0.707 // 1/√2
        dirY *= 0.707
    }
    
    // Apply movement
    this.velocityX = dirX * this.moveSpeed
    this.velocityY = dirY * this.moveSpeed
    
    // Update position
    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime
    
    // Calculate rotation towards mouse
    const mouseX = this.game.inputHandler.mouseX
    const mouseY = this.game.inputHandler.mouseY
    this.rotation = Math.atan2(mouseY - this.y, mouseX - this.x)
    
    // Shooting
    if (this.game.inputHandler.mouseDown && this.canShoot) {
        this.shoot()
    }
}
```

---

### Phase 3: Enemies

#### TopDownEnemy Class
- [ ] Create `src/twinstick/TopDownEnemy.js` extending GameObject
- [ ] Implement movement AI
  - Chase player (move towards player position)
  - Optional: Add wandering when far from player
  - Optional: Add avoidance of other enemies
- [ ] Add collision with walls
  - Stop at arena boundaries
  - Optional: Bounce off walls
- [ ] Add damage on contact with player
- [ ] Add health system (take damage from player projectiles)
- [ ] Visual feedback
  - Flash when hit
  - Death animation/particle effect
  - Show direction facing

**Chase AI:**
```javascript
update(deltaTime) {
    // Calculate direction to player
    const dx = this.game.player.x - this.x
    const dy = this.game.player.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Normalize and apply speed
    if (distance > 0) {
        this.velocityX = (dx / distance) * this.speed
        this.velocityY = (dy / distance) * this.speed
    }
    
    // Update position
    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime
    
    // Check collision with player
    if (this.intersects(this.game.player)) {
        this.game.player.takeDamage(this.damage)
    }
}
```

#### Enemy Spawner System
- [ ] Create `src/twinstick/EnemySpawner.js` (similar to space shooter spawner)
- [ ] Spawn enemies from arena edges
  - Randomly choose edge (top, bottom, left, right)
  - Random position along chosen edge
  - Ensure not too close to player
- [ ] Wave progression
  - Increase enemies per wave
  - Decrease spawn delay
  - Optional: Introduce new enemy types per wave

---

### Phase 4: Projectiles & Combat

#### TopDownProjectile Class
- [ ] Create `src/twinstick/TopDownProjectile.js` extending GameObject
- [ ] Travel in straight line (angle-based velocity)
- [ ] Lifetime/range limit (despawn after distance or time)
- [ ] Collision with enemies
  - Damage enemy
  - Mark projectile for deletion
- [ ] Visual: Simple bullet or small sprite

**Projectile Creation:**
```javascript
// In TopDownPlayer.shoot()
shoot() {
    const angle = this.rotation
    const speed = 0.8
    
    // Spawn projectile at player position
    const projectile = new TopDownProjectile(
        this.game,
        this.x + this.width / 2,
        this.y + this.height / 2,
        angle,
        speed
    )
    
    this.game.projectiles.push(projectile)
    this.canShoot = false
    this.shootCooldownTimer = this.shootCooldown
}
```

---

### Phase 5: Arena & Boundaries

#### Wall/Boundary System
- [ ] Create `src/twinstick/Wall.js` extending GameObject
- [ ] Create arena boundaries
  - Four walls (top, bottom, left, right)
  - Optional: Additional obstacles in arena
- [ ] Implement collision
  - Player stops at walls
  - Enemies stop at walls (or bounce)
  - Projectiles destroy on wall hit (or bounce)

**Create Walls:**
```javascript
// In TwinStickGame.init()
createArena() {
    const wallThickness = 20
    
    this.walls = [
        // Top wall
        new Wall(this, 0, 0, this.width, wallThickness),
        // Bottom wall
        new Wall(this, 0, this.height - wallThickness, this.width, wallThickness),
        // Left wall
        new Wall(this, 0, 0, wallThickness, this.height),
        // Right wall
        new Wall(this, this.width - wallThickness, 0, wallThickness, this.height)
    ]
}
```

---

### Phase 6: Wave System

#### Wave Manager
- [ ] Track current wave number
- [ ] Spawn enemies in waves
  - All enemies for wave spawn over time (not instantly)
  - Wait until all enemies defeated before next wave
- [ ] Wave progression
  - More enemies each wave
  - Optional: Different enemy compositions
  - Optional: Boss every N waves
- [ ] UI display
  - "Wave X / Y"
  - "Next wave in: X seconds"
  - "Enemies remaining: X"

**Wave Logic:**
```javascript
// In TwinStickGame.update()
updateWaveSystem(deltaTime) {
    // Check if wave is complete
    if (this.enemies.length === 0 && !this.spawningWave) {
        this.waveSpawnTimer += deltaTime
        
        if (this.waveSpawnTimer >= this.waveDelay) {
            this.startNextWave()
            this.waveSpawnTimer = 0
        }
    }
}

startNextWave() {
    this.currentWave++
    
    if (this.currentWave > this.maxWaves) {
        this.gameState = 'WIN'
        return
    }
    
    // Spawn enemies for this wave
    const enemyCount = this.enemiesPerWave + (this.currentWave - 1) * 2
    this.spawner.spawnWave(enemyCount)
}
```

---

### Phase 7: UI & Polish

#### UserInterface Updates
- [ ] Display wave information
  - Current wave / total waves
  - Enemies remaining
  - Time until next wave
- [ ] Display player stats
  - Health bar
  - Score
  - Optional: Ammo counter, weapon info
- [ ] Add crosshair at mouse position
  - Visual feedback for aiming

#### Visual Polish
- [ ] Particle effects
  - Enemy death particles
  - Muzzle flash when shooting
  - Hit impact effects
- [ ] Screen shake on damage
- [ ] Health bar above enemies
- [ ] Mini-map (optional, advanced)

#### Audio
- [ ] Shooting sound
- [ ] Enemy hit/death sounds
- [ ] Wave complete sound
- [ ] Background music (tense, action)
- [ ] Low health warning sound

---

### Phase 8: Menus & Integration

#### Menu System
- [ ] Update MainMenu to include Twin-Stick option
- [ ] Create TwinStickGameOverMenu (reuse pattern from other games)
- [ ] Add controls screen for twin-stick
  - WASD - Movement
  - Mouse - Aim
  - Left Click - Shoot
  - ESC - Pause

#### Main.js Integration
- [ ] Switch game type selection (platformer / space shooter / twin-stick)
- [ ] Or: Separate entry points (platformer.html, twinstick.html, etc.)

---

## File Structure

```
src/
  twinstick/
    TwinStickGame.js      # Main game class (extends GameBase)
    TopDownPlayer.js      # Player with 8-dir movement + mouse aim
    TopDownEnemy.js       # Enemy that chases player
    TopDownProjectile.js  # Bullet/projectile
    EnemySpawner.js       # Spawns enemies from arena edges
    Wall.js               # Arena boundaries and obstacles
  assets/
    twinstick/
      player.png          # (optional) Top-down player sprite
      enemy.png           # (optional) Top-down enemy sprite
      sounds/
        shoot.mp3
        hit.mp3
        death.mp3
```

---

## Educational Value

### New Concepts in Twin-Stick (vs Platformer/Space Shooter)

1. **Mouse Input** - Tracking and using mouse position
2. **Angle Calculations** - `Math.atan2()` for rotation and aiming
3. **8-Directional Movement** - Vector normalization
4. **Top-Down Perspective** - Different spatial thinking
5. **Wave-Based Gameplay** - Event-driven progression
6. **Free Movement Physics** - No gravity, full 2D movement

### Demonstrates GameBase Reusability

- ✅ Same InputHandler (extended with mouse)
- ✅ Same Camera system (used differently)
- ✅ Same UserInterface system
- ✅ Same GameObject hierarchy
- ✅ Same game states and menu system
- ✅ Same audio system

**Shows students:** "Three completely different games, same foundation!"

---

## Testing Checklist

- [ ] Player moves smoothly in all 8 directions
- [ ] Diagonal movement isn't faster than cardinal
- [ ] Player rotation follows mouse accurately
- [ ] Shooting creates projectiles in correct direction
- [ ] Enemies spawn from arena edges
- [ ] Enemies chase player correctly
- [ ] Collision detection works (player-enemy, projectile-enemy, player-wall)
- [ ] Waves progress correctly
- [ ] UI displays correct information
- [ ] Game over when player health reaches 0
- [ ] Win condition when all waves complete
- [ ] Menu navigation works
- [ ] Sounds play at appropriate times

---

## Future Enhancements (Optional)

- [ ] Power-ups (health, speed boost, rapid fire, shield)
- [ ] Multiple weapon types (spread shot, laser, missiles)
- [ ] Enemy variety (ranged enemies, bosses)
- [ ] Procedural arena generation
- [ ] Co-op multiplayer (local)
- [ ] Particle system for effects
- [ ] Screenshake and juice
- [ ] High score system (reuse from step 16)
- [ ] Upgrades between waves (shop system)

---

## Documentation (17-twinstick.md)

- [ ] Write explanation of twin-stick genre
- [ ] Explain mouse input system
- [ ] Explain angle calculations and rotation
- [ ] Explain wave-based progression
- [ ] Show how it reuses GameBase
- [ ] Include exercises for students
  - Add new enemy type
  - Create power-up system
  - Design custom arena layout
