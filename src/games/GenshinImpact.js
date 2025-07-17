const BaseGame = require('./BaseGame');

class GenshinImpact extends BaseGame {
    constructor() {
        super('Genshin Impact', {
            ACT_ID: 'e202102251931481',
            urls: {
                info: 'https://sg-hk4e-api.hoyolab.com/event/sol/info',
                home: 'https://sg-hk4e-api.hoyolab.com/event/sol/home',
                sign: 'https://sg-hk4e-api.hoyolab.com/event/sol/sign'
            },
            headers: {
                'x-rpc-signgame': 'hk4e'
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

module.exports = GenshinImpact;
