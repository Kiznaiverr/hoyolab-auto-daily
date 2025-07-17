class Logger {
    info(message, ...args) {
        console.log(`[INFO] ${message}`, ...args);
    }

    warn(message, ...args) {
        console.warn(`[WARN] ${message}`, ...args);
    }

    error(message, ...args) {
        console.error(`[ERROR] ${message}`, ...args);
    }

    debug(message, ...args) {
        console.log(`[DEBUG] ${message}`, ...args);
    }
}

module.exports = new Logger();
