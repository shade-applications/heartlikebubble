# 🚀 Publishing HeartLikeBubble to Google Play Store

This guide details the steps to build your Expo app and upload it to the Google Play Store.

## 1. Prerequisites

- **Google Play Developer Account** ($25 one-time fee).
- **Expo Account** (free).
- **EAS CLI** installed: `npm install -g eas-cli`

## 2. Configure App Information

Ensure your `app.json` has the correct `android.package` string (e.g., `com.yourname.heartlikebubble`).

```json
{
  "expo": {
    "name": "HeartLikeBubble",
    "slug": "heartlikebubble",
    "version": "1.0.0",
    "android": {
        "package": "com.shadeapps.heartlikebubble",
        "versionCode": 1,
        "adaptiveIcon": {
            "foregroundImage": "./assets/adaptive-icon.png",
            "backgroundColor": "#ffffff"
        }
    }
  }
}
```

## 3. Build for Production (AAB)

We use **EAS Build** to generate the Android App Bundle (.aab) required by Google Play.

1.  **Login to Expo:**
    ```bash
    eas login
    ```

2.  **Configure Project (First run only):**
    ```bash
    eas build:configure
    ```
    (Select `Android`)

3.  **Run the Build:**
    ```bash
    eas build --platform android
    ```
    - Note: This might take 10-20 minutes in the cloud.
    - Once finished, download the `.aab` file.

## 4. Google Play Console Setup

1.  **Create App:**
    - Go to [Play Console](https://play.google.com/console).
    - Click **Create App**.
    - App Name: `HeartLikeBubble - Daily Quotes` (or similar).
    - Select **App**, **Free**.

2.  **Dashboard Setup:**
    Complete the dashboard tasks:
    - **Privacy Policy**: Host a simple page stating you don't collect personal data (use free generators or GitHub Pages).
    - **App Access**: "All functionality is available without special access".
    - **Ads**: "My app contains ads" (if you add them later) or "No".
    - **Content Rating**: Fill out the questionnaire (usually rated 3+ or 12+ depending on quotes).
    - **Target Audience**: 13+ (Avoid "Kids" unless you comply with strict rules).

## 5. Store Listing

- **Short Description**: "Daily motivation and beautiful quote wallpapers."
- **Full Description**: describe the features:
    - 25+ Categories (Love, detailed, etc.)
    - Infinite Scroll
    - Favorites System
    - Daily Updates
- **Graphics**:
    - **App Icon**: 512x512 PNG.
    - **Feature Graphic**: 1024x500 PNG (Important for store presence).
    - **Screenshots**: Upload at least 2 screenshots (1080x1920 recommended).

## 6. Uploading the Build

1.  Go to **Testing > Internal testing** (recommended for first test).
2.  Click **Create new release**.
3.  Upload the `.aab` file you downloaded from EAS.
4.  Name the release (e.g., "1.0.0 Initial Release").
5.  Click **Next** and solve any errors.
6.  **Rollout**: Save and hit "Start rollout to Internal Testing".

## 7. Moving to Production

Once you've tested internally:
1.  Go to **Production** on the left menu.
2.  Create a new release.
3.  "Promote" your release from Internal Testing or upload the AAB again.
4.  Submit for review!

> **Note**: First-time reviews can take ~3-7 days.

## 💡 Troubleshooting

- **Signatures**: EAS handles keystores automatically. Don't lose your Expo credentials!
- **Version Codes**: For every new update, increment `versionCode` in `app.json` (e.g., 2, 3, 4...).
