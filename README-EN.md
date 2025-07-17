# HoyoLab Auto Daily Check-in

🎮 Automated daily check-in for HoyoLab games including Genshin Impact, Honkai Star Rail, Zenless Zone Zero, and more!

*English | [Bahasa Indonesia](README.md)*

## 📚 Table of Contents

- [Features](#features)
- [Quick Guide](#quick-guide)
  - [1. Installation](#1-installation)
  - [2. Configuration](#2-configuration)
  - [3. Usage](#3-usage)
- [Supported Games](#supported-games)
- [Main Features](#main-features)
- [Configuration](#configuration)
  - [Environment Variables (.env)](#environment-variables-env)
  - [Cron Schedule Examples](#cron-schedule-examples)
  - [Account Configuration](#account-configuration)
- [How to Get Cookies](#how-to-get-cookies)
  - [Required Cookie Values](#required-cookie-values)
- [Game Regions](#game-regions)
  - [Genshin Impact](#genshin-impact)
  - [Honkai Star Rail](#honkai-star-rail)
  - [Zenless Zone Zero](#zenless-zone-zero)
- [Security](#security)
- [License](#license)
- [Disclaimer](#disclaimer)
- [Support](#support)

## Features

- ✅ **Multi-Game Support**: Genshin Impact, Honkai Star Rail, Zenless Zone Zero
- ✅ **Multi-Account Support**: Configure multiple accounts for each game
- ✅ **Automatic Scheduling**: Setup cron jobs for automated daily check-ins
- ✅ **Manual Check-in**: Run manual check-ins whenever needed
- ✅ **Discord Notifications**: Real-time notifications for all check-in activities
- ✅ **Comprehensive Error Handling**: Retry mechanisms and comprehensive error handling
- ✅ **Cookie Authentication**: Secure authentication using HoyoLab cookies

## Quick Guide

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

2. **Get your HoyoLab cookie:**
   - Go to [HoyoLab](https://www.hoyolab.com/)
   - Login to your account
   - Go to your profile page
   - Open browser developer tools (F12)
   - Go to Network tab
   - Refresh the page
   - Find request named getGameRecordCard
   - Copy the `Cookie` header value

3. **Configure your HoyoLab cookie in `.env`:**
   ```bash
   # HoyoLab Cookie (same for all HoYoverse games)
   HOYOLAB_COOKIE=ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;
   ```

4. **Configure your accounts in `config/accounts.json`:**
   ```json
   [
     {
       "name": "My Account",
       "games": {
         "genshin": {
           "enabled": true,
           "uid": "123456789",
           "username": "TravelerMain"
         },
         "honkai_star_rail": {
           "enabled": true,
           "uid": "987654321",
           "username": "TrailblazerMain"
         },
         "zenless": {
           "enabled": false,
           "uid": "",
           "username": ""
         },
         "honkai_impact": {
           "enabled": false,
           "uid": "",
           "username": ""
         },
         "tears_of_themis": {
           "enabled": false,
           "uid": "",
           "username": ""
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
   
   # Discord Webhook (for notifications)
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

#### Stop Application
```bash
# Press Ctrl+C in the terminal where the application is running
```

## Supported Games

| Game | Status | Check-in Rewards |
|------|--------|------------------|
| Genshin Impact | ✅ | Primogem, Mora, Materials |
| Honkai: Star Rail | ✅ | Stellar Jade, Credit, Materials |
| Zenless Zone Zero | ✅ | Polychrome, Dennies, Materials |
| Honkai Impact 3rd | 🚧 | Coming Soon |
| Tears of Themis | 🚧 | Coming Soon |

## Main Features

- ✅ **Auto Startup**: Run and forget
- ✅ **Initial Check-in**: Auto check-in on startup
- ✅ **Discord Notifications**: Real-time notifications for all check-in activities
- ✅ **Background Operation**: Runs continuously in background
- ✅ **Multiple Accounts**: Support for multiple HoyoLab accounts

## Configuration

### Environment Variables (.env)

```bash
# Check-in Schedule (cron format: minute hour day month day_of_week)
CHECKIN_SCHEDULE=5 0 * * *

# Retry settings
MAX_RETRIES=3
RETRY_DELAY=5000

# HTTP timeout (milliseconds)
HTTP_TIMEOUT=30000

# Discord Webhook for notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# HoyoLab Cookie
HOYOLAB_COOKIE=ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;
```

### Cron Schedule Examples

- `5 0 * * *` - Daily at 00:05 (5 minutes after midnight)
- `0 9 * * *` - Daily at 9:00 AM
- `30 8 * * *` - Daily at 8:30 AM
- `0 */6 * * *` - Every 6 hours

### Account Configuration

The `config/accounts.json` file supports multiple accounts and games. Since all HoYoverse games use the same HoyoLab cookie, you only need to configure the cookie once in the `.env` file:

**Environment Variables (.env):**
```bash
# HoyoLab Cookie (same for all HoYoverse games)
HOYOLAB_COOKIE=ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;
```

**Account Configuration (config/accounts.json):**
```json
[
  {
    "name": "Main Account",
    "games": {
      "genshin": {
        "enabled": true,
        "uid": "123456789",
        "username": "TravelerMain"
      },
      "honkai_star_rail": {
        "enabled": true,
        "uid": "987654321",
        "username": "TrailblazerMain"
      },
      "zenless": {
        "enabled": false,
        "uid": "",
        "username": ""
      },
      "honkai_impact": {
        "enabled": false,
        "uid": "",
        "username": ""
      },
      "tears_of_themis": {
        "enabled": false,
        "uid": "",
        "username": ""
      }
    }
  },
  {
    "name": "Alt Account",
    "games": {
      "genshin": {
        "enabled": true,
        "uid": "555666777",
        "username": "TravelerAlt"
      },
      "honkai_star_rail": {
        "enabled": false,
        "uid": "",
        "username": ""
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
5. **Go to Game Profile**: Visit your game profile page on HoyoLab
   - For Genshin Impact: Go to your Genshin Impact profile page
   - For Honkai Star Rail: Go to your Honkai Star Rail profile page
   - For other games: Go to the respective game profile page
6. **Find Request**: Look for request containing `getGameRecordCard` in the Name/URL column
   - This request will appear automatically when the profile page loads your game data
7. **Copy Cookie**: Click on the `getGameRecordCard` request → Headers → Request Headers → Copy the entire `Cookie` value

### Required Cookie Values

Your cookie must contain these values:
- `ltoken_v2` - Login token
- `ltuid_v2` - User ID
- `ltmid_v2` - Machine ID

## Game Regions

### Genshin Impact
- `os_usa` - America
- `os_euro` - Europe
- `os_asia` - Asia
- `os_cht` - TW/HK/MO

### Honkai Star Rail
- `prod_official_usa` - America
- `prod_official_eur` - Europe  
- `prod_official_asia` - Asia
- `prod_official_cht` - TW/HK/MO

### Zenless Zone Zero
- `prod_gf_us` - America
- `prod_gf_eu` - Europe
- `prod_gf_jp` - Asia
- `prod_gf_sg` - Southeast Asia

## Security

- **Cookie Storage**: Cookies are stored locally in your configuration files
- **No Data Collection**: This application doesn't send data anywhere except to official HoyoLab APIs
- **Open Source**: All code can be viewed and audited

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is not affiliated with HoYoverse. Use at your own risk. The developer is not responsible for any account issues that may arise from using this tool.

## Support

If you encounter issues or have questions:
1. Review logs for error details
2. Create an issue with detailed information

---
