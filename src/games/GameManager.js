const GenshinImpact = require('./GenshinImpact');
const HonkaiStarRail = require('./HonkaiStarRail');
const ZenlessZoneZero = require('./ZenlessZoneZero');
const HonkaiImpact = require('./HonkaiImpact');
const TearsOfThemis = require('./TearsOfThemis');
const logger = require('../utils/logger');
const discord = require('../utils/discord');

class GameManager {
    constructor() {
        this.games = {
            genshin: new GenshinImpact(),
            starrail: new HonkaiStarRail(),
            zenless: new ZenlessZoneZero(),
            honkai: new HonkaiImpact(),
            tots: new TearsOfThemis()
        };
    }

    getGame(gameName) {
        return this.games[gameName];
    }

    getAllGames() {
        return this.games;
    }

    getSupportedGames() {
        return Object.keys(this.games);
    }

    async checkInAllGames(accountName, gameConfigs, cookie) {
        const results = {};
        let summary = { total: 0, success: 0, failed: 0, alreadyChecked: 0 };
        
        for (const [gameName, gameConfig] of Object.entries(gameConfigs)) {
            if (!gameConfig.enabled) {
                continue;
            }

            const game = this.getGame(gameName);
            if (!game) {
                logger.warn(`Unknown game: ${gameName}`);
                continue;
            }

            try {
                summary.total++;
                const result = await game.checkIn(accountName, cookie);
                results[gameName] = result;
                
                // Update summary
                if (result.success) {
                    if (result.alreadySigned) {
                        summary.alreadyChecked++;
                    } else {
                        summary.success++;
                    }
                } else {
                    summary.failed++;
                }
                
                // Add delay between games to avoid rate limiting
                await this.sleep(2000);
            } catch (error) {
                logger.error(`Error checking in ${gameName} for ${accountName}:`, error.message);
                summary.total++;
                summary.failed++;
                results[gameName] = {
                    success: false,
                    error: error.message
                };
            }
        }

        if (summary.total > 0) {
            await discord.notifyDailySummary(summary);
        }

        return results;
    }

    async checkInSingleGame(accountName, gameName, cookie) {
        const game = this.getGame(gameName);
        if (!game) {
            throw new Error(`Unknown game: ${gameName}`);
        }

        return await game.checkIn(accountName, cookie);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new GameManager();
