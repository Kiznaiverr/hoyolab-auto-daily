const httpClient = require('../utils/httpClient');
const logger = require('../utils/logger');
const discord = require('../utils/discord');
const config = require('../utils/config');

class BaseGame {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        this.maxRetries = parseInt(process.env.MAX_RETRIES) || 3;
        this.retryDelay = parseInt(process.env.RETRY_DELAY) || 5000;
    }

    async checkIn(accountName, cookie) {
        try {
            logger.info(`Starting check-in for ${this.name} - Account: ${accountName}`);
            
            if (!this.validateCookie(cookie)) {
                throw new Error('Invalid cookie format');
            }

            const gameKey = this.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
            const accountInfo = config.getAccountInfo(accountName, gameKey);

            const signInfo = await this.getSignInfo(cookie);
            if (!signInfo.success) {
                throw new Error('Failed to get sign-in info');
            }

            if (signInfo.data.isSigned) {
                logger.info(`${this.name} - Account ${accountName}: Already signed in today`);
                await discord.notifyAlreadyChecked(accountName, this.name, accountInfo);
                
                return {
                    success: true,
                    alreadySigned: true,
                    message: 'Already signed in today',
                    totalDays: signInfo.data.total
                };
            }

            const awardsData = await this.getAwardsData(cookie);
            if (!awardsData.success) {
                throw new Error('Failed to get awards data');
            }

            // Perform sign-in
            const signResult = await this.performSignIn(cookie);
            if (!signResult.success) {
                throw new Error('Failed to perform sign-in');
            }

            const currentReward = awardsData.data[signInfo.data.total];
            logger.info(`${this.name} - Account ${accountName}: Check-in successful! Reward: ${currentReward.name} x${currentReward.cnt}`);

            await discord.notifySuccess(accountName, this.name, `${currentReward.name} x${currentReward.cnt}`, accountInfo);

            return {
                success: true,
                alreadySigned: false,
                message: 'Check-in successful',
                totalDays: signInfo.data.total + 1,
                reward: currentReward
            };

        } catch (error) {
            logger.error(`${this.name} - Account ${accountName}: Check-in failed: ${error.message}`);
            
            const gameKey = this.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
            const accountInfo = config.getAccountInfo(accountName, gameKey);
            
            await discord.notifyError(accountName, this.name, error.message, accountInfo);
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    async makeRequest(url, options = {}) {
        const config = {
            headers: {
                Cookie: options.cookie,
                ...options.headers
            },
            params: options.params,
            ...options
        };

        return httpClient.withRetry(async () => {
            if (options.method === 'POST') {
                return await httpClient.post(url, options.data || {}, config);
            } else {
                return await httpClient.get(url, config);
            }
        }, this.maxRetries, this.retryDelay);
    }

    validateCookie(cookie) {
        const requiredTokens = ['ltoken_v2', 'ltuid_v2', 'ltmid_v2'];
        return requiredTokens.every(token => cookie.includes(token));
    }

    // Abstract methods - to be implemented by game-specific classes
    async getSignInfo(cookie) {
        throw new Error('getSignInfo method must be implemented by game-specific class');
    }

    async getAwardsData(cookie) {
        throw new Error('getAwardsData method must be implemented by game-specific class');
    }

    async performSignIn(cookie) {
        throw new Error('performSignIn method must be implemented by game-specific class');
    }
}

module.exports = BaseGame;
