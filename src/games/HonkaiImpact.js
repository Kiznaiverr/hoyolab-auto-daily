const BaseGame = require('./BaseGame');

class HonkaiImpact extends BaseGame {
    constructor() {
        super('Honkai Impact 3rd', {
            ACT_ID: 'e202110291205111',
            urls: {
                info: 'https://sg-public-api.hoyolab.com/event/mani/info',
                home: 'https://sg-public-api.hoyolab.com/event/mani/home',
                sign: 'https://sg-public-api.hoyolab.com/event/mani/sign'
            },
            headers: {
                // Honkai Impact doesn't use x-rpc-signgame header
            }
        });
    }

    async getSignInfo(cookie) {
        try {
            const response = await this.makeRequest(this.config.urls.info, {
                cookie,
                params: {
                    act_id: this.config.ACT_ID
                },
                headers: this.config.headers
            });

            if (response.status !== 200) {
                return { success: false, error: `HTTP ${response.status}` };
            }

            const data = response.data;
            if (data.retcode !== 0) {
                return { success: false, error: `API Error: ${data.message}` };
            }

            return {
                success: true,
                data: {
                    total: data.data.total_sign_day,
                    today: data.data.today,
                    isSigned: data.data.is_sign
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getAwardsData(cookie) {
        try {
            const response = await this.makeRequest(this.config.urls.home, {
                cookie,
                params: {
                    act_id: this.config.ACT_ID
                },
                headers: this.config.headers
            });

            if (response.status !== 200) {
                return { success: false, error: `HTTP ${response.status}` };
            }

            const data = response.data;
            if (data.retcode !== 0) {
                return { success: false, error: `API Error: ${data.message}` };
            }

            if (!data.data.awards || data.data.awards.length === 0) {
                return { success: false, error: 'No awards data available' };
            }

            return {
                success: true,
                data: data.data.awards
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async performSignIn(cookie) {
        try {
            const response = await this.makeRequest(this.config.urls.sign, {
                method: 'POST',
                cookie,
                params: {
                    act_id: this.config.ACT_ID
                },
                headers: this.config.headers
            });

            if (response.status !== 200) {
                return { success: false, error: `HTTP ${response.status}` };
            }

            const data = response.data;
            if (data.retcode !== 0) {
                return { success: false, error: `API Error: ${data.message}` };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = HonkaiImpact;
