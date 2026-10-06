<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Teacher Rigo's Whack-a-Mole

This contains everything you need to run the grammar whack-a-mole game locally or package it for Android and iOS.

View your app in AI Studio: https://ai.studio/apps/8b45b0d5-1da0-40de-b7ec-013a892f3245

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the web app:
   `npm run dev`

## Android Install

**Prerequisites:** Node.js, Android Studio, an Android SDK, Java available through `JAVA_HOME`, and either an emulator or a USB-connected Android device with USB debugging enabled.

On Windows with Android Studio's bundled Java, PowerShell can use:

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
```

1. Install dependencies:
   `npm install`
2. Generate the Android project the first time:
   `npm run android:add`
3. Install a debug build on a connected device or emulator:
   `npm run android:install`

For later web changes, run `npm run android:sync` before building again. The debug APK is generated at `android/app/build/outputs/apk/debug/app-debug.apk` after `npm run android:build`.

## iOS Install

**Prerequisites:** macOS, Node.js, Xcode, Xcode Command Line Tools, CocoaPods if your local Capacitor setup requires it, and either an iOS Simulator or a physical iPhone configured for development.

1. Install dependencies:
   `npm install`
2. Generate the iOS project the first time:
   `npm run ios:add`
3. Open the project in Xcode:
   `npm run ios:open`
4. In Xcode, select a signing team, choose a simulator or connected iPhone, and run the app.

For later web changes, run `npm run ios:sync` before opening or archiving again. iOS native builds must be produced on macOS with Xcode; Windows can prepare the shared web/Capacitor config but cannot compile or install the iOS app.

## Google Sheets Apps Script Web App

The Apps Script version is generated in [gas](gas). It serves the full game as an Apps Script web app and saves completed round scores plus each submitted answer into a Google Sheet.

1. Build the Apps Script files:
   `npm run gas:build`
2. Open your Google Sheet and copy the spreadsheet ID from its URL.
3. In Apps Script, create two files:
   - `Code.gs`: paste the contents of `gas/Code.gs`
   - `Index.html`: paste the contents of `gas/Index.html`
4. In `Code.gs`, replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your spreadsheet ID.
5. Deploy as a web app:
   - Execute as: `Me`
   - Who has access: choose the audience you want to share with

The script creates `Scores` and `Answers` sheets automatically. `Scores` stores one row per completed round; `Answers` stores one row per question attempt, including the sentence, selected answer, correct answer, correctness, topic, difficulty, and explanation.
