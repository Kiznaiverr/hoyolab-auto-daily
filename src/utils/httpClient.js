const axios = require('axios');
const logger = require('./logger');

class HttpClient {
    constructor() {
        this.client = axios.create({
            timeout: parseInt(process.env.HTTP_TIMEOUT) || 30000,
            headers: {
                'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'id-id,id;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Origin': 'https://act.hoyolab.com',
                'Referer': 'https://act.hoyolab.com/',
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="131", "Google Chrome";v="131"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'x-rpc-app_version': '1.5.0',
                'x-rpc-client_type': '5',
                'x-rpc-language': 'id-id'
            }
        });

        this.client.interceptors.request.use(
            (config) => {
                logger.debug(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
                return config;
            },
            (error) => {
                logger.error('Request error:', error.message);
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => {
                logger.debug(`Received response from ${response.config.url}: ${response.status}`);
                return response;
            },
            (error) => {
                if (error.response) {
                    logger.error(`HTTP Error ${error.response.status}: ${error.response.statusText}`);
                } else if (error.request) {
                    logger.error('Network error: No response received');
                } else {
                    logger.error('Request setup error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    async get(url, config = {}) {
        return this.client.get(url, config);
    }

    async post(url, data = {}, config = {}) {
        return this.client.post(url, data, config);
    }

    async withRetry(operation, maxRetries = 3, delay = 5000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                logger.warn(`Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
                
                if (attempt < maxRetries) {
                    logger.info(`Retrying in ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }
        
        throw lastError;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new HttpClient();
