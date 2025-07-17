const GenshinImpact = require('./GenshinImpact');
const HonkaiStarRail = require('./HonkaiStarRail');
const ZenlessZoneZero = require('./ZenlessZoneZero');
const HonkaiImpact = require('./HonkaiImpact');
const TearsOfThemis = require('./TearsOfThemis');
const logger = require('../utils/logger');
const config = require('../utils/config');

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

    async checkInAllGames(accountName, gameConfigs) {
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

            // Ambil cookie untuk akun ini
            const cookie = config.getCookie(accountName, gameName);
            if (!cookie) {
                logger.warn(`Cookie tidak ditemukan untuk ${accountName} - ${gameName}`);
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

        return results;
    }

    async checkInSingleGame(accountName, gameName) {
        const game = this.getGame(gameName);
        if (!game) {
            throw new Error(`Unknown game: ${gameName}`);
        }

        // Ambil cookie untuk akun ini
        const cookie = config.getCookie(accountName, gameName);
        if (!cookie) {
            throw new Error(`Cookie tidak ditemukan untuk ${accountName} - ${gameName}`);
        }

        return await game.checkIn(accountName, cookie);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new GameManager();
