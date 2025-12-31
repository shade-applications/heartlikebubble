# HeartLikeBubble 🫧

A premium, high-performance image browsing application built with **Expo** and **React Native**. Designed with "limbic resonance" in mind, it features a fluid Pinterest-style masonry grid, immersive fullscreen viewer, and buttery smooth animations.

## 🚀 Features

- **Masonry Grid Layout**: Optimized 2-column layout using `@shopify/flash-list` for native performance and a robust Flexbox fallback for Web.
- **Immersive Viewing**: Fullscreen image viewer with pinch-to-zoom, pan gestures, and seamless transitions using `react-native-reanimated` and `react-native-gesture-handler`.
- **Custom UI Components**:
  - **Blurred Tab Bar**: Transparent, glassmorphism-inspired bottom navigation.
  - **Animated Header**: Custom header with blur effects and safe-area handling.
  - **Bubbling Refresh**: A unique, custom-animated "heart bubble" pull-to-refresh control.
- **Premium Aesthetics**: Dark mode priority, smooth gradients, and refined typography.
- **Native Performance**: 60fps scrolling and interaction, optimized with `expo-image` caching.

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 52](https://expo.dev)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Gestures**: [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **Lists**: [FlashList](https://shopify.github.io/flash-list/) (`@shopify/flash-list`)

## 🏃‍♂️ Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the App**:
    ```bash
    npx expo start
    ```

3.  **Run on Device/Simulator**:
    - Press `a` for Android Emulator.
    - Press `i` for iOS Simulator.
    - Scan the QR code with Expo Go on your physical device.

## 📦 Publishing to Google Play Store

To publish this app to the Google Play Store, you need to build an Android App Bundle (AAB).

### 1. Prerequisites
- **EAS CLI**: Install the Expo Application Services CLI globally.
  ```bash
  npm install -g eas-cli
  ```
- **Expo Account**: Log in to your Expo account.
  ```bash
  eas login
  ```
- **Google Play Developer Account**: You must have a developer account ($25 one-time fee).

### 2. Configure Build
Run the configuration command to set up `eas.json` (if not already done).
```bash
eas build:configure
```
*Select `Android` when prompted.*

### 3. Build for Production
Run the build command to generate the AAB file.
```bash
eas build --platform android
```
*EAS will handle the signing credentials automatically (Keystore) for you.*

### 4. Upload to Play Console
1.  Once the build finishes, download the `.aab` file from the link provided in the terminal.
2.  Go to the [Google Play Console](https://play.google.com/console).
3.  Create a **New App**.
4.  Navigate to **Production** (or **Testing** > **Internal testing** for a beta).
5.  Create a **New Release**.
6.  Upload your `.aab` file.
7.  Complete the store listing details (Title, Description, Screenshots, Icon).
8.  **Rollout** your release!

---
*Built with ❤️ by Shade Applications*
