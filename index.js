require('dotenv').config();
const logger = require('./src/utils/logger');
const scheduler = require('./src/utils/scheduler');
const discord = require('./src/utils/discord');

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('SIGINT', () => {
    logger.info('Received SIGINT signal, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Received SIGTERM signal, shutting down gracefully...');
    process.exit(0);
});

async function main() {
    try {
        logger.info('Starting HoyoLab Auto Daily Check-in');
        
        const fs = require('fs');
        const path = require('path');
        const configPath = path.join(process.cwd(), 'config', 'accounts.json');
        
        if (!fs.existsSync(configPath)) {
            logger.error('Configuration file not found!');
            logger.error('Please copy config/accounts.example.json to config/accounts.json and configure your accounts');
            logger.error('Then create a .env file based on .env.example');
            process.exit(1);
        }

        await discord.notifyBotStarted();

        logger.info('Running initial check-in...');
        await scheduler.runInitialCheckIn();

        scheduler.start();
        logger.info('Auto check-in scheduler started successfully');
        logger.info('Bot is now running in background...');
        
    } catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}

main();
