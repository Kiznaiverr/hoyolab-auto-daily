# HoyoLab Auto Daily Check-in

🎮 Automated daily check-ins for HoyoLab games including Genshin Impact, Honkai Star Rail, Zenless Zone Zero, and more!

## Features

- ✅ **Multi-Game Support**: Genshin Impact, Honkai Star Rail, Zenless Zone Zero
- ✅ **Multi-Account Support**: Configure multiple accounts for each game
- ✅ **Automated Scheduling**: Set up cron jobs for automatic daily check-ins
- ✅ **Manual Check-ins**: Run check-ins manually when needed
- ✅ **Comprehensive Logging**: Detailed logs with multiple levels
- ✅ **Error Handling**: Retry mechanism and proper error handling
- ✅ **Interactive CLI**: User-friendly command-line interface
- ✅ **Cookie-based Authentication**: Secure authentication using HoyoLab cookies

## Quick Start

### 1. Installation

```bash
# Clone repository
git clone <repository-url>
cd hoyolab-auto-daily

# Install dependencies
npm install
```

### 2. Configuration

1. **Copy configuration files:**
   ```bash
   cp .env.example .env
   cp config/accounts.example.json config/accounts.json
   ```

2. **Get your HoyoLab cookies:**
   - Go to [HoyoLab](https://www.hoyolab.com/)
   - Login to your account
   - Open browser developer tools (F12)
   - Go to Network tab
   - Refresh the page
   - Find any request to `hoyolab.com`
   - Copy the `Cookie` header value

3. **Configure your HoyoLab cookie in `.env`:**
   ```bash
   # HoyoLab Cookie (sama untuk semua game HoYoverse)
   HOYOLAB_COOKIE=ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;
   ```

4. **Configure your accounts in `config/accounts.json`:**
   ```json
   [
     {
       "name": "My Account",
       "games": {
         "genshin": {
           "enabled": true
         },
         "honkai_star_rail": {
           "enabled": true
         },
         "zenless": {
           "enabled": false
         },
         "honkai_impact": {
           "enabled": false
         },
         "tears_of_themis": {
           "enabled": false
         }
       }
     }
   ]
   ```

5. **Adjust settings in `.env` (optional):**
   ```bash
   # Check-in schedule (cron format)
   CHECKIN_SCHEDULE=5 0 * * *  # Daily at 00:05
   
   # Retry settings
   MAX_RETRIES=3
   RETRY_DELAY=5000
   
   # Discord Webhook (untuk notifikasi)
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
   ```

### 3. Usage

#### Simple Run (Recommended)
```bash
npm start
# or
node index.js
```

The application will:
1. Validate configuration
2. Run initial check-in for today
3. Send Discord notification with results
4. Start automatic scheduler for daily check-ins
5. Run in background until stopped

#### Stop the Application
```bash
# Press Ctrl+C in the terminal where it's running
```

## Supported Games

| Game | Status | Check-in Rewards |
|------|--------|------------------|
| Genshin Impact | ✅ | Primogems, Mora, Materials |
| Honkai: Star Rail | ✅ | Stellar Jade, Credits, Materials |
| Zenless Zone Zero | ✅ | Polychrome, Dennies, Materials |
| Honkai Impact 3rd | 🚧 | Coming Soon |
| Tears of Themis | 🚧 | Coming Soon |

## Features

- ✅ **Automatic Startup**: Run once and it handles everything automatically
- ✅ **Initial Check-in**: Performs check-in immediately on startup
- ✅ **Discord Notifications**: Real-time notifications for all check-in activities
- ✅ **Background Operation**: Runs continuously in background
- ✅ **Error Handling**: Comprehensive error handling and recovery
- ✅ **Multiple Accounts**: Support for multiple HoyoLab accounts

## Configuration

### Environment Variables (.env)

```bash
# Check-in Schedule (cron format: minute hour day month weekday)
CHECKIN_SCHEDULE=5 0 * * *

# Retry settings
MAX_RETRIES=3
RETRY_DELAY=5000

# HTTP timeout (milliseconds)
HTTP_TIMEOUT=30000

# Discord Webhook untuk notifikasi
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# HoyoLab Cookie
HOYOLAB_COOKIE=ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;
```

### Cron Schedule Examples

- `5 0 * * *` - Every day at 00:05 (5 minutes past midnight)
- `0 9 * * *` - Every day at 9:00 AM
- `30 8 * * *` - Every day at 8:30 AM
- `0 */6 * * *` - Every 6 hours

### Account Configuration

The `config/accounts.json` file supports multiple accounts and games. Since all HoYoverse games use the same HoyoLab cookie, you only need to configure the cookie once in the `.env` file:

**Environment Variables (.env):**
```bash
# HoyoLab Cookie (sama untuk semua game HoYoverse)
HOYOLAB_COOKIE=ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;
```

**Account Configuration (config/accounts.json):**
```json
[
  {
    "name": "Main Account",
    "games": {
      "genshin": {
        "enabled": true
      },
      "honkai_star_rail": {
        "enabled": true
      },
      "zenless": {
        "enabled": false
      },
      "honkai_impact": {
        "enabled": false
      },
      "tears_of_themis": {
        "enabled": false
      }
    }
  },
  {
    "name": "Alt Account",
    "games": {
      "genshin": {
        "enabled": true
      },
      "honkai_star_rail": {
        "enabled": false
      }
    }
  }
]
```

## How to Get Cookies

1. **Go to HoyoLab**: Visit [https://www.hoyolab.com/](https://www.hoyolab.com/)
2. **Login**: Sign in with your HoYoverse account
3. **Open Developer Tools**: Press F12 or right-click → Inspect
4. **Go to Network Tab**: Click on the Network tab
5. **Refresh Page**: Refresh the page while keeping developer tools open
6. **Find Request**: Look for any request to `hoyolab.com` domains
7. **Copy Cookie**: Click on the request → Headers → Request Headers → Copy the entire `Cookie` value

### Required Cookie Values

Your cookie must contain these values:
- `ltoken_v2` - Login token
- `ltuid_v2` - User ID
- `ltmid_v2` - Machine ID

## Logging

Logs are saved in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

Console output is colorized for better readability.

## Troubleshooting

### Common Issues

1. **Invalid Cookie Error**
   - Make sure your cookie contains `ltoken_v2`, `ltuid_v2`, and `ltmid_v2`
   - Try getting a fresh cookie from HoyoLab

2. **Network Errors**
   - Check your internet connection
   - The application will automatically retry failed requests

3. **Already Signed In**
   - This is normal if you've already checked in for the day
   - Check-ins reset daily at server time

4. **Configuration Not Found**
   - Make sure you've copied `accounts.example.json` to `accounts.json`
   - Ensure the file is properly formatted JSON

### Debug Mode

Enable debug logging to see detailed request information:

```bash
# In .env file
LOG_LEVEL=debug
DEBUG=true
```

## Security

- **Cookie Storage**: Cookies are stored locally in your configuration file
- **No Data Collection**: This application doesn't send data anywhere except to official HoyoLab APIs
- **Open Source**: All code is visible and auditable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is not affiliated with HoYoverse. Use at your own risk. The developers are not responsible for any account issues that may arise from using this tool.

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the logs for error details
3. Create an issue with detailed information

---

**Happy gaming! 🎮**
