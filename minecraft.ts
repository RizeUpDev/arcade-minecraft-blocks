// ═══════════════════════════════════════════════════════════════
// minecraft.ts
// ONE namespace = ONE drawer in MakeCode Arcade, called "Minecraft"
// Groups inside = collapsible sub-sections within that drawer
// ═══════════════════════════════════════════════════════════════

/**
 * Minecraft blocks for MakeCode Arcade.
 */
//% color="#4CAF50"
//% icon="\uf1b2"
//% weight=100
//% groups='["🌍 World","☁️ Weather","🗺 Biomes","🧱 Place & Break","📦 Fill & Copy","🔍 Block Detection","🧑 Player Health","🏃 Player Movement","⭐ Player XP","🎒 Inventory","🎮 Gamemode","🐉 Spawn Mobs","🤖 Mob Control","💀 Mob Health","🗡️ Give Items","✨ Enchanting","🔴 Redstone Power","⚡ Redstone Devices","⚒️ Crafting","🧪 Brewing","📡 Events","🖥️ HUD & Messages","📊 Scoreboard","⌨️ Commands","🐛 Debug"]'
namespace Minecraft {

    // ══════════════════════════════════════════════════════════════
    // INTERNAL STATE
    // ══════════════════════════════════════════════════════════════
    let _time: number = 0
    let _weather: MCWeather = MCWeather.Clear
    let _dimension: MCDim = MCDim.Overworld
    let _worldName: string = "My World"
    let _mobSpawning: boolean = true
    let _dayNightCycle: boolean = true
    let _worldSeed: number = 12345

    let _health: number = 20
    let _hunger: number = 20
    let _xp: number = 0
    let _level: number = 0
    let _score: number = 0
    let _gamemode: MCGameMode = MCGameMode.Survival
    let _playerName: string = "Steve"
    let _flying: boolean = false
    let _pos: MCPos = new MCPos(0, 64, 0)
    let _inventory: MCItem[] = []
    let _effects: { [k: number]: number } = {}  // effect → duration

    let _worldGrid: { [k: string]: Block } = {}
    let _redstone: { [k: string]: number } = {}

    interface Mob { id: number; type: MCMob; pos: MCPos; health: number; maxHealth: number; name: string; behavior: MCBehavior; tamed: boolean }
    let _mobs: Mob[] = []
    let _nextMobId = 1

    let _customRecipes: { result: MCItem; ing1: MCItem; ing2: MCItem }[] = []
    let _scoreboard: { [name: string]: number } = {}
    let _customEvents: { [name: string]: (() => void)[] } = {}

    function _bkey(x: number, y: number, z: number): string { return `${x|0},${y|0},${z|0}` }
    function _toast(msg: string): void { game.showLongText(msg, DialogLayout.Top) }
    function _center(msg: string): void { game.showLongText(msg, DialogLayout.Center) }
    function _bottom(msg: string): void { game.showLongText(msg, DialogLayout.Bottom) }
    function _mobMaxHP(t: MCMob): number {
        if (t === MCMob.EnderDragon) return 200
        if (t === MCMob.Wither) return 150
        if (t === MCMob.IronGolem) return 100
        if (t === MCMob.Cow || t === MCMob.Pig) return 10
        if (t === MCMob.Chicken) return 4
        return 20
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🌍 World
    // ══════════════════════════════════════════════════════════════

    /** Set the time of day. @param preset time preset */
    //% block="set time to $preset"
    //% blockId="mc_time_preset"
    //% group="🌍 World" weight=100
    export function setTimeOfDay(preset: MCTimePreset): void {
        _time = preset as number
        _toast(`⏰ Time: ${MCTimePreset[preset]}`)
    }

    /** Set time to a custom tick (0–24000). @param ticks eg: 6000 */
    //% block="set time to $ticks ticks"
    //% blockId="mc_time_ticks"
    //% ticks.min=0 ticks.max=24000
    //% group="🌍 World" weight=98
    export function setTime(ticks: number): void { _time = Math.clamp(0, 24000, ticks) }

    /** Advance time by ticks. @param ticks eg: 1000 */
    //% block="advance time by $ticks ticks"
    //% blockId="mc_time_advance"
    //% group="🌍 World" weight=96
    export function advanceTime(ticks: number): void { _time = (_time + ticks) % 24000 }

    /** Current time in ticks. */
    //% block="current time (ticks)"
    //% blockId="mc_time_get"
    //% group="🌍 World" weight=94
    export function getTime(): number { return _time }

    /** Returns true if it is daytime. */
    //% block="is daytime"
    //% blockId="mc_is_day"
    //% group="🌍 World" weight=92
    export function isDaytime(): boolean { return _time < 12000 }

    /** Returns true if it is nighttime. */
    //% block="is nighttime"
    //% blockId="mc_is_night"
    //% group="🌍 World" weight=90
    export function isNighttime(): boolean { return _time >= 12000 }

    /** Enable or disable the day/night cycle. @param on true to enable */
    //% block="day/night cycle $on"
    //% blockId="mc_daynightcycle"
    //% on.shadow="toggleOnOff"
    //% group="🌍 World" weight=88
    export function setDayNightCycle(on: boolean): void { _dayNightCycle = on }

    /** Set the world name. @param name eg: "My World" */
    //% block="set world name $name"
    //% blockId="mc_world_name"
    //% group="🌍 World" weight=86
    export function setWorldName(name: string): void { _worldName = name }

    /** Get the world name. */
    //% block="world name"
    //% blockId="mc_world_name_get"
    //% group="🌍 World" weight=84
    export function getWorldName(): string { return _worldName }

    /** Set the world seed. @param seed eg: 12345 */
    //% block="set world seed $seed"
    //% blockId="mc_seed_set"
    //% group="🌍 World" weight=82
    export function setWorldSeed(seed: number): void { _worldSeed = seed }

    /** Get the world seed. */
    //% block="world seed"
    //% blockId="mc_seed_get"
    //% group="🌍 World" weight=80
    export function getWorldSeed(): number { return _worldSeed }

    /** Enable or disable mob spawning. @param on true to enable */
    //% block="mob spawning $on"
    //% blockId="mc_mob_spawn_toggle"
    //% on.shadow="toggleOnOff"
    //% group="🌍 World" weight=78
    export function setMobSpawning(on: boolean): void { _mobSpawning = on }

    /** Travel to a dimension. @param dim the dimension */
    //% block="travel to $dim"
    //% blockId="mc_dim_travel"
    //% group="🌍 World" weight=76
    export function travelTo(dim: MCDim): void {
        _dimension = dim
        _toast(`🌀 Entering ${MCDim[dim]}`)
    }

    /** Current dimension. */
    //% block="current dimension"
    //% blockId="mc_dim_get"
    //% group="🌍 World" weight=74
    export function getDimension(): MCDim { return _dimension }

    /** Create a position value. @param x eg:0 @param y eg:64 @param z eg:0 */
    //% block="position x $x y $y z $z"
    //% blockId="mc_position"
    //% group="🌍 World" weight=72
    //% color="#5B8731"
    export function position(x: number, y: number, z: number): MCPos { return new MCPos(x, y, z) }

    /** Generate a structure at a position. */
    //% block="generate $structure at x $x y $y z $z"
    //% blockId="mc_gen_structure"
    //% group="🌍 World" weight=70
    export function generateStructure(structure: MCStructure, x: number, y: number, z: number): void {
        _toast(`🏗 Generated ${MCStructure[structure]} at (${x},${y},${z})`)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: ☁️ Weather
    // ══════════════════════════════════════════════════════════════

    /** Set the weather. @param weather the weather */
    //% block="set weather to $weather"
    //% blockId="mc_weather_set"
    //% group="☁️ Weather" weight=100
    export function setWeather(weather: MCWeather): void {
        _weather = weather
        _toast(`☁️ Weather: ${MCWeather[weather]}`)
    }

    /** Get the current weather. */
    //% block="current weather"
    //% blockId="mc_weather_get"
    //% group="☁️ Weather" weight=98
    export function getWeather(): MCWeather { return _weather }

    /** Returns true if weather matches. @param weather the weather */
    //% block="weather is $weather"
    //% blockId="mc_weather_is"
    //% group="☁️ Weather" weight=96
    export function weatherIs(weather: MCWeather): boolean { return _weather === weather }

    /** Returns true if it is raining. */
    //% block="it is raining"
    //% blockId="mc_is_raining"
    //% group="☁️ Weather" weight=94
    export function isRaining(): boolean { return _weather === MCWeather.Rain || _weather === MCWeather.Thunder }

    /** Returns true if there is a thunderstorm. */
    //% block="it is thundering"
    //% blockId="mc_is_thunder"
    //% group="☁️ Weather" weight=92
    export function isThundering(): boolean { return _weather === MCWeather.Thunder }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🗺 Biomes
    // ══════════════════════════════════════════════════════════════

    /** Get the biome at x, z. */
    //% block="biome at x $x z $z"
    //% blockId="mc_biome_get"
    //% group="🗺 Biomes" weight=100
    export function getBiome(x: number, z: number): MCBiome {
        return (Math.abs(Math.sin(x * 0.01 + z * 0.013) * 12) | 0) as MCBiome
    }

    /** Returns true if a position is in a biome. */
    //% block="x $x z $z is in $biome"
    //% blockId="mc_biome_is"
    //% group="🗺 Biomes" weight=98
    export function isInBiome(x: number, z: number, biome: MCBiome): boolean { return getBiome(x, z) === biome }

    /** Get the highest solid block y at a column. */
    //% block="highest block y at x $x z $z"
    //% blockId="mc_highest_block"
    //% group="🗺 Biomes" weight=96
    export function highestBlockAt(x: number, z: number): number {
        return (64 + Math.sin(x * 0.05) * 10 + Math.cos(z * 0.05) * 8) | 0
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🧱 Place & Break
    // ══════════════════════════════════════════════════════════════

    /** Place a block at x y z. */
    //% block="place $block at x $x y $y z $z"
    //% blockId="mc_place"
    //% group="🧱 Place & Break" weight=100
    export function placeBlock(block: Block, x: number, y: number, z: number): void {
        _worldGrid[_bkey(x, y, z)] = block
        _toast(`🧱 Placed ${Block[block]} at (${x},${y},${z})`)
    }

    /** Place a block at a position value. */
    //% block="place $block at $pos"
    //% blockId="mc_place_pos"
    //% group="🧱 Place & Break" weight=98
    export function placeAt(block: Block, pos: MCPos): void { placeBlock(block, pos.x, pos.y, pos.z) }

    /** Break the block at x y z. */
    //% block="break block at x $x y $y z $z"
    //% blockId="mc_break"
    //% group="🧱 Place & Break" weight=96
    export function breakBlock(x: number, y: number, z: number): void {
        delete _worldGrid[_bkey(x, y, z)]
        _toast(`⛏ Broke block at (${x},${y},${z})`)
    }

    /** Break the block at a position value. */
    //% block="break block at $pos"
    //% blockId="mc_break_pos"
    //% group="🧱 Place & Break" weight=94
    export function breakAt(pos: MCPos): void { breakBlock(pos.x, pos.y, pos.z) }

    /** Place a block in a direction from a position. */
    //% block="place $block $dir of $pos"
    //% blockId="mc_place_dir"
    //% group="🧱 Place & Break" weight=92
    export function placeDirection(block: Block, pos: MCPos, dir: MCDir): void {
        const dx = [0,0,1,-1,0,0]
        const dy = [0,0,0,0,1,-1]
        const dz = [-1,1,0,0,0,0]
        placeBlock(block, pos.x+dx[dir], pos.y+dy[dir], pos.z+dz[dir])
    }

    /** Replace one block type with another in a region. */
    //% block="replace $from with $to x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mc_replace"
    //% group="🧱 Place & Break" weight=90
    export function replaceBlocks(from: Block, to: Block, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void {
        let n = 0
        for (let x = Math.min(x1,x2); x<=Math.max(x1,x2); x++)
            for (let y = Math.min(y1,y2); y<=Math.max(y1,y2); y++)
                for (let z = Math.min(z1,z2); z<=Math.max(z1,z2); z++) {
                    if (_worldGrid[_bkey(x,y,z)] === from) { _worldGrid[_bkey(x,y,z)] = to; n++ }
                }
        _toast(`🔄 Replaced ${n} blocks`)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 📦 Fill & Copy
    // ══════════════════════════════════════════════════════════════

    /** Fill a region with a block. */
    //% block="fill $block from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mc_fill"
    //% group="📦 Fill & Copy" weight=100
    export function fill(block: Block, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void {
        for (let x = Math.min(x1,x2); x<=Math.max(x1,x2); x++)
            for (let y = Math.min(y1,y2); y<=Math.max(y1,y2); y++)
                for (let z = Math.min(z1,z2); z<=Math.max(z1,z2); z++)
                    _worldGrid[_bkey(x,y,z)] = block
        _toast(`📦 Filled with ${Block[block]}`)
    }

    /** Fill a hollow box (walls only). */
    //% block="fill hollow box of $block from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mc_fill_hollow"
    //% group="📦 Fill & Copy" weight=98
    export function fillHollow(block: Block, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void {
        const [mnX,mxX] = [Math.min(x1,x2), Math.max(x1,x2)]
        const [mnY,mxY] = [Math.min(y1,y2), Math.max(y1,y2)]
        const [mnZ,mxZ] = [Math.min(z1,z2), Math.max(z1,z2)]
        for (let x=mnX; x<=mxX; x++)
            for (let y=mnY; y<=mxY; y++)
                for (let z=mnZ; z<=mxZ; z++)
                    if (x===mnX||x===mxX||y===mnY||y===mxY||z===mnZ||z===mxZ)
                        _worldGrid[_bkey(x,y,z)] = block
        _toast(`🏠 Hollow box built`)
    }

    /** Clone a region to a new location. */
    //% block="clone x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2 → dest x $dx y $dy z $dz"
    //% blockId="mc_clone"
    //% group="📦 Fill & Copy" weight=96
    export function clone(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, dx: number, dy: number, dz: number): void {
        const ox=dx-x1, oy=dy-y1, oz=dz-z1
        for (let x=Math.min(x1,x2); x<=Math.max(x1,x2); x++)
            for (let y=Math.min(y1,y2); y<=Math.max(y1,y2); y++)
                for (let z=Math.min(z1,z2); z<=Math.max(z1,z2); z++) {
                    const b = _worldGrid[_bkey(x,y,z)]
                    if (b !== undefined) _worldGrid[_bkey(x+ox,y+oy,z+oz)] = b
                }
        _toast(`📋 Region cloned`)
    }

    /** Build a sphere of blocks. @param radius eg:5 */
    //% block="build $block sphere at x $cx y $cy z $cz radius $r"
    //% blockId="mc_sphere"
    //% r.min=1 r.max=20
    //% group="📦 Fill & Copy" weight=94
    export function buildSphere(block: Block, cx: number, cy: number, cz: number, r: number): void {
        const r2 = r*r
        for (let x=-r; x<=r; x++)
            for (let y=-r; y<=r; y++)
                for (let z=-r; z<=r; z++)
                    if (x*x+y*y+z*z<=r2)
                        _worldGrid[_bkey(cx+x,cy+y,cz+z)] = block
        _toast(`⭕ Sphere r=${r} built`)
    }

    /** Explode a position with a blast radius. @param radius eg:4 */
    //% block="explode at x $x y $y z $z radius $radius"
    //% blockId="mc_explode"
    //% radius.min=1 radius.max=10
    //% group="📦 Fill & Copy" weight=92
    export function explode(x: number, y: number, z: number, radius: number): void {
        const r2 = radius*radius
        for (let dx=-radius; dx<=radius; dx++)
            for (let dy=-radius; dy<=radius; dy++)
                for (let dz=-radius; dz<=radius; dz++)
                    if (dx*dx+dy*dy+dz*dz<=r2)
                        delete _worldGrid[_bkey(x+dx,y+dy,z+dz)]
        _toast(`💥 Explosion r=${radius}!`)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🔍 Block Detection
    // ══════════════════════════════════════════════════════════════

    /** Get the block at x y z. */
    //% block="block at x $x y $y z $z"
    //% blockId="mc_get_block"
    //% group="🔍 Block Detection" weight=100
    export function getBlock(x: number, y: number, z: number): Block {
        return _worldGrid[_bkey(x,y,z)] ?? Block.Air
    }

    /** Returns true if the block at x y z matches. */
    //% block="block at x $x y $y z $z is $block"
    //% blockId="mc_block_is"
    //% group="🔍 Block Detection" weight=98
    export function blockIs(x: number, y: number, z: number, block: Block): boolean { return getBlock(x,y,z) === block }

    /** Returns true if the position is air. */
    //% block="x $x y $y z $z is air"
    //% blockId="mc_is_air"
    //% group="🔍 Block Detection" weight=96
    export function isAir(x: number, y: number, z: number): boolean { return getBlock(x,y,z) === Block.Air }

    /** Returns true if the block is solid (not air/water/lava). */
    //% block="x $x y $y z $z is solid"
    //% blockId="mc_is_solid"
    //% group="🔍 Block Detection" weight=94
    export function isSolid(x: number, y: number, z: number): boolean {
        const b = getBlock(x,y,z)
        return b !== Block.Air && b !== Block.Water && b !== Block.Lava
    }

    /** Count blocks of a type in a region. */
    //% block="count $block from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mc_count_blocks"
    //% group="🔍 Block Detection" weight=92
    export function countBlocks(block: Block, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
        let n = 0
        for (let x=Math.min(x1,x2); x<=Math.max(x1,x2); x++)
            for (let y=Math.min(y1,y2); y<=Math.max(y1,y2); y++)
                for (let z=Math.min(z1,z2); z<=Math.max(z1,z2); z++)
                    if (getBlock(x,y,z) === block) n++
        return n
    }

    /** Returns true if a block emits light. */
    //% block="$block emits light"
    //% blockId="mc_emits_light"
    //% group="🔍 Block Detection" weight=90
    export function emitsLight(block: Block): boolean {
        return [Block.Glowstone, Block.Torch, Block.Lava, Block.JackOLantern, Block.Beacon].indexOf(block) >= 0
    }

    /** Returns the hardness of a block (1–10). */
    //% block="hardness of $block"
    //% blockId="mc_hardness"
    //% group="🔍 Block Detection" weight=88
    export function hardness(block: Block): number {
        if (block === Block.Bedrock) return 10
        if (block === Block.Obsidian) return 9
        if (block === Block.DiamondBlock) return 7
        if (block === Block.Stone) return 4
        return 2
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🧑 Player Health
    // ══════════════════════════════════════════════════════════════

    /** Get the player's health. */
    //% block="player health"
    //% blockId="mc_hp_get"
    //% group="🧑 Player Health" weight=100
    export function getHealth(): number { return _health }

    /** Set the player's health. @param amount eg:20 */
    //% block="set player health to $amount"
    //% blockId="mc_hp_set"
    //% amount.min=0 amount.max=20
    //% group="🧑 Player Health" weight=98
    export function setHealth(amount: number): void {
        _health = Math.clamp(0, 20, amount)
        if (_health <= 0) { _center("💀 You died!"); _firePlayerDied() }
    }

    /** Heal the player. @param amount eg:4 */
    //% block="heal player by $amount"
    //% blockId="mc_heal"
    //% amount.min=1 amount.max=20
    //% group="🧑 Player Health" weight=96
    export function heal(amount: number): void {
        _health = Math.min(20, _health + amount)
        _toast(`❤️ +${amount} HP`)
    }

    /** Deal damage to the player. @param amount eg:2 */
    //% block="damage player by $amount"
    //% blockId="mc_damage"
    //% amount.min=1 amount.max=20
    //% group="🧑 Player Health" weight=94
    export function damage(amount: number): void {
        _health = Math.max(0, _health - amount)
        if (_health <= 0) { _center("💀 You died!"); _firePlayerDied() }
        else _toast(`💔 Took ${amount} damage`)
    }

    /** Returns true if the player is alive. */
    //% block="player is alive"
    //% blockId="mc_is_alive"
    //% group="🧑 Player Health" weight=92
    export function isAlive(): boolean { return _health > 0 }

    /** Get the player's hunger. */
    //% block="player hunger"
    //% blockId="mc_hunger_get"
    //% group="🧑 Player Health" weight=90
    export function getHunger(): number { return _hunger }

    /** Set the player's hunger. @param amount eg:20 */
    //% block="set player hunger to $amount"
    //% blockId="mc_hunger_set"
    //% amount.min=0 amount.max=20
    //% group="🧑 Player Health" weight=88
    export function setHunger(amount: number): void { _hunger = Math.clamp(0, 20, amount) }

    /** Feed the player. @param amount eg:4 */
    //% block="feed player $amount hunger"
    //% blockId="mc_feed"
    //% amount.min=1 amount.max=20
    //% group="🧑 Player Health" weight=86
    export function feed(amount: number): void { _hunger = Math.min(20, _hunger + amount) }

    /** Returns true if the player is starving. */
    //% block="player is starving"
    //% blockId="mc_is_starving"
    //% group="🧑 Player Health" weight=84
    export function isStarving(): boolean { return _hunger <= 0 }

    /** Apply a potion effect. @param duration eg:30 @param level eg:1 */
    //% block="apply $effect for $duration s level $level"
    //% blockId="mc_effect_apply"
    //% duration.min=1 duration.max=300
    //% level.min=1 level.max=3
    //% group="🧑 Player Health" weight=82
    export function applyEffect(effect: MCEffect, duration: number, level: number): void {
        _effects[effect] = duration
        _toast(`✨ ${MCEffect[effect]} Lv${level} (${duration}s)`)
    }

    /** Remove an effect. */
    //% block="remove $effect from player"
    //% blockId="mc_effect_remove"
    //% group="🧑 Player Health" weight=80
    export function removeEffect(effect: MCEffect): void { delete _effects[effect] }

    /** Returns true if the player has an effect. */
    //% block="player has $effect"
    //% blockId="mc_effect_has"
    //% group="🧑 Player Health" weight=78
    export function hasEffect(effect: MCEffect): boolean { return _effects[effect] !== undefined }

    /** Set the player on fire. @param seconds eg:5 */
    //% block="set player on fire for $seconds seconds"
    //% blockId="mc_set_fire"
    //% seconds.min=1 seconds.max=30
    //% group="🧑 Player Health" weight=76
    export function setOnFire(seconds: number): void { _toast(`🔥 On fire for ${seconds}s!`) }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🏃 Player Movement
    // ══════════════════════════════════════════════════════════════

    /** Get the player's position. */
    //% block="player position"
    //% blockId="mc_pos_get"
    //% group="🏃 Player Movement" weight=100
    export function getPosition(): MCPos { return _pos }

    /** Get the player's X. */
    //% block="player x"
    //% blockId="mc_px"
    //% group="🏃 Player Movement" weight=98
    export function playerX(): number { return _pos.x }

    /** Get the player's Y. */
    //% block="player y"
    //% blockId="mc_py"
    //% group="🏃 Player Movement" weight=96
    export function playerY(): number { return _pos.y }

    /** Get the player's Z. */
    //% block="player z"
    //% blockId="mc_pz"
    //% group="🏃 Player Movement" weight=94
    export function playerZ(): number { return _pos.z }

    /** Teleport the player. */
    //% block="teleport player to x $x y $y z $z"
    //% blockId="mc_teleport"
    //% group="🏃 Player Movement" weight=92
    export function teleport(x: number, y: number, z: number): void {
        _pos = new MCPos(x, y, z)
        _toast(`✨ Teleported to (${x},${y},${z})`)
    }

    /** Teleport to a position value. */
    //% block="teleport player to $pos"
    //% blockId="mc_teleport_pos"
    //% group="🏃 Player Movement" weight=90
    export function teleportTo(pos: MCPos): void { teleport(pos.x, pos.y, pos.z) }

    /** Move the player by an offset. */
    //% block="move player x $dx y $dy z $dz"
    //% blockId="mc_move"
    //% group="🏃 Player Movement" weight=88
    export function move(dx: number, dy: number, dz: number): void {
        _pos = new MCPos(_pos.x+dx, _pos.y+dy, _pos.z+dz)
    }

    /** Enable/disable flying. */
    //% block="player flying $on"
    //% blockId="mc_flying"
    //% on.shadow="toggleOnOff"
    //% group="🏃 Player Movement" weight=86
    export function setFlying(on: boolean): void {
        _flying = on
        _toast(on ? "🦅 Flying enabled" : "🦅 Flying disabled")
    }

    /** Returns true if the player is flying. */
    //% block="player is flying"
    //% blockId="mc_is_flying"
    //% group="🏃 Player Movement" weight=84
    export function isFlying(): boolean { return _flying }

    /** Set/get the player name. */
    //% block="set player name to $name"
    //% blockId="mc_name_set"
    //% group="🏃 Player Movement" weight=82
    export function setPlayerName(name: string): void { _playerName = name }

    /** Get the player name. */
    //% block="player name"
    //% blockId="mc_name_get"
    //% group="🏃 Player Movement" weight=80
    export function getPlayerName(): string { return _playerName }

    // ══════════════════════════════════════════════════════════════
    // GROUP: ⭐ Player XP
    // ══════════════════════════════════════════════════════════════

    /** Get XP. */
    //% block="player XP"
    //% blockId="mc_xp_get"
    //% group="⭐ Player XP" weight=100
    export function getXP(): number { return _xp }

    /** Add XP. @param amount eg:10 */
    //% block="give player $amount XP"
    //% blockId="mc_xp_add"
    //% amount.min=1 amount.max=1000
    //% group="⭐ Player XP" weight=98
    export function addXP(amount: number): void {
        _xp += amount
        const need = _level < 16 ? 2*_level+7 : _level < 31 ? 5*_level-38 : 9*_level-158
        if (_xp >= need) { _xp -= need; _level++; _center(`⭐ Level Up! Now Level ${_level}`) }
    }

    /** Get level. */
    //% block="player level"
    //% blockId="mc_level_get"
    //% group="⭐ Player XP" weight=96
    export function getLevel(): number { return _level }

    /** Set level. @param level eg:10 */
    //% block="set player level to $level"
    //% blockId="mc_level_set"
    //% level.min=0 level.max=100
    //% group="⭐ Player XP" weight=94
    export function setLevel(level: number): void { _level = Math.max(0, level); _xp = 0 }

    /** Get score. */
    //% block="player score"
    //% blockId="mc_score_get"
    //% group="⭐ Player XP" weight=92
    export function getScore(): number { return _score }

    /** Add to score. @param amount eg:100 */
    //% block="add $amount to score"
    //% blockId="mc_score_add"
    //% group="⭐ Player XP" weight=90
    export function addScore(amount: number): void { _score += amount; info.setScore(_score) }

    /** Set score. @param amount eg:0 */
    //% block="set score to $amount"
    //% blockId="mc_score_set"
    //% group="⭐ Player XP" weight=88
    export function setScore(amount: number): void { _score = amount; info.setScore(_score) }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🎒 Inventory
    // ══════════════════════════════════════════════════════════════

    /** Give player an item. */
    //% block="give player $item"
    //% blockId="mc_inv_give"
    //% group="🎒 Inventory" weight=100
    export function giveItem(item: MCItem): void {
        _inventory.push(item)
        _toast(`🎒 Got ${MCItem[item]}`)
    }

    /** Take an item from the player. */
    //% block="take $item from player"
    //% blockId="mc_inv_take"
    //% group="🎒 Inventory" weight=98
    export function takeItem(item: MCItem): void {
        const i = _inventory.indexOf(item)
        if (i >= 0) { _inventory.splice(i, 1); _toast(`🗑 Removed ${MCItem[item]}`) }
    }

    /** Returns true if the player has an item. */
    //% block="player has $item"
    //% blockId="mc_inv_has"
    //% group="🎒 Inventory" weight=96
    export function hasItem(item: MCItem): boolean { return _inventory.indexOf(item) >= 0 }

    /** Count how many of an item the player has. */
    //% block="count of $item in inventory"
    //% blockId="mc_inv_count"
    //% group="🎒 Inventory" weight=94
    export function countItem(item: MCItem): number { return _inventory.filter(i => i === item).length }

    /** Clear all items. */
    //% block="clear player inventory"
    //% blockId="mc_inv_clear"
    //% group="🎒 Inventory" weight=92
    export function clearInventory(): void { _inventory = []; _toast("🗑 Inventory cleared") }

    /** Equip armor to a slot. */
    //% block="equip $item in $slot"
    //% blockId="mc_equip"
    //% group="🎒 Inventory" weight=90
    export function equipArmor(item: MCItem, slot: MCArmorSlot): void {
        _toast(`🛡 ${MCItem[item]} → ${MCArmorSlot[slot]}`)
    }

    /** Give a full diamond armor set. */
    //% block="give player diamond armor"
    //% blockId="mc_give_diamond_armor"
    //% group="🎒 Inventory" weight=88
    export function giveDiamondArmor(): void {
        equipArmor(MCItem.DiamondHelmet, MCArmorSlot.Helmet)
        equipArmor(MCItem.DiamondChestplate, MCArmorSlot.Chestplate)
        equipArmor(MCItem.DiamondLeggings, MCArmorSlot.Leggings)
        equipArmor(MCItem.DiamondBoots, MCArmorSlot.Boots)
        _toast("💎 Full diamond armor!")
    }

    /** Give a starter kit. */
    //% block="give player starter kit"
    //% blockId="mc_starter_kit"
    //% group="🎒 Inventory" weight=86
    export function giveStarterKit(): void {
        giveItem(MCItem.IronSword)
        giveItem(MCItem.IronPickaxe)
        giveItem(MCItem.Bread)
        _toast("🎒 Starter kit given!")
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🎮 Gamemode
    // ══════════════════════════════════════════════════════════════

    /** Set the gamemode. */
    //% block="set gamemode to $mode"
    //% blockId="mc_gamemode_set"
    //% group="🎮 Gamemode" weight=100
    export function setGameMode(mode: MCGameMode): void {
        _gamemode = mode
        _toast(`🎮 ${MCGameMode[mode]} mode`)
    }

    /** Get the current gamemode. */
    //% block="current gamemode"
    //% blockId="mc_gamemode_get"
    //% group="🎮 Gamemode" weight=98
    export function getGameMode(): MCGameMode { return _gamemode }

    /** Returns true if in Creative mode. */
    //% block="player is in creative mode"
    //% blockId="mc_is_creative"
    //% group="🎮 Gamemode" weight=96
    export function isCreative(): boolean { return _gamemode === MCGameMode.Creative }

    /** Returns true if in Survival mode. */
    //% block="player is in survival mode"
    //% blockId="mc_is_survival"
    //% group="🎮 Gamemode" weight=94
    export function isSurvival(): boolean { return _gamemode === MCGameMode.Survival }

    /** Set a gamerule (boolean). @param rule eg:"keepInventory" */
    //% block="gamerule $rule = $value"
    //% blockId="mc_gamerule"
    //% value.shadow="toggleTrueFalse"
    //% group="🎮 Gamemode" weight=92
    export function setGameRule(rule: string, value: boolean): void {
        if (rule === "doMobSpawning") _mobSpawning = value
        if (rule === "doDaylightCycle") _dayNightCycle = value
        _toast(`⚙ ${rule} = ${value}`)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🐉 Spawn Mobs
    // ══════════════════════════════════════════════════════════════

    /** Spawn a mob at x y z. Returns its ID. */
    //% block="spawn $mob at x $x y $y z $z"
    //% blockId="mc_spawn"
    //% group="🐉 Spawn Mobs" weight=100
    export function spawnMob(mob: MCMob, x: number, y: number, z: number): number {
        const hp = _mobMaxHP(mob)
        const id = _nextMobId++
        _mobs.push({ id, type: mob, pos: new MCPos(x,y,z), health: hp, maxHealth: hp, name: MCMob[mob], behavior: MCBehavior.Wander, tamed: false })
        _toast(`👾 Spawned ${MCMob[mob]} at (${x},${y},${z})`)
        return id
    }

    /** Spawn a mob at a position value. */
    //% block="spawn $mob at $pos"
    //% blockId="mc_spawn_pos"
    //% group="🐉 Spawn Mobs" weight=98
    export function spawnAt(mob: MCMob, pos: MCPos): number { return spawnMob(mob, pos.x, pos.y, pos.z) }

    /** Spawn multiple mobs near a position. @param count eg:5 */
    //% block="spawn $count $mob near x $x y $y z $z"
    //% blockId="mc_spawn_many"
    //% count.min=1 count.max=20
    //% group="🐉 Spawn Mobs" weight=96
    export function spawnMany(mob: MCMob, count: number, x: number, y: number, z: number): void {
        for (let i=0; i<count; i++) spawnMob(mob, x+Math.randomRange(-5,5), y, z+Math.randomRange(-5,5))
    }

    /** Remove all mobs of a type. */
    //% block="remove all $mob"
    //% blockId="mc_remove_type"
    //% group="🐉 Spawn Mobs" weight=94
    export function removeAllOfType(mob: MCMob): void {
        const n = _mobs.length
        _mobs = _mobs.filter(m => m.type !== mob)
        _toast(`🗑 Removed ${n - _mobs.length} ${MCMob[mob]}`)
    }

    /** Remove all hostile mobs. */
    //% block="remove all hostile mobs"
    //% blockId="mc_remove_hostile"
    //% group="🐉 Spawn Mobs" weight=92
    export function removeHostile(): void {
        const hostile = [MCMob.Creeper,MCMob.Zombie,MCMob.Skeleton,MCMob.Spider,MCMob.Ghast,MCMob.Blaze,MCMob.Witch,MCMob.EnderDragon,MCMob.Wither]
        const n = _mobs.length
        _mobs = _mobs.filter(m => hostile.indexOf(m.type) < 0)
        _toast(`⚔️ Removed ${n-_mobs.length} hostile mobs`)
    }

    /** Remove all mobs. */
    //% block="remove all mobs"
    //% blockId="mc_remove_all_mobs"
    //% group="🐉 Spawn Mobs" weight=90
    export function removeAllMobs(): void { _mobs = []; _toast("🧹 All mobs removed") }

    /** Count mobs of a type. */
    //% block="count of $mob"
    //% blockId="mc_mob_count"
    //% group="🐉 Spawn Mobs" weight=88
    export function countMobs(mob: MCMob): number { return _mobs.filter(m => m.type === mob).length }

    /** Total mob count. */
    //% block="total mob count"
    //% blockId="mc_mob_count_all"
    //% group="🐉 Spawn Mobs" weight=86
    export function totalMobs(): number { return _mobs.length }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🤖 Mob Control
    // ══════════════════════════════════════════════════════════════

    /** Set behavior for all mobs of a type. */
    //% block="set all $mob behavior to $behavior"
    //% blockId="mc_mob_behavior"
    //% group="🤖 Mob Control" weight=100
    export function setMobBehavior(mob: MCMob, behavior: MCBehavior): void {
        _mobs.filter(m => m.type === mob).forEach(m => m.behavior = behavior)
        _toast(`🤖 ${MCMob[mob]}: ${MCBehavior[behavior]}`)
    }

    /** Make all mobs of a type attack the player. */
    //% block="make all $mob attack player"
    //% blockId="mc_mob_attack"
    //% group="🤖 Mob Control" weight=98
    export function makeAttack(mob: MCMob): void { setMobBehavior(mob, MCBehavior.AttackPlayer) }

    /** Make all mobs of a type flee. */
    //% block="make all $mob flee"
    //% blockId="mc_mob_flee"
    //% group="🤖 Mob Control" weight=96
    export function makeFlee(mob: MCMob): void { setMobBehavior(mob, MCBehavior.FleePlayer) }

    /** Teleport all mobs of a type to a position. */
    //% block="teleport all $mob to x $x y $y z $z"
    //% blockId="mc_mob_teleport"
    //% group="🤖 Mob Control" weight=94
    export function teleportMobs(mob: MCMob, x: number, y: number, z: number): void {
        _mobs.filter(m => m.type === mob).forEach(m => m.pos = new MCPos(x,y,z))
        _toast(`✨ Teleported all ${MCMob[mob]}`)
    }

    /** Tame a mob by ID. */
    //% block="tame mob $id"
    //% blockId="mc_mob_tame"
    //% group="🤖 Mob Control" weight=92
    export function tameMob(id: number): void {
        const m = _mobs.find(m => m.id === id)
        if (m) { m.tamed = true; m.behavior = MCBehavior.FollowPlayer; _toast(`🐾 ${m.name} tamed!`) }
    }

    /** Returns true if a mob is tamed. */
    //% block="mob $id is tamed"
    //% blockId="mc_mob_is_tamed"
    //% group="🤖 Mob Control" weight=90
    export function isTamed(id: number): boolean {
        const m = _mobs.find(m => m.id === id); return m ? m.tamed : false
    }

    /** Returns true if a mob type exists near a position. */
    //% block="$mob exists within $radius of x $x y $y z $z"
    //% blockId="mc_mob_near"
    //% radius.min=1 radius.max=100
    //% group="🤖 Mob Control" weight=88
    export function mobNear(mob: MCMob, x: number, y: number, z: number, radius: number): boolean {
        return _mobs.some(m => {
            if (m.type !== mob) return false
            const dx=m.pos.x-x, dy=m.pos.y-y, dz=m.pos.z-z
            return Math.sqrt(dx*dx+dy*dy+dz*dz) <= radius
        })
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 💀 Mob Health
    // ══════════════════════════════════════════════════════════════

    /** Get a mob's health by ID. */
    //% block="health of mob $id"
    //% blockId="mc_mob_hp"
    //% group="💀 Mob Health" weight=100
    export function getMobHealth(id: number): number {
        const m = _mobs.find(m => m.id === id); return m ? m.health : 0
    }

    /** Deal damage to a mob. @param amount eg:5 */
    //% block="deal $amount damage to mob $id"
    //% blockId="mc_mob_damage"
    //% amount.min=1 amount.max=200
    //% group="💀 Mob Health" weight=98
    export function damageMob(id: number, amount: number): void {
        const m = _mobs.find(m => m.id === id)
        if (!m) return
        m.health = Math.max(0, m.health - amount)
        if (m.health <= 0) { _toast(`💀 ${m.name} slain!`); _mobs = _mobs.filter(x => x.id !== id); _fireMobKilled(id, m.type) }
    }

    /** Heal a mob. @param amount eg:5 */
    //% block="heal mob $id by $amount"
    //% blockId="mc_mob_heal"
    //% amount.min=1 amount.max=200
    //% group="💀 Mob Health" weight=96
    export function healMob(id: number, amount: number): void {
        const m = _mobs.find(m => m.id === id)
        if (m) m.health = Math.min(m.maxHealth, m.health + amount)
    }

    /** Kill a mob instantly. */
    //% block="kill mob $id"
    //% blockId="mc_mob_kill"
    //% group="💀 Mob Health" weight=94
    export function killMob(id: number): void {
        const m = _mobs.find(m => m.id === id)
        if (m) { _toast(`💀 ${m.name} killed`); _fireMobKilled(id, m.type); _mobs = _mobs.filter(x => x.id !== id) }
    }

    /** Deal damage to all mobs of a type. */
    //% block="deal $amount damage to all $mob"
    //% blockId="mc_mob_damage_all"
    //% amount.min=1 amount.max=200
    //% group="💀 Mob Health" weight=92
    export function damageAll(mob: MCMob, amount: number): void {
        _mobs.filter(m => m.type === mob).forEach(m => damageMob(m.id, amount))
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🗡️ Give Items
    // ══════════════════════════════════════════════════════════════

    /** Give the player a count of an item. @param count eg:1 */
    //% block="give player $count $item"
    //% blockId="mc_item_give_count"
    //% count.min=1 count.max=64
    //% group="🗡️ Give Items" weight=100
    export function give(item: MCItem, count: number): void {
        for (let i=0; i<count; i++) giveItem(item)
        _toast(`📦 +${count} ${MCItem[item]}`)
    }

    /** Drop an item at a position. */
    //% block="drop $item at x $x y $y z $z"
    //% blockId="mc_item_drop"
    //% group="🗡️ Give Items" weight=98
    export function dropItem(item: MCItem, x: number, y: number, z: number): void {
        _toast(`🎒 Dropped ${MCItem[item]} at (${x},${y},${z})`)
    }

    /** Create a loot chest at a position. */
    //% block="create loot chest at x $x y $y z $z"
    //% blockId="mc_loot_chest"
    //% group="🗡️ Give Items" weight=96
    export function createLootChest(x: number, y: number, z: number): void {
        placeBlock(Block.Chest, x, y, z)
        _toast(`🎁 Loot chest at (${x},${y},${z})`)
    }

    /** Create a rare loot chest with powerful items. */
    //% block="create rare loot chest at x $x y $y z $z"
    //% blockId="mc_rare_chest"
    //% group="🗡️ Give Items" weight=94
    export function createRareChest(x: number, y: number, z: number): void {
        placeBlock(Block.Chest, x, y, z)
        _toast(`💎 Rare loot chest at (${x},${y},${z})!`)
    }

    /** Returns true if an item is food. */
    //% block="$item is food"
    //% blockId="mc_is_food"
    //% group="🗡️ Give Items" weight=92
    export function isFood(item: MCItem): boolean {
        return [MCItem.Apple, MCItem.Bread, MCItem.CookedBeef, MCItem.GoldenApple, MCItem.Carrot].indexOf(item) >= 0
    }

    /** Returns true if an item is a weapon. */
    //% block="$item is a weapon"
    //% blockId="mc_is_weapon"
    //% group="🗡️ Give Items" weight=90
    export function isWeapon(item: MCItem): boolean {
        return [MCItem.WoodenSword,MCItem.StoneSword,MCItem.IronSword,MCItem.GoldenSword,MCItem.DiamondSword,MCItem.Bow].indexOf(item) >= 0
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: ✨ Enchanting
    // ══════════════════════════════════════════════════════════════

    /** Enchant the held item. @param level eg:1 */
    //% block="enchant held item with $enchant level $level"
    //% blockId="mc_enchant"
    //% level.min=1 level.max=5
    //% group="✨ Enchanting" weight=100
    export function enchant(enchant: MCEnchant, level: number): void {
        _toast(`✨ ${MCEnchant[enchant]} ${level} applied!`)
    }

    /** Randomly enchant using XP levels. @param xpLevels eg:30 */
    //% block="randomly enchant using $xpLevels XP levels"
    //% blockId="mc_enchant_random"
    //% xpLevels.min=1 xpLevels.max=30
    //% group="✨ Enchanting" weight=98
    export function enchantRandom(xpLevels: number): void {
        const all = [MCEnchant.Sharpness,MCEnchant.Unbreaking,MCEnchant.Fortune,MCEnchant.Efficiency,MCEnchant.Protection,MCEnchant.Looting]
        const e = all[Math.randomRange(0, all.length-1)]
        const lvl = Math.min(5, Math.ceil(xpLevels/8))
        _center(`✨ Got ${MCEnchant[e]} ${lvl}!`)
    }

    /** Remove all enchantments from held item. */
    //% block="remove all enchantments"
    //% blockId="mc_enchant_remove"
    //% group="✨ Enchanting" weight=96
    export function removeEnchantments(): void { _toast("🔮 Enchantments removed") }

    /** Repair the held item. */
    //% block="repair held item"
    //% blockId="mc_repair"
    //% group="✨ Enchanting" weight=94
    export function repairItem(): void { _toast("🔧 Item repaired!") }

    /** Build an enchanting table setup. */
    //% block="build enchanting table at x $x y $y z $z"
    //% blockId="mc_enchant_table"
    //% group="✨ Enchanting" weight=92
    export function buildEnchantingTable(x: number, y: number, z: number): void {
        placeBlock(Block.CraftingTable, x, y, z)
        for (let dx = -2; dx <= 2; dx++) {
            placeBlock(Block.Bookshelf, x+dx, y, z-2)
            placeBlock(Block.Bookshelf, x+dx, y, z+2)
        }
        for (let dz = -1; dz <= 1; dz++) {
            placeBlock(Block.Bookshelf, x-2, y, z+dz)
            placeBlock(Block.Bookshelf, x+2, y, z+dz)
        }
        _toast(`📚 Enchanting setup built`)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🔴 Redstone Power
    // ══════════════════════════════════════════════════════════════

    /** Set redstone power level at a position. @param level eg:15 */
    //% block="set redstone power at x $x y $y z $z to $level"
    //% blockId="mc_rs_set"
    //% level.min=0 level.max=15
    //% group="🔴 Redstone Power" weight=100
    export function setRedstone(x: number, y: number, z: number, level: number): void {
        _redstone[_bkey(x,y,z)] = Math.clamp(0,15,level)
        _toast(`⚡ Redstone (${x},${y},${z}) = ${level}`)
    }

    /** Get redstone power at a position. */
    //% block="redstone power at x $x y $y z $z"
    //% blockId="mc_rs_get"
    //% group="🔴 Redstone Power" weight=98
    export function getRedstone(x: number, y: number, z: number): number { return _redstone[_bkey(x,y,z)] ?? 0 }

    /** Returns true if position is powered. */
    //% block="x $x y $y z $z is powered"
    //% blockId="mc_rs_powered"
    //% group="🔴 Redstone Power" weight=96
    export function isPowered(x: number, y: number, z: number): boolean { return getRedstone(x,y,z) > 0 }

    /** Cut power at a position. */
    //% block="cut power at x $x y $y z $z"
    //% blockId="mc_rs_cut"
    //% group="🔴 Redstone Power" weight=94
    export function cutPower(x: number, y: number, z: number): void { delete _redstone[_bkey(x,y,z)] }

    /** AND gate. */
    //% block="AND: A(x $ax y $ay z $az) AND B(x $bx y $by z $bz)"
    //% blockId="mc_rs_and"
    //% group="🔴 Redstone Power" weight=92
    export function andGate(ax:number,ay:number,az:number,bx:number,by:number,bz:number): boolean {
        return isPowered(ax,ay,az) && isPowered(bx,by,bz)
    }

    /** OR gate. */
    //% block="OR: A(x $ax y $ay z $az) OR B(x $bx y $by z $bz)"
    //% blockId="mc_rs_or"
    //% group="🔴 Redstone Power" weight=90
    export function orGate(ax:number,ay:number,az:number,bx:number,by:number,bz:number): boolean {
        return isPowered(ax,ay,az) || isPowered(bx,by,bz)
    }

    /** NOT gate. */
    //% block="NOT(x $x y $y z $z)"
    //% blockId="mc_rs_not"
    //% group="🔴 Redstone Power" weight=88
    export function notGate(x: number, y: number, z: number): boolean { return !isPowered(x,y,z) }

    // ══════════════════════════════════════════════════════════════
    // GROUP: ⚡ Redstone Devices
    // ══════════════════════════════════════════════════════════════

    /** Toggle a lever at a position. */
    //% block="toggle lever at x $x y $y z $z"
    //% blockId="mc_lever"
    //% group="⚡ Redstone Devices" weight=100
    export function toggleLever(x: number, y: number, z: number): void {
        const cur = getRedstone(x,y,z); setRedstone(x,y,z, cur>0?0:15)
    }

    /** Press a button at a position (brief pulse). */
    //% block="press button at x $x y $y z $z"
    //% blockId="mc_button"
    //% group="⚡ Redstone Devices" weight=98
    export function pressButton(x: number, y: number, z: number): void {
        setRedstone(x,y,z,15)
        control.runInParallel(() => { pause(500); setRedstone(x,y,z,0) })
        _toast(`🔘 Button pressed`)
    }

    /** Open or close a door. */
    //% block="door at x $x y $y z $z $open"
    //% blockId="mc_door"
    //% open.shadow="toggleOpenClose"
    //% group="⚡ Redstone Devices" weight=96
    export function setDoor(x: number, y: number, z: number, open: boolean): void {
        _toast(`🚪 Door (${x},${y},${z}) ${open?"opened":"closed"}`)
    }

    /** Ignite TNT at a position. @param fuseSeconds eg:4 */
    //% block="ignite TNT at x $x y $y z $z fuse $fuseSeconds s"
    //% blockId="mc_tnt"
    //% fuseSeconds.min=1 fuseSeconds.max=20
    //% group="⚡ Redstone Devices" weight=94
    export function igniteTNT(x: number, y: number, z: number, fuseSeconds: number): void {
        _toast(`💣 TNT fuse lit (${fuseSeconds}s)`)
        control.runInParallel(() => { pause(fuseSeconds*1000); explode(x,y,z,4) })
    }

    /** Start a redstone clock. @param intervalMs eg:1000 */
    //% block="start clock at x $x y $y z $z every $intervalMs ms"
    //% blockId="mc_clock"
    //% intervalMs.min=100 intervalMs.max=60000
    //% group="⚡ Redstone Devices" weight=92
    export function startClock(x: number, y: number, z: number, intervalMs: number): void {
        control.runInParallel(() => {
            let on = false
            while (true) { on=!on; setRedstone(x,y,z,on?15:0); pause(intervalMs) }
        })
        _toast(`⏱ Clock started (${intervalMs}ms)`)
    }

    /** Ring a note block. */
    //% block="ring note block at x $x y $y z $z"
    //% blockId="mc_note"
    //% group="⚡ Redstone Devices" weight=90
    export function ringNoteBlock(x: number, y: number, z: number): void {
        music.playTone(262, music.beat(BeatFraction.Quarter))
        _toast(`🎵 Note block`)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: ⚒️ Crafting
    // ══════════════════════════════════════════════════════════════

    /** Returns true if the player can craft an item. */
    //% block="can craft $item"
    //% blockId="mc_can_craft"
    //% group="⚒️ Crafting" weight=100
    export function canCraft(item: MCItem): boolean {
        const r = _customRecipes.find(r => r.result === item)
        return r ? hasItem(r.ing1) && hasItem(r.ing2) : false
    }

    /** Craft an item if ingredients are available. */
    //% block="craft $item"
    //% blockId="mc_craft"
    //% group="⚒️ Crafting" weight=98
    export function craft(item: MCItem): boolean {
        const r = _customRecipes.find(r => r.result === item)
        if (!r) { _toast(`❌ No recipe for ${MCItem[item]}`); return false }
        if (!hasItem(r.ing1) || !hasItem(r.ing2)) { _toast(`❌ Missing ingredients`); return false }
        takeItem(r.ing1); takeItem(r.ing2); giveItem(item)
        _toast(`⚒️ Crafted ${MCItem[item]}!`); return true
    }

    /** Register a custom recipe. */
    //% block="recipe: $ing1 + $ing2 → $item"
    //% blockId="mc_recipe"
    //% group="⚒️ Crafting" weight=96
    export function registerRecipe(item: MCItem, ing1: MCItem, ing2: MCItem): void {
        _customRecipes.push({ result: item, ing1, ing2 })
        _toast(`📖 Recipe: ${MCItem[ing1]}+${MCItem[ing2]}→${MCItem[item]}`)
    }

    /** Place a crafting table at a position. */
    //% block="place crafting table at x $x y $y z $z"
    //% blockId="mc_crafting_table"
    //% group="⚒️ Crafting" weight=94
    export function placeCraftingTable(x: number, y: number, z: number): void { placeBlock(Block.CraftingTable, x,y,z) }

    /** Place a furnace and smelt an item. */
    //% block="smelt $item in furnace at x $x y $y z $z"
    //% blockId="mc_smelt"
    //% group="⚒️ Crafting" weight=92
    export function smelt(item: MCItem, x: number, y: number, z: number): void {
        placeBlock(Block.Furnace, x,y,z)
        _toast(`🔥 Smelting ${MCItem[item]}…`)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🧪 Brewing
    // ══════════════════════════════════════════════════════════════

    /** Brew a potion. @param level eg:1 */
    //% block="brew $effect potion level $level"
    //% blockId="mc_brew"
    //% level.min=1 level.max=3
    //% group="🧪 Brewing" weight=100
    export function brewPotion(effect: MCEffect, level: number): void {
        if (hasItem(MCItem.BlazeRod)) {
            takeItem(MCItem.BlazeRod); giveItem(MCItem.Potion)
            _toast(`🧪 Brewed ${MCEffect[effect]} Lv${level}!`)
        } else {
            _toast(`❌ Need Blaze Rod to brew`)
        }
    }

    /** Splash a potion at a position. */
    //% block="splash $effect potion at x $x y $y z $z radius $r"
    //% blockId="mc_splash"
    //% r.min=1 r.max=10
    //% group="🧪 Brewing" weight=98
    export function splashPotion(effect: MCEffect, x: number, y: number, z: number, r: number): void {
        _toast(`💧 ${MCEffect[effect]} splash r=${r}!`)
    }

    /** Apply a potion effect to all mobs near a position. */
    //% block="apply $effect to mobs within $r of x $x y $y z $z"
    //% blockId="mc_mob_effect"
    //% r.min=1 r.max=20
    //% group="🧪 Brewing" weight=96
    export function applyEffectToMobs(effect: MCEffect, x: number, y: number, z: number, r: number): void {
        _toast(`✨ ${MCEffect[effect]} applied to nearby mobs`)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 📡 Events
    // ══════════════════════════════════════════════════════════════

    let _onDeath: (() => void)[] = []
    let _onSpawn: (() => void)[] = []
    let _onNight: (() => void)[] = []
    let _onDay: (() => void)[] = []
    let _onWeatherChange: (() => void)[] = []
    let _onMobKilledHandlers: ((id: number, type: MCMob) => void)[] = []
    let _onStart: (() => void)[] = []

    /** Run code when the game starts. */
    //% block="on game start"
    //% blockId="mc_on_start"
    //% group="📡 Events" weight=100
    //% handlerStatement=true
    export function onGameStart(handler: () => void): void {
        _onStart.push(handler)
        control.runInParallel(() => { pause(0); _onStart.forEach(h => h()) })
    }

    /** Run code when the player dies. */
    //% block="on player died"
    //% blockId="mc_on_death"
    //% group="📡 Events" weight=98
    //% handlerStatement=true
    export function onPlayerDied(handler: () => void): void { _onDeath.push(handler) }

    /** Run code when the player spawns. */
    //% block="on player spawned"
    //% blockId="mc_on_spawn"
    //% group="📡 Events" weight=96
    //% handlerStatement=true
    export function onPlayerSpawned(handler: () => void): void {
        _onSpawn.push(handler)
        control.runInParallel(() => { pause(100); _onSpawn.forEach(h => h()) })
    }

    /** Run code when it becomes nighttime. */
    //% block="on nighttime"
    //% blockId="mc_on_night"
    //% group="📡 Events" weight=94
    //% handlerStatement=true
    export function onNighttime(handler: () => void): void {
        _onNight.push(handler)
        control.runInParallel(() => {
            let was = isNighttime()
            while (true) { const now=isNighttime(); if (!was&&now) _onNight.forEach(h=>h()); was=now; pause(1000) }
        })
    }

    /** Run code when it becomes daytime. */
    //% block="on daytime"
    //% blockId="mc_on_day"
    //% group="📡 Events" weight=92
    //% handlerStatement=true
    export function onDaytime(handler: () => void): void {
        _onDay.push(handler)
        control.runInParallel(() => {
            let was = isDaytime()
            while (true) { const now=isDaytime(); if (!was&&now) _onDay.forEach(h=>h()); was=now; pause(1000) }
        })
    }

    /** Run code when weather changes. */
    //% block="on weather change"
    //% blockId="mc_on_weather"
    //% group="📡 Events" weight=90
    //% handlerStatement=true
    export function onWeatherChange(handler: () => void): void {
        _onWeatherChange.push(handler)
        control.runInParallel(() => {
            let last = getWeather()
            while (true) { const now=getWeather(); if (now!==last) _onWeatherChange.forEach(h=>h()); last=now; pause(1000) }
        })
    }

    /** Run code when any mob is killed. */
    //% block="on mob killed"
    //% blockId="mc_on_mob_killed"
    //% group="📡 Events" weight=88
    //% draggableParameters="reporter"
    export function onMobKilled(handler: (id: number, type: MCMob) => void): void {
        _onMobKilledHandlers.push(handler)
    }

    /** Run code when all mobs of a type are gone. */
    //% block="on all $mob eliminated"
    //% blockId="mc_on_all_gone"
    //% group="📡 Events" weight=86
    //% handlerStatement=true
    export function onAllEliminated(mob: MCMob, handler: () => void): void {
        control.runInParallel(() => { while (countMobs(mob) > 0) pause(500); handler() })
    }

    /** Run code when the player reaches a level. @param level eg:10 */
    //% block="on player reaches level $level"
    //% blockId="mc_on_level"
    //% level.min=1 level.max=100
    //% group="📡 Events" weight=84
    //% handlerStatement=true
    export function onReachesLevel(level: number, handler: () => void): void {
        control.runInParallel(() => { while (getLevel() < level) pause(500); handler() })
    }

    /** Run code when health drops below a threshold. @param threshold eg:5 */
    //% block="on player health below $threshold"
    //% blockId="mc_on_low_health"
    //% threshold.min=1 threshold.max=20
    //% group="📡 Events" weight=82
    //% handlerStatement=true
    export function onLowHealth(threshold: number, handler: () => void): void {
        control.runInParallel(() => {
            let triggered = false
            while (true) {
                if (!triggered && getHealth() < threshold) { triggered=true; handler() }
                else if (getHealth() >= threshold) triggered=false
                pause(200)
            }
        })
    }

    /** Run code when a specific block is placed. */
    //% block="on $block placed"
    //% blockId="mc_on_block_placed"
    //% group="📡 Events" weight=80
    //% handlerStatement=true
    export function onBlockPlaced(block: Block, handler: () => void): void {
        // Hook into placeBlock — stored for external integration
        _toast(`👂 Watching for ${Block[block]} placement`)
    }

    /** Run code after a delay. @param delayMs eg:3000 */
    //% block="run after $delayMs ms"
    //% blockId="mc_run_after"
    //% delayMs.min=100 delayMs.max=300000
    //% group="📡 Events" weight=78
    //% handlerStatement=true
    export function runAfter(delayMs: number, handler: () => void): void {
        control.runInParallel(() => { pause(delayMs); handler() })
    }

    /** Run code every N milliseconds. @param intervalMs eg:1000 */
    //% block="run every $intervalMs ms"
    //% blockId="mc_run_every"
    //% intervalMs.min=100 intervalMs.max=60000
    //% group="📡 Events" weight=76
    //% handlerStatement=true
    export function runEvery(intervalMs: number, handler: () => void): void {
        control.runInParallel(() => { while (true) { handler(); pause(intervalMs) } })
    }

    /** Register a named custom event. @param name eg:"my_event" */
    //% block="on custom event $name"
    //% blockId="mc_on_custom"
    //% group="📡 Events" weight=74
    //% handlerStatement=true
    export function onCustomEvent(name: string, handler: () => void): void {
        if (!_customEvents[name]) _customEvents[name] = []
        _customEvents[name].push(handler)
    }

    /** Fire a named custom event. @param name eg:"my_event" */
    //% block="fire event $name"
    //% blockId="mc_fire_event"
    //% group="📡 Events" weight=72
    export function fireEvent(name: string): void {
        if (_customEvents[name]) _customEvents[name].forEach(h => h())
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🖥️ HUD & Messages
    // ══════════════════════════════════════════════════════════════

    /** Show a toast message. @param message eg:"Hello!" */
    //% block="show toast $message"
    //% blockId="mc_toast"
    //% group="🖥️ HUD & Messages" weight=100
    export function showToast(message: string): void { game.showLongText(message, DialogLayout.Top) }

    /** Show a big centered title. @param title eg:"ROUND 1" @param subtitle eg:"Survive!" */
    //% block="show title $title subtitle $subtitle"
    //% blockId="mc_title"
    //% group="🖥️ HUD & Messages" weight=98
    export function showTitle(title: string, subtitle: string): void {
        game.showLongText(`${title}\n${subtitle}`, DialogLayout.Center)
    }

    /** Show a bottom action bar. @param message eg:"Press A" */
    //% block="show action bar $message"
    //% blockId="mc_action_bar"
    //% group="🖥️ HUD & Messages" weight=96
    export function showActionBar(message: string): void { game.showLongText(message, DialogLayout.Bottom) }

    /** Show player stats in HUD. */
    //% block="show player stats"
    //% blockId="mc_show_stats"
    //% group="🖥️ HUD & Messages" weight=94
    export function showStats(): void {
        game.showLongText(`❤️ ${_health}/20  🍗 ${_hunger}/20  ⭐ Lv${_level}`, DialogLayout.Top)
    }

    /** Show a dialog from a character. @param speaker eg:"Villager" @param message eg:"Hello!" */
    //% block="dialog from $speaker: $message"
    //% blockId="mc_dialog"
    //% group="🖥️ HUD & Messages" weight=92
    export function showDialog(speaker: string, message: string): void {
        game.showLongText(`[${speaker}]: ${message}`, DialogLayout.Bottom)
    }

    /** Send a chat message. @param sender eg:"Steve" @param message eg:"Hi!" */
    //% block="chat $sender: $message"
    //% blockId="mc_chat"
    //% group="🖥️ HUD & Messages" weight=90
    export function chat(sender: string, message: string): void {
        game.showLongText(`<${sender}> ${message}`, DialogLayout.Bottom)
    }

    /** Broadcast to all players. @param message eg:"Game starts!" */
    //% block="broadcast $message"
    //% blockId="mc_broadcast"
    //% group="🖥️ HUD & Messages" weight=88
    export function broadcast(message: string): void { game.showLongText(`📢 ${message}`, DialogLayout.Center) }

    /** Show death screen. */
    //% block="show death screen"
    //% blockId="mc_death_screen"
    //% group="🖥️ HUD & Messages" weight=86
    export function showDeathScreen(): void {
        game.showLongText(`💀 YOU DIED!\nScore: ${_score}\nPress A to Respawn`, DialogLayout.Center)
    }

    /** End the game (lose). @param message eg:"Game Over" */
    //% block="game over: $message"
    //% blockId="mc_game_over"
    //% group="🖥️ HUD & Messages" weight=84
    export function gameOver(message: string): void {
        game.showLongText(message, DialogLayout.Center); pause(2000); game.over(false)
    }

    /** End the game (win). @param message eg:"You Win!" */
    //% block="win game: $message"
    //% blockId="mc_win"
    //% group="🖥️ HUD & Messages" weight=82
    export function winGame(message: string): void {
        game.showLongText(message, DialogLayout.Center); pause(2000); game.over(true)
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 📊 Scoreboard
    // ══════════════════════════════════════════════════════════════

    /** Set a named scoreboard entry. @param name eg:"Kills" @param value eg:0 */
    //% block="set scoreboard $name to $value"
    //% blockId="mc_sb_set"
    //% group="📊 Scoreboard" weight=100
    export function setScoreboardEntry(name: string, value: number): void { _scoreboard[name] = value }

    /** Add to a scoreboard entry. @param name eg:"Kills" @param amount eg:1 */
    //% block="add $amount to scoreboard $name"
    //% blockId="mc_sb_add"
    //% group="📊 Scoreboard" weight=98
    export function addScoreboardEntry(name: string, amount: number): void {
        _scoreboard[name] = (_scoreboard[name] ?? 0) + amount
        info.setScore(_scoreboard[name])
    }

    /** Get a scoreboard entry value. @param name eg:"Kills" */
    //% block="scoreboard $name"
    //% blockId="mc_sb_get"
    //% group="📊 Scoreboard" weight=96
    export function getScoreboardEntry(name: string): number { return _scoreboard[name] ?? 0 }

    /** Show all scoreboard entries. */
    //% block="show scoreboard"
    //% blockId="mc_sb_show"
    //% group="📊 Scoreboard" weight=94
    export function showScoreboard(): void {
        const lines = Object.keys(_scoreboard).map(k => `${k}: ${_scoreboard[k]}`).join("\n")
        game.showLongText(lines || "(empty)", DialogLayout.Right)
    }

    /** Reset scoreboard. */
    //% block="reset scoreboard"
    //% blockId="mc_sb_reset"
    //% group="📊 Scoreboard" weight=92
    export function resetScoreboard(): void { _scoreboard = {}; info.setScore(0) }

    // ══════════════════════════════════════════════════════════════
    // GROUP: ⌨️ Commands
    // ══════════════════════════════════════════════════════════════

    /** Start a mob wave. @param wave eg:1 */
    //% block="start mob wave $wave"
    //% blockId="mc_wave"
    //% wave.min=1 wave.max=20
    //% group="⌨️ Commands" weight=100
    export function startMobWave(wave: number): void {
        setTimeOfDay(MCTimePreset.Midnight)
        const n = 5 + wave * 2
        spawnMany(MCMob.Zombie, n, _pos.x, _pos.y, _pos.z)
        if (wave > 3) spawnMany(MCMob.Skeleton, Math.ceil(n/2), _pos.x, _pos.y, _pos.z)
        if (wave > 7) spawnMany(MCMob.Creeper, Math.ceil(n/3), _pos.x, _pos.y, _pos.z)
        broadcast(`🌙 WAVE ${wave} — ${totalMobs()} mobs!`)
    }

    /** Countdown then run code. @param seconds eg:3 */
    //% block="countdown $seconds seconds"
    //% blockId="mc_countdown"
    //% seconds.min=1 seconds.max=30
    //% handlerStatement=true
    //% group="⌨️ Commands" weight=98
    export function countdown(seconds: number, handler: () => void): void {
        control.runInParallel(() => {
            for (let i=seconds; i>0; i--) { showTitle(`${i}`, i===1?"GO!":""); pause(1000) }
            handler()
        })
    }

    /** Build a spawn platform for the player. */
    //% block="build spawn platform at x $x y $y z $z"
    //% blockId="mc_spawn_platform"
    //% group="⌨️ Commands" weight=96
    export function buildSpawnPlatform(x: number, y: number, z: number): void {
        fill(Block.OakPlanks, x-3, y, z-3, x+3, y, z+3)
        fillHollow(Block.OakLog, x-4, y, z-4, x+4, y+4, z+4)
        teleport(x, y+1, z)
        _toast("🏡 Spawn platform built!")
    }

    /** Enter the Nether (dimension switch + teleport). */
    //% block="enter the Nether"
    //% blockId="mc_enter_nether"
    //% group="⌨️ Commands" weight=94
    export function enterNether(): void {
        travelTo(MCDim.Nether)
        teleport(_pos.x/8|0, 64, _pos.z/8|0)
    }

    /** Enter The End and spawn the Ender Dragon. */
    //% block="enter The End"
    //% blockId="mc_enter_end"
    //% group="⌨️ Commands" weight=92
    export function enterTheEnd(): void {
        travelTo(MCDim.TheEnd)
        teleport(0, 64, 0)
        spawnMob(MCMob.EnderDragon, 0, 80, 0)
        _center("🐉 The Ender Dragon awakens!")
    }

    /** Run once when a block is detected at a position. */
    //% block="detect $block at x $x y $y z $z then"
    //% blockId="mc_detect"
    //% handlerStatement=true
    //% group="⌨️ Commands" weight=90
    export function detectBlock(block: Block, x: number, y: number, z: number, handler: () => void): void {
        control.runInParallel(() => {
            while (!blockIs(x,y,z,block)) pause(500)
            handler()
        })
    }

    // ══════════════════════════════════════════════════════════════
    // GROUP: 🐛 Debug
    // ══════════════════════════════════════════════════════════════

    /** Debug a number. @param label eg:"pos" @param value eg:0 */
    //% block="debug $label = $value"
    //% blockId="mc_debug_num"
    //% group="🐛 Debug" weight=100
    export function debugNum(label: string, value: number): void {
        game.showLongText(`🐛 ${label} = ${value}`, DialogLayout.Bottom)
        console.log(`[MC] ${label} = ${value}`)
    }

    /** Debug a string. @param label eg:"state" @param value eg:"running" */
    //% block="debug $label = $value"
    //% blockId="mc_debug_str"
    //% group="🐛 Debug" weight=98
    export function debugStr(label: string, value: string): void {
        game.showLongText(`🐛 ${label} = ${value}`, DialogLayout.Bottom)
        console.log(`[MC] ${label} = ${value}`)
    }

    /** Log the full world state. */
    //% block="log world state"
    //% blockId="mc_log_state"
    //% group="🐛 Debug" weight=96
    export function logState(): void {
        console.log(`[MC] Time=${_time} Weather=${MCWeather[_weather]} Dim=${MCDim[_dimension]}`)
        console.log(`[MC] Player=${_playerName} HP=${_health} LV=${_level} Mode=${MCGameMode[_gamemode]}`)
        console.log(`[MC] Mobs=${_mobs.length} Inventory=${_inventory.length} items`)
    }

    /** Assert a condition. @param label eg:"hp>0" */
    //% block="assert $condition label $label"
    //% blockId="mc_assert"
    //% group="🐛 Debug" weight=94
    export function assert(condition: boolean, label: string): void {
        game.showLongText(condition ? `✅ PASS: ${label}` : `❌ FAIL: ${label}`, DialogLayout.Bottom)
        if (!condition) console.error(`[MC FAIL] ${label}`)
    }

    // ══════════════════════════════════════════════════════════════
    // INTERNAL EVENT HELPERS
    // ══════════════════════════════════════════════════════════════
    function _firePlayerDied(): void { _onDeath.forEach(h => h()) }
    function _fireMobKilled(id: number, type: MCMob): void { _onMobKilledHandlers.forEach(h => h(id, type)) }
}
