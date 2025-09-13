# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development Tasks
- `npm run dev` - Start development server (runs on http://localhost:5173/)
- `npm run build` - Build for production (creates `dist` folder)
- `npm run preview` - Preview production build locally
- `npm install` - Install dependencies (only needed after cloning or package.json changes)

### Key Controls for Testing
- Arrow keys: Move player in playground
- Space: Confirm actions in battle system
- D: Toggle debug mode (enabled by default in kaplayCtx.js)

## Architecture Overview

### Game Framework & Structure
This is a turn-based RPG built with **Kaplay** (v4000 alpha) using a **Vite** build system. The game follows a modular architecture with clear separation of concerns:

- **Scenes**: Two main scenes - "playground" (exploration) and "gameover"
- **Entity-Component System**: Uses Kaplay's component system for game objects
- **State Management**: Custom state managers for game and player data
- **Turn-based Battle System**: Complex state machine handling battle phases

### Core Architecture Patterns

#### State Management Pattern
The codebase uses singleton state managers that provide immutable access to game state:
- `gameStateManager` - Global game state (battle status, inventory)
- `playerStatsManager` - Player stats with controlled mutation methods
- Both follow the pattern: `current()` returns immutable copy, specific setters for mutations

#### Battle System State Machine
The battle system (`src/systems/battleSystem.js`) is the core complexity, implementing a comprehensive state machine with states:
- `battle-start` → `enemy-appearance` → `player-turn` → action states → `enemy-turn` → loop
- Each state handles specific battle phases with async transitions
- AI logic for enemy item usage and decision making

#### Entity Factory Pattern
Entities are created through factory functions:
- `makePlayer()` - Creates player with movement controls and stats integration
- `makeEnemy()` - Creates enemies with battle-specific methods (shake, dropDown animations)
- Both integrate with the component system and state managers

### Directory Structure & Key Files

#### Core System Files
- `src/kaplayCtx.js` - Kaplay instance configuration, sprite/shader loading, input bindings
- `src/main.js` - Scene definitions and game initialization
- `src/constant.js` - Mathematical constants (diagonal movement factor)

#### Entity System
- `src/entities/player.js` - Player factory with movement system
- `src/entities/enemy.js` - Enemy factory with battle animation methods

#### State Management
- `src/state/gameStateManager.js` - Global game state with inventory system
- `src/state/playerStatsManager.js` - Player progression and status effects

#### Battle System (Most Complex)
- `src/systems/battleSystem.js` - Turn-based battle state machine (300+ lines)
- `src/systems/effects.js` - Combat effects and calculations
- `src/ui/` - Battle UI components (actionMenu, battlefield, textBox, etc.)

#### Asset Organization
- `public/enemies/` - Enemy sprite assets
- `public/shaders/` - Fragment shaders for enemy background effects
- Shaders loaded via `loadShaderURL` in kaplayCtx.js

### Key Technical Details

#### Kaplay Configuration
- Resolution: 1920x1080 with letterboxing
- Debug mode enabled by default
- Custom button mappings for arrow keys and space
- Global mode disabled (uses explicit k. prefix)

#### Item System Architecture
Items have a sophisticated effect system with properties:
- `target` (self/enemy), `effect` (heal/harm/buff/debuff/illness/cure/analyze)
- Complex branching logic in battle system for item effects
- Both player inventory and enemy items use the same structure

#### Movement System
- WASD/Arrow key movement with diagonal speed normalization
- Movement disabled during battle via `gameStateManager.isInBattle`
- Uses `DIAGONAL_FACTOR` (1/√2) for consistent diagonal movement speed

#### Visual Effects
- Custom fragment shaders for enemy backgrounds (`ringPattern`, `spiralPattern`, `trianglePattern`)
- Tween-based animations for battle feedback (shake, dropDown)
- Shader uniforms updated with time and color parameters

## Development Notes

### Working with the Battle System
The battle system is the most complex part - when modifying, understand that it's a strict state machine where each state has specific entry/update handlers. The enemy AI logic runs during `enemy-turn` and prioritizes healing/curing over attacking.

### Adding New Enemies
1. Add sprite to `public/enemies/`
2. Load in `kaplayCtx.js` with `k.loadSprite()`
3. Create via `makeEnemy()` in main.js with stats and items array
4. Consider adding custom shaders for visual variety

### Asset Management
All assets are in `public/` and referenced by absolute paths from root. Vite handles asset bundling automatically during build.

### State Persistence
Currently no save system - all state resets on page refresh. Player stats persist only within a session through the singleton state managers.
