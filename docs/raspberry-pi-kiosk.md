# Raspberry Pi Kiosk Setup for **Infinite Asteroids**

This guide walks you through turning a Raspberry Pi into a plug-and-play arcade that boots directly into the game in full-screen (kiosk) mode. Tested on Raspberry Pi OS (32-bit) — both Desktop and Lite images.

---

## 1  Flash & Basic Config
1. Flash the latest **Raspberry Pi OS** to a micro-SD card.  
2. Boot the Pi, then run:
   ```bash
   sudo raspi-config
   ```
   • System ▶ **Boot / Auto Login** ▶ **Desktop Autologin** (or *Console Autologin* for Lite).  
   • Expand filesystem and set locale/Wi-Fi as desired.

## 2  Install Chromium
```bash
sudo apt update && sudo apt install -y chromium-browser
```

## 3  Clone the Game (local play)
```bash
git clone https://github.com/<YOUR-USER>/infiniteasteroids.git ~/infiniteasteroids
```
*(Skip if you plan to load from an online URL.)*

## 4  Create an Autostart Entry
```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/infinite-asteroids.desktop
```
Paste the following (adjust the `file:///…` or `https://…` URL as needed):
```ini
[Desktop Entry]
Type=Application
Name=Infinite Asteroids
Exec=chromium-browser --noerrdialogs --kiosk --disable-pinch --overscroll-history-navigation=0 \
     file:///home/pi/infiniteasteroids/index.html
```

## 5  Global Analytics (Optional)
The Pi build can capture a PNG of each finished run and POST it to a central server.  
This is **disabled by default** – you enable it by providing an endpoint URL.

1. Create/choose an upload API that accepts `multipart/form-data` with fields `image`, `score`, `wave`, `version`.
2. In the BalenaCloud dashboard add a device or service-level environment variable:
   
   | Name | Example Value |
   |------|---------------|
   | `SNAPSHOT_ENDPOINT` | `https://analytics.example.com/upload` |

3. The game reads this variable at runtime and sends the snapshot right after *Game Over*.  
   If the Pi is offline the request is queued in **IndexedDB** and retried once the network returns.

---

## 6  Optional Tweaks
| Purpose | Command / File |
|---------|----------------|
| Hide mouse cursor | `sudo apt install -y unclutter` then `unclutter -idle 0.1 -root &` (add to `~/.bashrc` or a service). |
| Fixed audio level on boot | Add `amixer set PCM 80%` to `/etc/rc.local`. |
| Lock console switching (arcade safety) | Edit `/etc/kbd/config` → `CONSOLE_ALTS=""`. |
| Change HDMI resolution | `sudo raspi-config` → *Display Options* → *Resolution*. |

## 6  Reboot & Play
```bash
sudo reboot
```
The Pi will auto-login, open Chromium full-screen, and load **Infinite Asteroids**.  
Connect a USB/Bluetooth controller — our `gamepad.js` already maps **A → thrust** and **B → secondary weapon**.

Enjoy! 🎮🚀
