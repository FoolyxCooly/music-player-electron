# Spotify Music Player (Electron)

A standalone desktop music player built with Electron that plays Spotify audio directly in its own window. It doesn't need the Spotify app running in the background.

## Features

- Log in with your Spotify account (OAuth 2.0 with PKCE, implemented manually)
- Play, pause, next, and previous controls
- Album art and live track info
- Real-time progress bar driven by playback state events
- Packaged as a standalone Windows executable

## Tech Stack

- **Electron** (castlabs build with Widevine support)
- **JavaScript**, HTML
- **Spotify Web Playback SDK** and **Spotify Web API**
- **OAuth 2.0 PKCE** authorization flow
- **electron-builder** for packaging

## Requirements

- Node.js and npm
- A **Spotify Premium** account (required by the Web Playback SDK)
- A Spotify app registered at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/FoolyxCooly/music-player-electron.git
   cd music-player-electron
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Spotify app in the developer dashboard and add this redirect URI: `http://127.0.0.1:8888/callback`
4. Replace the `CLIENT_ID` value in `main.js` with your own Spotify client ID.
5. Start the app:
   ```bash
   npm start
   ```

## How It Works

The app generates a PKCE code verifier and challenge, opens the Spotify login in a secondary window, and captures the authorization code from the redirect. It exchanges the code for an access token, then registers itself as a Spotify Connect playback device using the Web Playback SDK. Playback state events update the album art, track info, and progress bar.

## Challenges

- **DRM:** Standard Electron doesn't include the Widevine DRM that Spotify audio playback needs. I switched to the castlabs Electron build and completed production signing with castlabs EVS so the packaged app can play audio.
- **Packaging:** I configured electron-builder to download the castlabs build instead of the default Electron binaries, then built a standalone Windows executable.

## What I Learned

How OAuth 2.0 PKCE works at a low level, how Electron's main, preload, and renderer processes communicate, and how to work through platform limits like DRM licensing.

## Notes

This is a personal learning project and is not affiliated with Spotify.
