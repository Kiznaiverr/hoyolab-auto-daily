const axios = require('axios');

class DiscordNotifier {
    constructor() {
        this.webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    }

    // Mengirim notifikasi ke Discord webhook
    async sendNotification(embed) {
        if (!this.webhookUrl || this.webhookUrl === 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN') {
            console.log('[Discord] Webhook not configured, skipping notification');
            return;
        }

        try {
            const payload = {
                embeds: [embed]
            };

            await axios.post(this.webhookUrl, payload);
            console.log('[Discord] Notification sent successfully');
        } catch (error) {
            console.error('[Discord] Failed to send notification:', error.message);
        }
    }

    async notifyBotStarted() {
        const embed = {
            color: 0x00ff00, // Green
            title: "HoyoLab Auto Check-in Bot Started",
            description: "Bot berhasil dijalankan dan siap melakukan check-in harian",
            timestamp: new Date().toISOString()
        };

        await this.sendNotification(embed);
    }

    async notifySuccess(accountName, gameName, reward = null, accountInfo = null, totalDays = 0) {
        const gameColors = {
            'Genshin Impact': 0x4FC3F7,
            'Honkai Star Rail': 0xFFD700,
            'Zenless Zone Zero': 0xFF6B35,
            'Honkai Impact 3rd': 0x8E24AA,
            'Tears of Themis': 0xE91E63
        };

        const fields = [
            {
                name: "Game",
                value: gameName,
                inline: true
            },
            {
                name: "Akun",
                value: accountName,
                inline: true
            }
        ];

        if (accountInfo && accountInfo.uid) {
            fields.push({
                name: "UID",
                value: accountInfo.uid,
                inline: true
            });
        }

        if (accountInfo && accountInfo.username) {
            fields.push({
                name: "Username",
                value: accountInfo.username,
                inline: true
            });
        }

        if (totalDays > 0) {
            fields.push({
                name: "Total Check-in",
                value: totalDays.toString(),
                inline: true
            });
        }

        if (reward) {
            fields.push({
                name: "Reward Hari Ini",
                value: `${reward.name} x${reward.count}`,
                inline: false
            });
        }

        const embed = {
            color: gameColors[gameName] || 0x00ff00,
            title: "Check-in Berhasil!",
            fields: fields,
            timestamp: new Date().toISOString()
        };

        if (reward && reward.icon) {
            embed.thumbnail = {
                url: reward.icon
            };
        }

        await this.sendNotification(embed);
    }

    async notifyError(accountName, gameName, error, accountInfo = null) {
        const fields = [
            {
                name: "Game",
                value: gameName,
                inline: true
            },
            {
                name: "Akun",
                value: accountName,
                inline: true
            },
            {
                name: "Error",
                value: error,
                inline: false
            }
        ];

        if (accountInfo && accountInfo.uid) {
            fields.push({
                name: "UID",
                value: accountInfo.uid,
                inline: true
            });
        }

        const embed = {
            color: 0xff0000, // Red
            title: "Check-in Gagal!",
            fields: fields,
            timestamp: new Date().toISOString()
        };

        await this.sendNotification(embed);
    }
}

module.exports = new DiscordNotifier();
