// test.ts — Example usage of the Minecraft extension

Minecraft.onGameStart(() => {
    Minecraft.setWorldName("Survival Island")
    Minecraft.setTimeOfDay(MCTimePreset.Sunrise)
    Minecraft.setWeather(MCWeather.Clear)
    Minecraft.setPlayerName("Steve")
    Minecraft.setGameMode(MCGameMode.Survival)
    Minecraft.setHealth(20)
    Minecraft.setHunger(20)
    Minecraft.giveStarterKit()
    Minecraft.buildSpawnPlatform(0, 63, 0)
    Minecraft.showTitle("Welcome!", "Survive the night...")
})

Minecraft.onNighttime(() => {
    Minecraft.startMobWave(1)
})

Minecraft.onPlayerDied(() => {
    Minecraft.showDeathScreen()
    Minecraft.runAfter(2000, () => {
        Minecraft.setHealth(20)
        Minecraft.setHunger(20)
        Minecraft.teleport(0, 65, 0)
        Minecraft.broadcast("Steve respawned!")
    })
})

Minecraft.onAllEliminated(MCMob.Zombie, () => {
    Minecraft.showTitle("Wave Clear!", "Zombies defeated")
    Minecraft.addScore(500)
    Minecraft.addXP(100)
})

Minecraft.onReachesLevel(10, () => {
    Minecraft.showTitle("Level 10!", "Power Surge!")
    Minecraft.applyEffect(MCEffect.Strength, 60, 2)
    Minecraft.giveDiamondArmor()
})

Minecraft.onLowHealth(5, () => {
    Minecraft.showActionBar("⚠️ Low health!")
    Minecraft.applyEffect(MCEffect.Regeneration, 10, 1)
})

Minecraft.registerRecipe(MCItem.GoldenApple, MCItem.Apple, MCItem.GoldIngot)
