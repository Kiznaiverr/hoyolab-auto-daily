const axios = require('axios');

class DiscordNotifier {
    constructor() {
        this.webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    }

    // Mengirim notifikasi ke Discord webhook
    async sendNotification(title, description, color = 0x00ff00, fields = []) {
        if (!this.webhookUrl || this.webhookUrl === 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN') {
            console.log('[Discord] Webhook not configured, skipping notification');
            return;
        }

        try {
            const embed = {
                title: title,
                description: description,
                color: color,
                timestamp: new Date().toISOString(),
                fields: fields
            };

            const payload = {
                embeds: [embed]
            };

            await axios.post(this.webhookUrl, payload);
            console.log('[Discord] Notification sent successfully');
        } catch (error) {
            console.error('[Discord] Failed to send notification:', error.message);
        }
    }

    // Notifikasi sukses check-in
    async notifySuccess(accountName, gameName, reward, accountInfo = null) {
        const fields = [
            { name: 'Account', value: accountName, inline: true },
            { name: 'Game', value: gameName, inline: true },
            { name: 'Reward', value: reward || 'Daily reward claimed', inline: false }
        ];

        // Tambahkan info account jika tersedia (opsional)
        if (accountInfo) {
            if (accountInfo.uid) {
                fields.push({ name: 'UID', value: accountInfo.uid, inline: true });
            }
            if (accountInfo.username) {
                fields.push({ name: 'Username', value: accountInfo.username, inline: true });
            }
        }

        await this.sendNotification(
            '✅ Daily Check-in Success',
            `Check-in berhasil untuk ${gameName}`,
            0x00ff00, // Green
            fields
        );
    }

    // Notifikasi gagal check-in
    async notifyError(accountName, gameName, error, accountInfo = null) {
        const fields = [
            { name: 'Account', value: accountName, inline: true },
            { name: 'Game', value: gameName, inline: true },
            { name: 'Error', value: error, inline: false }
        ];

        // Tambahkan info account jika tersedia (opsional)
        if (accountInfo) {
            if (accountInfo.uid) {
                fields.push({ name: 'UID', value: accountInfo.uid, inline: true });
            }
            if (accountInfo.username) {
                fields.push({ name: 'Username', value: accountInfo.username, inline: true });
            }
        }

        await this.sendNotification(
            '❌ Daily Check-in Failed',
            `Check-in gagal untuk ${gameName}`,
            0xff0000, // Red
            fields
        );
    }

    // Notifikasi sudah check-in hari ini
    async notifyAlreadyChecked(accountName, gameName, accountInfo = null) {
        const fields = [
            { name: 'Account', value: accountName, inline: true },
            { name: 'Game', value: gameName, inline: true }
        ];

        // Tambahkan info account jika tersedia (opsional)
        if (accountInfo) {
            if (accountInfo.uid) {
                fields.push({ name: 'UID', value: accountInfo.uid, inline: true });
            }
            if (accountInfo.username) {
                fields.push({ name: 'Username', value: accountInfo.username, inline: true });
            }
        }

        await this.sendNotification(
            'ℹ️ Already Checked In',
            `Sudah check-in hari ini untuk ${gameName}`,
            0xffff00, // Yellow
            fields
        );
    }

    // Notifikasi rangkuman harian
    async notifyDailySummary(summary) {
        const { total, success, failed, alreadyChecked } = summary;
        
        await this.sendNotification(
            '📊 Daily Check-in Summary',
            `Rangkuman check-in harian`,
            0x0099ff, // Blue
            [
                { name: 'Total Games', value: total.toString(), inline: true },
                { name: 'Success', value: success.toString(), inline: true },
                { name: 'Failed', value: failed.toString(), inline: true },
                { name: 'Already Checked', value: alreadyChecked.toString(), inline: true }
            ]
        );
    }
}

module.exports = new DiscordNotifier();
