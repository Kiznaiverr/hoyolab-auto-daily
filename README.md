# HoyoLab Auto Daily Check-in

🎮 Check-in harian otomatis untuk game HoyoLab termasuk Genshin Impact, Honkai Star Rail, Zenless Zone Zero, dan lainnya!

*[English](README-EN.md) | Bahasa Indonesia*

## 📚 Daftar Isi

- [Fitur](#fitur)
- [Panduan Cepat](#panduan-cepat)
  - [1. Instalasi](#1-instalasi)
  - [2. Konfigurasi](#2-konfigurasi)
  - [3. Penggunaan](#3-penggunaan)
- [Game yang Didukung](#game-yang-didukung)
- [Fitur Utama](#fitur-utama)
- [Konfigurasi](#konfigurasi)
  - [Variabel Environment (.env)](#variabel-environment-env)
  - [Contoh Jadwal Cron](#contoh-jadwal-cron)
  - [Konfigurasi Akun](#konfigurasi-akun)
- [Cara Mendapatkan Cookie](#cara-mendapatkan-cookie)
  - [Nilai Cookie yang Diperlukan](#nilai-cookie-yang-diperlukan)
- [Region Game](#region-game)
  - [Genshin Impact](#genshin-impact)
  - [Honkai Star Rail](#honkai-star-rail)
  - [Zenless Zone Zero](#zenless-zone-zero)
- [Keamanan](#keamanan)
- [Lisensi](#lisensi)
- [Disclaimer](#disclaimer)
- [Support](#support)

## Fitur

- ✅ **Dukungan Multi-Game**: Genshin Impact, Honkai Star Rail, Zenless Zone Zero
- ✅ **Dukungan Multi-Account**: Support beberapa akun dengan cookie yang berbeda
- ✅ **Cookie Individual**: Setiap akun dapat menggunakan cookie HoyoLab yang berbeda
- ✅ **Rate Limiting**: Delay otomatis 5 detik antar akun untuk menghindari spam
- ✅ **Penjadwalan Otomatis**: Setup cron job untuk check-in harian otomatis
- ✅ **Check-in Manual**: Jalankan check-in manual kapan saja diperlukan
- ✅ **Notifikasi Discord**: Notifikasi real-time untuk semua aktivitas check-in
- ✅ **Penanganan Error**: Mekanisme retry dan penanganan error yang komprehensif
- ✅ **Autentikasi Cookie**: Autentikasi aman menggunakan cookie HoyoLab

## Panduan Cepat

### 1. Instalasi

```bash
# Clone repository
git clone <repository-url>
cd hoyolab-auto-daily

# Install dependencies
npm install
```

### 2. Konfigurasi

1. **Salin file konfigurasi:**
   ```bash
   cp .env.example .env
   cp config/accounts.example.json config/accounts.json
   ```

2. **Dapatkan cookie HoyoLab Anda:**
   - Pergi ke [HoyoLab](https://www.hoyolab.com/)
   - Login ke akunmu
   - pergi ke page profile
   - Buka browser developer tools (F12)
   - Pergi ke tab Network
   - Refresh halaman
   - Cari request dengan nama getGameRecordCard
   - Salin nilai `Cookie` header

3. **Konfigurasi environment variables di `.env`:**
   ```bash
   # Jadwal check-in (format cron)
   CHECKIN_SCHEDULE=5 0 * * *
   
   # Discord webhook untuk notifikasi
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
   
   # Delay antar akun (5 detik)
   ACCOUNT_DELAY=5000
   ```

4. **Konfigurasi akun di `config/accounts.json`:**
   ```json
   {
     "accounts": [
       {
         "name": "Akun Utama",
         "cookie": "ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;",
         "games": {
           "genshin": {
             "enabled": true,
             "uid": "123456789",
             "username": "TravelerMain"
           },
           "starrail": {
             "enabled": true,
             "uid": "987654321",
             "username": "TrailblazerMain"
           },
           "zenless": {
             "enabled": false,
             "uid": "",
             "username": ""
           }
         }
       },
       {
         "name": "Akun Kedua",
         "cookie": "ltoken_v2=second_ltoken_v2; ltuid_v2=second_ltuid_v2; ltmid_v2=second_ltmid_v2;",
         "games": {
           "genshin": {
             "enabled": false,
             "uid": "",
             "username": ""
           },
           "starrail": {
             "enabled": true,
             "uid": "111222333",
             "username": "SecondAccount"
           }
         }
       }
     ]
   }

5. **Sesuaikan pengaturan di `.env` (opsional):**
   ```bash
   # Jadwal check-in (format cron)
   CHECKIN_SCHEDULE=5 0 * * *  # Harian pada jam 00:05
   
   # Pengaturan retry
   MAX_RETRIES=3
   RETRY_DELAY=5000
   
   # Discord Webhook (untuk notifikasi)
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
   ```

### 3. Penggunaan

#### Jalankan Sederhana (Direkomendasikan)
```bash
npm start
# atau
node index.js
```

Aplikasi akan:
1. Validasi konfigurasi
2. Jalankan check-in awal untuk hari ini
3. Kirim notifikasi Discord dengan hasil
4. Mulai scheduler otomatis untuk check-in harian
5. Berjalan di background hingga dihentikan

#### Hentikan Aplikasi
```bash
# Tekan Ctrl+C di terminal tempat aplikasi berjalan
```

## Game yang Didukung

| Game | Status | Reward Check-in |
|------|--------|------------------|
| Genshin Impact | ✅ | Primogem, Mora, Material |
| Honkai: Star Rail | ✅ | Stellar Jade, Credit, Material |
| Zenless Zone Zero | ✅ | Polychrome, Dennies, Material |
| Honkai Impact 3rd | 🚧 | Segera Hadir |
| Tears of Themis | 🚧 | Segera Hadir |

## Fitur Utama

- ✅ **Startup Otomatis**: Run and forget
- ✅ **Check-in Awal**: Auto check-in saat startup
- ✅ **Notifikasi Discord**: Notifikasi real-time untuk semua aktivitas check-in
- ✅ **Operasi Background**: Berjalan terus menerus di background
- ✅ **Multi-Account Support**: Support beberapa akun HoyoLab dengan cookie berbeda
- ✅ **Rate Limiting**: Delay otomatis antar akun untuk menghindari spam
- ✅ **Cookie Individual**: Setiap akun dapat menggunakan cookie yang berbeda

## Konfigurasi

### Variabel Environment (.env)

```bash
# Jadwal Check-in (format cron: menit jam hari bulan hari_minggu)
CHECKIN_SCHEDULE=5 0 * * *

# Pengaturan retry
MAX_RETRIES=3
RETRY_DELAY=5000

# Timeout HTTP (milidetik)
HTTP_TIMEOUT=30000

# User Agent untuk request
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36

# Discord Webhook untuk notifikasi
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Delay antar akun (milidetik) - untuk menghindari rate limiting
ACCOUNT_DELAY=5000
HOYOLAB_COOKIE=ltoken_v2=your_ltoken_v2; ltuid_v2=your_ltuid_v2; ltmid_v2=your_ltmid_v2;
```

### Contoh Jadwal Cron

- `5 0 * * *` - Setiap hari jam 00:05 (5 menit setelah tengah malam)
- `0 9 * * *` - Setiap hari jam 9:00 pagi
- `30 8 * * *` - Setiap hari jam 8:30 pagi
- `0 */6 * * *` - Setiap 6 jam

### Konfigurasi Akun

File `config/accounts.json` mendukung **multi-account** dengan cookie yang berbeda untuk setiap akun. Setiap akun dapat memiliki cookie HoyoLab yang berbeda:

**Konfigurasi Multi-Account (config/accounts.json):**
```json
{
  "accounts": [
    {
      "name": "Akun Utama",
      "cookie": "ltoken_v2=your_first_ltoken_v2; ltuid_v2=your_first_ltuid_v2; ltmid_v2=your_first_ltmid_v2;",
      "games": {
        "genshin": {
          "enabled": true,
          "uid": "123456789",
          "username": "TravelerMain"
        },
        "starrail": {
          "enabled": true,
          "uid": "987654321",
          "username": "TrailblazerMain"
        },
        "zenless": {
          "enabled": false,
          "uid": "",
          "username": ""
        },
        "honkai": {
          "enabled": false,
          "uid": "",
          "username": ""
        },
        "tots": {
          "enabled": false,
          "uid": "",
          "username": ""
        }
      }
    },
    {
      "name": "Akun Kedua",
      "cookie": "ltoken_v2=your_second_ltoken_v2; ltuid_v2=your_second_ltuid_v2; ltmid_v2=your_second_ltmid_v2;",
      "games": {
        "genshin": {
          "enabled": false,
          "uid": "",
          "username": ""
        },
        "starrail": {
          "enabled": true,
          "uid": "111222333",
          "username": "SecondAccount"
        },
        "zenless": {
          "enabled": true,
          "uid": "444555666",
          "username": "ZenlessAlt"
        },
        "honkai": {
          "enabled": false,
          "uid": "",
          "username": ""
        },
        "tots": {
          "enabled": false,
          "uid": "",
          "username": ""
        }
      }
    }
  ]
}

```

## Cara Mendapatkan Cookie

1. **Pergi ke HoyoLab**: Kunjungi [https://www.hoyolab.com/](https://www.hoyolab.com/)
2. **Login**: Masuk dengan akun Hoyolabmu
3. **Buka Developer Tools**: Tekan F12 atau klik kanan → Inspect
4. **Pergi ke Tab Network**: Klik pada tab Network
6. **Cari Request**: Cari request yang mengandung `getGameRecordCard` di kolom Name/URL
   - Request ini akan muncul otomatis saat halaman profile memuat data game
7. **Salin Cookie**: Klik pada request `getGameRecordCard` → Headers → Request Headers → Salin seluruh bagian `Response Header -> Cookie`

### Nilai Cookie yang Diperlukan

Cookie harus ada bagian bagian ini:
- `ltoken_v2` - Login token
- `ltuid_v2` - User ID
- `ltmid_v2` - Machine ID

## Region Game

### Genshin Impact
- `os_usa` - Amerika
- `os_euro` - Eropa
- `os_asia` - Asia
- `os_cht` - TW/HK/MO

### Honkai Star Rail
- `prod_official_usa` - Amerika
- `prod_official_eur` - Eropa  
- `prod_official_asia` - Asia
- `prod_official_cht` - TW/HK/MO

### Zenless Zone Zero
- `prod_gf_us` - Amerika
- `prod_gf_eu` - Eropa
- `prod_gf_jp` - Asia
- `prod_gf_sg` - Asia Tenggara

## Keamanan

- **Penyimpanan Cookie**: Cookie disimpan lokal di file konfigurasi maisng-masing
- **Tidak Ada Pengumpulan Data**: tidak mengirim data ke mana pun kecuali ke API resmi HoyoLab
- **Open Source**: Semua kode dapat dilihat dan diaudit

## Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## Disclaimer

Proyek ini tidak berafiliasi dengan HoYoverse. Gunakan dengan risiko Anda sendiri. Developer tidak bertanggung jawab atas masalah akun yang mungkin timbul dari penggunaan tool ini.

## Support

Jika mengalami masalah atau memiliki pertanyaan:
1. Review log untuk detail error
2. Buat issue dengan informasi detail

---