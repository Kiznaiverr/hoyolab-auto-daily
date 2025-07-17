const fs = require('fs');
const path = require('path');
const logger = require('./logger');
require('dotenv').config();

class ConfigManager {
    constructor() {
        this.accounts = [];
        this.configPath = path.join(process.cwd(), 'config', 'accounts.json');
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (!fs.existsSync(this.configPath)) {
                logger.warn('File konfigurasi tidak ditemukan. Salin accounts.example.json ke accounts.json dan konfigurasi akun Anda.');
                return;
            }

            const configData = fs.readFileSync(this.configPath, 'utf8');
            const config = JSON.parse(configData);
            
            this.accounts = config.accounts || [];
            logger.info(`Konfigurasi berhasil dimuat untuk ${this.accounts.length} akun`);
            
            // Validasi konfigurasi
            this.validateConfig();
        } catch (error) {
            logger.error('Gagal memuat konfigurasi:', error.message);
            process.exit(1);
        }
    }

    validateConfig() {
        if (this.accounts.length === 0) {
            logger.warn('Tidak ada akun yang dikonfigurasi');
            return;
        }

        this.accounts.forEach((account, index) => {
            if (!account.name) {
                logger.warn(`Akun ${index + 1} tidak memiliki nama`);
            }

            // Validasi cookie untuk setiap akun
            if (!account.cookie || account.cookie === 'your_cookie_here') {
                logger.warn(`Akun "${account.name}" tidak memiliki cookie yang valid`);
                return;
            }

            if (!this.validateCookie(account.cookie)) {
                logger.error(`Akun "${account.name}" memiliki format cookie yang tidak valid. Cookie harus mengandung ltoken_v2, ltuid_v2, dan ltmid_v2`);
                return;
            }

            if (!account.games) {
                logger.warn(`Akun ${index + 1} tidak memiliki konfigurasi game`);
                return;
            }

            Object.keys(account.games).forEach(game => {
                const gameConfig = account.games[game];
                if (gameConfig.enabled === undefined) {
                    logger.warn(`Akun "${account.name}" memiliki ${game} tanpa status enabled`);
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

        return account.cookie;
    }

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
