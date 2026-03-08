// ── enums.ts ── All shared types for the Minecraft extension ──

class MCPos {
    constructor(public x: number, public y: number, public z: number) {}
    toString(): string { return `(${this.x}, ${this.y}, ${this.z})` }
    add(o: MCPos): MCPos { return new MCPos(this.x+o.x, this.y+o.y, this.z+o.z) }
    equals(o: MCPos): boolean { return this.x===o.x && this.y===o.y && this.z===o.z }
}

enum Block {
    //% block="Air"          Air = 0,
    //% block="Stone"        Stone = 1,
    //% block="Grass"        Grass = 2,
    //% block="Dirt"         Dirt = 3,
    //% block="Cobblestone"  Cobblestone = 4,
    //% block="Oak Planks"   OakPlanks = 5,
    //% block="Bedrock"      Bedrock = 7,
    //% block="Water"        Water = 8,
    //% block="Lava"         Lava = 10,
    //% block="Sand"         Sand = 12,
    //% block="Gravel"       Gravel = 13,
    //% block="Gold Ore"     GoldOre = 14,
    //% block="Iron Ore"     IronOre = 15,
    //% block="Coal Ore"     CoalOre = 16,
    //% block="Oak Log"      OakLog = 17,
    //% block="Oak Leaves"   OakLeaves = 18,
    //% block="Glass"        Glass = 20,
    //% block="Wool"         Wool = 35,
    //% block="Gold Block"   GoldBlock = 41,
    //% block="Iron Block"   IronBlock = 42,
    //% block="TNT"          TNT = 46,
    //% block="Bookshelf"    Bookshelf = 47,
    //% block="Obsidian"     Obsidian = 49,
    //% block="Torch"        Torch = 50,
    //% block="Chest"        Chest = 54,
    //% block="Diamond Ore"  DiamondOre = 56,
    //% block="Diamond Block" DiamondBlock = 57,
    //% block="Crafting Table" CraftingTable = 58,
    //% block="Furnace"      Furnace = 61,
    //% block="Redstone Ore" RedstoneOre = 73,
    //% block="Snow"         Snow = 78,
    //% block="Ice"          Ice = 79,
    //% block="Cactus"       Cactus = 81,
    //% block="Pumpkin"      Pumpkin = 86,
    //% block="Netherrack"   Netherrack = 87,
    //% block="Glowstone"    Glowstone = 89,
    //% block="Jack-o-Lantern" JackOLantern = 91,
    //% block="Nether Brick" NetherBrick = 112,
    //% block="End Stone"    EndStone = 121,
    //% block="Beacon"       Beacon = 138,
    //% block="Redstone Block" RedstoneBlock = 152,
    //% block="Hay Bale"     HayBale = 170
}

enum MCItem {
    //% block="Wooden Sword"     WoodenSword = 268,
    //% block="Stone Sword"      StoneSword = 272,
    //% block="Iron Sword"       IronSword = 267,
    //% block="Golden Sword"     GoldenSword = 283,
    //% block="Diamond Sword"    DiamondSword = 276,
    //% block="Iron Pickaxe"     IronPickaxe = 257,
    //% block="Diamond Pickaxe"  DiamondPickaxe = 278,
    //% block="Iron Axe"         IronAxe = 258,
    //% block="Iron Shovel"      IronShovel = 256,
    //% block="Bow"              Bow = 261,
    //% block="Arrow"            Arrow = 262,
    //% block="Flint and Steel"  FlintAndSteel = 259,
    //% block="Apple"            Apple = 260,
    //% block="Bread"            Bread = 297,
    //% block="Cooked Beef"      CookedBeef = 364,
    //% block="Golden Apple"     GoldenApple = 322,
    //% block="Carrot"           Carrot = 391,
    //% block="Iron Helmet"      IronHelmet = 306,
    //% block="Iron Chestplate"  IronChestplate = 307,
    //% block="Iron Leggings"    IronLeggings = 308,
    //% block="Iron Boots"       IronBoots = 309,
    //% block="Diamond Helmet"   DiamondHelmet = 310,
    //% block="Diamond Chestplate" DiamondChestplate = 311,
    //% block="Diamond Leggings" DiamondLeggings = 312,
    //% block="Diamond Boots"    DiamondBoots = 313,
    //% block="Coal"             Coal = 263,
    //% block="Iron Ingot"       IronIngot = 265,
    //% block="Gold Ingot"       GoldIngot = 266,
    //% block="Diamond"          Diamond = 264,
    //% block="Emerald"          Emerald = 388,
    //% block="Stick"            Stick = 280,
    //% block="String"           String = 287,
    //% block="Redstone Dust"    RedstoneDust = 331,
    //% block="Blaze Rod"        BlazeRod = 369,
    //% block="Ender Pearl"      EnderPearl = 368,
    //% block="Eye of Ender"     EyeOfEnder = 381,
    //% block="Nether Star"      NetherStar = 399,
    //% block="Bone"             Bone = 352,
    //% block="Feather"          Feather = 288,
    //% block="Saddle"           Saddle = 329,
    //% block="Compass"          Compass = 345,
    //% block="Map"              Map = 395,
    //% block="Book"             Book = 340,
    //% block="Fishing Rod"      FishingRod = 346,
    //% block="Bucket"           Bucket = 325,
    //% block="Potion"           Potion = 373
}

enum MCMob {
    //% block="Creeper"       Creeper = 0,
    //% block="Skeleton"      Skeleton = 1,
    //% block="Spider"        Spider = 2,
    //% block="Zombie"        Zombie = 4,
    //% block="Ghast"         Ghast = 6,
    //% block="Enderman"      Enderman = 8,
    //% block="Blaze"         Blaze = 9,
    //% block="Witch"         Witch = 14,
    //% block="Ender Dragon"  EnderDragon = 11,
    //% block="Wither"        Wither = 12,
    //% block="Pig"           Pig = 20,
    //% block="Sheep"         Sheep = 21,
    //% block="Cow"           Cow = 22,
    //% block="Chicken"       Chicken = 23,
    //% block="Wolf"          Wolf = 25,
    //% block="Horse"         Horse = 27,
    //% block="Cat"           Cat = 28,
    //% block="Villager"      Villager = 30,
    //% block="Iron Golem"    IronGolem = 31,
    //% block="Snow Golem"    SnowGolem = 32,
    //% block="Rabbit"        Rabbit = 34,
    //% block="Polar Bear"    PolarBear = 35,
    //% block="Fox"           Fox = 41,
    //% block="Panda"         Panda = 40,
    //% block="Dolphin"       Dolphin = 38,
    //% block="Squid"         Squid = 33
}

enum MCWeather {
    //% block="Clear"    Clear = 0,
    //% block="Rain"     Rain = 1,
    //% block="Thunder"  Thunder = 2,
    //% block="Snow"     Snow = 3
}

enum MCGameMode {
    //% block="Survival"   Survival = 0,
    //% block="Creative"   Creative = 1,
    //% block="Adventure"  Adventure = 2,
    //% block="Spectator"  Spectator = 3
}

enum MCEffect {
    //% block="Speed"           Speed = 1,
    //% block="Slowness"        Slowness = 2,
    //% block="Strength"        Strength = 5,
    //% block="Instant Health"  InstantHealth = 6,
    //% block="Jump Boost"      JumpBoost = 8,
    //% block="Regeneration"    Regeneration = 10,
    //% block="Fire Resistance" FireResistance = 12,
    //% block="Water Breathing" WaterBreathing = 13,
    //% block="Invisibility"    Invisibility = 14,
    //% block="Night Vision"    NightVision = 16,
    //% block="Weakness"        Weakness = 18,
    //% block="Poison"          Poison = 19,
    //% block="Absorption"      Absorption = 22,
    //% block="Levitation"      Levitation = 25,
    //% block="Luck"            Luck = 26,
    //% block="Slow Falling"    SlowFalling = 28
}

enum MCEnchant {
    //% block="Sharpness"    Sharpness = 0,
    //% block="Knockback"    Knockback = 3,
    //% block="Fire Aspect"  FireAspect = 4,
    //% block="Looting"      Looting = 5,
    //% block="Efficiency"   Efficiency = 6,
    //% block="Silk Touch"   SilkTouch = 7,
    //% block="Unbreaking"   Unbreaking = 8,
    //% block="Fortune"      Fortune = 9,
    //% block="Power"        Power = 10,
    //% block="Flame"        Flame = 12,
    //% block="Infinity"     Infinity = 13,
    //% block="Protection"   Protection = 14,
    //% block="Mending"      Mending = 23
}

enum MCDir {
    //% block="North"  North = 0,
    //% block="South"  South = 1,
    //% block="East"   East = 2,
    //% block="West"   West = 3,
    //% block="Up"     Up = 4,
    //% block="Down"   Down = 5
}

enum MCDim {
    //% block="Overworld"  Overworld = 0,
    //% block="Nether"     Nether = 1,
    //% block="The End"    TheEnd = 2
}

enum MCBiome {
    //% block="Plains"          Plains = 0,
    //% block="Forest"          Forest = 1,
    //% block="Jungle"          Jungle = 2,
    //% block="Desert"          Desert = 3,
    //% block="Savanna"         Savanna = 4,
    //% block="Swamp"           Swamp = 5,
    //% block="Taiga"           Taiga = 6,
    //% block="Snowy Tundra"    SnowyTundra = 7,
    //% block="Mountains"       Mountains = 8,
    //% block="Ocean"           Ocean = 10,
    //% block="Mushroom Island" MushroomIsland = 12,
    //% block="Nether"          NetherBiome = 13,
    //% block="The End"         EndBiome = 14
}

enum MCStructure {
    //% block="Village"          Village = 0,
    //% block="Temple"           Temple = 1,
    //% block="Dungeon"          Dungeon = 2,
    //% block="Stronghold"       Stronghold = 3,
    //% block="Mineshaft"        Mineshaft = 4,
    //% block="Ocean Monument"   OceanMonument = 5,
    //% block="Woodland Mansion" WoodlandMansion = 6,
    //% block="Nether Fortress"  NetherFortress = 10,
    //% block="End City"         EndCity = 11
}

enum MCArmorSlot {
    //% block="Helmet"      Helmet = 0,
    //% block="Chestplate"  Chestplate = 1,
    //% block="Leggings"    Leggings = 2,
    //% block="Boots"       Boots = 3
}

enum MCBehavior {
    //% block="Attack Player"  AttackPlayer = 0,
    //% block="Flee Player"    FleePlayer = 1,
    //% block="Wander"         Wander = 2,
    //% block="Stay Still"     StayStill = 3,
    //% block="Follow Player"  FollowPlayer = 4,
    //% block="Guard Area"     GuardArea = 5
}

enum MCTimePreset {
    //% block="Sunrise"   Sunrise = 0,
    //% block="Noon"      Noon = 6000,
    //% block="Sunset"    Sunset = 12000,
    //% block="Midnight"  Midnight = 18000
}
