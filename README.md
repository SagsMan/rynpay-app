# RynGet Pay

A Nigerian fintech wallet app built with React Native + Expo (Expo Router).

## Features

- Onboarding carousel (4 slides)
- Phone/email login with animated processing overlay
- Biometric (fingerprint) login screen with pulsing animation
- Home dashboard — balance card, quick actions, services grid, promo banners
- Finance tab — bar chart, summary cards, quick transfers, savings goal
- Cards tab — card carousel with card controls and transaction history
- Rewards tab — Bronze / Silver / Gold tier badges
- Profile (Me) tab — menu sections and logout
- Transfer, Airtime/Data, and Transactions screens
- Auto-logout settings

## Getting Started

```bash
pnpm install
pnpm start         # opens Expo dev menu
pnpm run android   # open on Android emulator/device
pnpm run ios       # open on iOS simulator/device
pnpm run web       # open in browser
```

## Tech Stack

- **Expo** ~54 with Expo Router ~6 (file-based navigation)
- **React Native** 0.81.5
- **TypeScript** 5.9
- **AsyncStorage** for local auth state
- **React Query** for data management
- **expo-linear-gradient**, **expo-blur**, **react-native-svg**
- **Inter** font (via @expo-google-fonts/inter)

## Project Structure

```
/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Bottom-tab screens
│   ├── (auth)/             # Authentication screens
│   ├── (onboarding)/       # Onboarding screens
│   ├── airtime/            # Airtime/data top-up
│   ├── transfer/           # Money transfer
│   └── transactions/       # Transaction history
├── components/             # Shared UI components
├── constants/              # Brand colours and tokens
├── context/                # AuthContext (AsyncStorage)
├── hooks/                  # useColors and other hooks
├── assets/images/          # PNG assets
├── app.json                # Expo config
├── babel.config.js
├── metro.config.js
└── tsconfig.json
```

## Brand

- Primary blue: `#1076C9`
- Logo: gradient R mark (pink → blue)
- Currency: Nigerian Naira (₦)
- CBN-licensed / NDIC-insured messaging
