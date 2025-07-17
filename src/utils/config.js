const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class ConfigManager {
    constructor() {
        this.accounts = [];
        this.configPath = path.join(process.cwd(), 'config', 'accounts.json');
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (!fs.existsSync(this.configPath)) {
                logger.warn('Config file not found. Please copy accounts.example.json to accounts.json and configure your accounts.');
                return;
            }

            const configData = fs.readFileSync(this.configPath, 'utf8');
            const config = JSON.parse(configData);
            
            this.accounts = config.accounts || [];
            logger.info(`Loaded configuration for ${this.accounts.length} account(s)`);
            
            // Validate configuration
            this.validateConfig();
        } catch (error) {
            logger.error('Failed to load configuration:', error.message);
            process.exit(1);
        }
    }

    validateConfig() {
        const hoyolabCookie = process.env.HOYOLAB_COOKIE;
        if (!hoyolabCookie || hoyolabCookie === 'ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;') {
            logger.warn('HOYOLAB_COOKIE not configured in .env file. Please add your HoyoLab cookie.');
            return;
        }

        if (!this.validateCookie(hoyolabCookie)) {
            logger.error('Invalid HOYOLAB_COOKIE format. Cookie must contain ltoken_v2, ltuid_v2, and ltmid_v2');
            return;
        }

        if (this.accounts.length === 0) {
            logger.warn('No accounts configured');
            return;
        }

        this.accounts.forEach((account, index) => {
            if (!account.name) {
                logger.warn(`Account ${index + 1} has no name`);
            }

            if (!account.games) {
                logger.warn(`Account ${index + 1} has no games configured`);
                return;
            }

            Object.keys(account.games).forEach(game => {
                const gameConfig = account.games[game];
                if (gameConfig.enabled === undefined) {
                    logger.warn(`Account "${account.name}" has ${game} without enabled status`);
                }
            });
        });
    }

    getAccounts() {
        return this.accounts;
    }

    getEnabledGames(accountName) {
        const account = this.accounts.find(acc => acc.name === accountName);
        if (!account) return [];

        return Object.keys(account.games).filter(game => account.games[game].enabled);
    }

    getCookie(accountName, game) {
        const account = this.accounts.find(acc => acc.name === accountName);
        if (!account || !account.games[game] || !account.games[game].enabled) {
            return null;
        }

        return process.env.HOYOLAB_COOKIE;
    }

    // Mengambil informasi account untuk game tertentu (opsional)
    getAccountInfo(accountName, gameName) {
        const account = this.accounts.find(acc => acc.name === accountName);
        if (!account || !account.games || !account.games[gameName]) {
            return null;
        }
        
        const gameInfo = account.games[gameName];
        return {
            uid: gameInfo.uid || null,
            username: gameInfo.username || null,
            enabled: gameInfo.enabled || false
        };
    }

    parseCookie(cookieString) {
        const cookies = {};
        if (!cookieString) return cookies;

        cookieString.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
                cookies[key] = value;
            }
        });

        return cookies;
    }

    validateCookie(cookieString) {
        const cookies = this.parseCookie(cookieString);
        const requiredKeys = ['ltoken_v2', 'ltuid_v2', 'ltmid_v2'];
        
        return requiredKeys.every(key => cookies[key]);
    }
}

module.exports = new ConfigManager();
