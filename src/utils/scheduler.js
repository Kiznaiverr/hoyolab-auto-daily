const cron = require('node-cron');
const logger = require('../utils/logger');
const config = require('../utils/config');
const gameManager = require('../games/GameManager');
const discord = require('../utils/discord');

class Scheduler {
    constructor() {
        this.jobs = [];
        this.isRunning = false;
    }

    start() {
        const schedule = process.env.CHECKIN_SCHEDULE || '5 0 * * *';
        logger.info(`Starting scheduler with cron pattern: ${schedule}`);

        // Validate cron pattern
        if (!cron.validate(schedule)) {
            logger.error('Invalid cron pattern provided');
            return;
        }

        const job = cron.schedule(schedule, async () => {
            await this.runCheckIn();
        }, {
            scheduled: false,
            timezone: "Asia/Jakarta"
        });

        this.jobs.push(job);
        job.start();
        
        logger.info('Scheduler started successfully');
    }

    async runCheckIn() {
        if (this.isRunning) {
            logger.warn('Check-in already running, skipping this execution');
            return;
        }

        this.isRunning = true;
        logger.info('Starting scheduled check-in for all accounts');

        try {
            const accounts = config.getAccounts();
            
            if (accounts.length === 0) {
                logger.warn('No accounts configured for check-in');
                return;
            }

            const results = {
                total: 0,
                successful: 0,
                failed: 0,
                alreadySigned: 0
            };

            const accountDelay = parseInt(process.env.ACCOUNT_DELAY) || 5000;

            for (let i = 0; i < accounts.length; i++) {
                const account = accounts[i];
                
                try {
                    logger.info(`Processing account: ${account.name}`);
                    
                    const accountResults = await gameManager.checkInAllGames(account.name, account.games);
                    
                    Object.entries(accountResults).forEach(([game, result]) => {
                        results.total++;
                        
                        if (result.success) {
                            if (result.alreadySigned) {
                                results.alreadySigned++;
                            } else {
                                results.successful++;
                            }
                        } else {
                            results.failed++;
                        }
                    });

                    // Add delay between accounts to avoid rate limiting (skip delay for last account)
                    if (i < accounts.length - 1) {
                        logger.info(`Waiting ${accountDelay}ms before processing next account...`);
                        await this.sleep(accountDelay);
                    }
                    
                } catch (error) {
                    logger.error(`Error processing account ${account.name}:`, error.message);
                    results.failed++;
                }
            }

            logger.info('Check-in completed:', {
                total: results.total,
                successful: results.successful,
                failed: results.failed,
                alreadySigned: results.alreadySigned
            });

        } catch (error) {
            logger.error('Error during scheduled check-in:', error.message);
        } finally {
            this.isRunning = false;
        }
    }

    // Method untuk check-in awal saat startup
    async runInitialCheckIn() {
        if (this.isRunning) {
            logger.warn('Check-in already running, skipping initial check-in');
            return;
        }

        this.isRunning = true;
        logger.info('Running initial check-in after startup');

        try {
            const accounts = config.getAccounts();
            
            if (accounts.length === 0) {
                logger.warn('No accounts configured for check-in');
                return;
            }

            let results = { total: 0, successful: 0, failed: 0, alreadySigned: 0 };
            const accountDelay = parseInt(process.env.ACCOUNT_DELAY) || 5000;

            for (let i = 0; i < accounts.length; i++) {
                const account = accounts[i];
                
                try {
                    logger.info(`Processing account: ${account.name}`);
                    
                    const accountResults = await gameManager.checkInAllGames(account.name, account.games);
                    
                    Object.entries(accountResults).forEach(([game, result]) => {
                        results.total++;
                        if (result.success) {
                            if (result.alreadySigned) {
                                results.alreadySigned++;
                            } else {
                                results.successful++;
                            }
                        } else {
                            results.failed++;
                        }
                    });

                    // Add delay between accounts to avoid rate limiting (skip delay for last account)
                    if (i < accounts.length - 1) {
                        logger.info(`Waiting ${accountDelay}ms before processing next account...`);
                        await this.sleep(accountDelay);
                    }
                    
                } catch (error) {
                    logger.error(`Error processing account ${account.name}:`, error.message);
                    results.failed++;
                }
            }

            logger.info('Initial check-in completed:', {
                total: results.total,
                successful: results.successful,
                failed: results.failed,
                alreadySigned: results.alreadySigned
            });

        } catch (error) {
            logger.error('Error during initial check-in:', error.message);
        } finally {
            this.isRunning = false;
        }
    }

    async runCheckInNow() {
        logger.info('Running manual check-in');
        await this.runCheckIn();
    }

    async runCheckInForAccount(accountName) {
        if (this.isRunning) {
            logger.warn('Check-in already running, please wait');
            return;
        }

        this.isRunning = true;
        logger.info(`Running check-in for account: ${accountName}`);

        try {
            const accounts = config.getAccounts();
            const account = accounts.find(acc => acc.name === accountName);
            
            if (!account) {
                logger.error(`Account ${accountName} not found`);
                return;
            }

            const results = await gameManager.checkInAllGames(account.name, account.games);
            
            Object.entries(results).forEach(([game, result]) => {
                if (result.success) {
                    if (result.alreadySigned) {
                        logger.info(`${game}: Already signed in (${result.totalDays} days)`);
                    } else {
                        logger.info(`${game}: Check-in successful! Reward: ${result.reward?.name} x${result.reward?.cnt} (${result.totalDays} days)`);
                    }
                } else {
                    logger.error(`${game}: Check-in failed - ${result.error}`);
                }
            });

        } catch (error) {
            logger.error(`Error during manual check-in for ${accountName}:`, error.message);
        } finally {
            this.isRunning = false;
        }
    }

    stop() {
        this.jobs.forEach(job => job.stop());
        this.jobs = [];
        logger.info('Scheduler stopped');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new Scheduler();
