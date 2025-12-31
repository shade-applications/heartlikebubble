# HeartLikeBubble 🫧

<div align="center">
  <img src="assets/images/icon.png" alt="HeartLikeBubble Icon" width="120" />
  <br />
  <br />

  [![Expo SDK](https://img.shields.io/badge/Expo-SDK_52-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-NativeWind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

  <p align="center">
    <b>A premium, aesthetic curation app for positive vibes, studying, and motivation.</b>
    <br />
    <i>Discover • Collect • Share</i>
  </p>
</div>

---

## 📖 Overview

**HeartLikeBubble** is a beautifully designed mobile application focused on delivering high-quality, aesthetic imagery across a variety of mood-enhancing categories. Whether you need motivation for your next study session, a calming background for your phone, or just some positive energy, we've curated it all.

Built with **React Native** (Expo) and styled with **NativeWind**, it features a smooth, gesture-driven interface with performance at its core.

<div align="center">
  <img src="assets/splash.png" width="200" alt="Splash Screen Preview" />
</div>

## ✨ Features

- **🎨 Multi-Category Discovery**: Explore 25+ curated categories including *Life*, *Study*, *Nature*, *Aesthetic*, *Travel*, and more.
- **🚀 Dynamic Feed**: Infinite scrolling masonry grid powered by `FlashList` for butter-smooth performance.
- **🖼️ High-Res Viewer**: Deep zoom, pan, and immersive viewing experience.
- **💅 Modern UI/UX**:
  - **Category Chips**: Instant topic switching.
  - **Glassmorphism**: Beautiful blur effects and transparent headers.
  - **Dark Mode**: Fully supported system-wide theme adaptation.
- **💾 Save & Share**: Download wallpapers directly to your gallery or share them with friends.
- **🏠 Onboarding Flow**: Personalize your experience from the very first launch.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [NativeWind (Tailwind CSS)](https://www.nativewind.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **List Performance**: [FlashList](https://shopify.github.io/flash-list/) https://shopify.github.io/flash-list/
- **Data Scraping**: Python 3, Selenium, BeautifulSoup (Custom Batch Scraper)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your physical device OR Android Emulator/iOS Simulator.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/heartlikebubble.git
   cd heartlikebubble
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   *Note: If you run into peer dependency issues, try `npm install --legacy-peer-deps`.*

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.

## 🕷️ Python Scraper (Optional)

We use a custom Python script to ethically scrape and curate high-resolution images from Pinterest for our categories.

```bash
# Activate virtual environment
source venv/bin/activate

# Run the batch scraper (iterates through all categories)
python3 scripts/batch_scraper.py
```

## 📱 Build for Production

To generate an Android App Bundle (.aab) for the Google Play Store:

```bash
# Login to EAS
npm install -g eas-cli
eas login

# Configure build
eas build:configure

# Run build
eas build --platform android
```

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
