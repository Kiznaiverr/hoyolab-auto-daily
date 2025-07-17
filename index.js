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

        // Validasi environment variables
        if (!process.env.HOYOLAB_COOKIE) {
            logger.error('HOYOLAB_COOKIE not found in .env file');
            process.exit(1);
        }

        // Kirim notifikasi bahwa bot telah dimulai
        await discord.sendNotification(
            '🚀 HoyoLab Auto Check-in Started',
            'Bot telah berhasil dijalankan dan siap melakukan auto check-in harian',
            0x00ff00 // Green
        );

        // Jalankan check-in pertama kali
        logger.info('Running initial check-in...');
        await scheduler.runInitialCheckIn();

        // Start scheduler untuk check-in otomatis harian
        scheduler.start();
        logger.info('Auto check-in scheduler started successfully');
        logger.info('Bot is now running in background...');
        
    } catch (error) {
        logger.error('Failed to start application:', error);
        await discord.sendNotification(
            '❌ HoyoLab Auto Check-in Failed to Start',
            `Error: ${error.message}`,
            0xff0000 // Red
        );
        process.exit(1);
    }
}

// Langsung jalankan aplikasi tanpa CLI
main();
