# RynGet Pay

A Nigerian fintech wallet mobile app built with React Native + Expo Router.

## Running the app

```bash
pnpm install
pnpm run dev        # Expo dev server (Replit)
pnpm start          # Standard Expo start
```

## Project structure

```
/
├── app/                   # Expo Router file-based screens
│   ├── (tabs)/            # Bottom-tab bar (Home, Reward, Finance, Cards, Me)
│   ├── (auth)/            # Login, Signup, Biometric login, Auto-logout settings
│   ├── (onboarding)/      # 4-slide onboarding carousel + account type picker
│   ├── airtime/           # Airtime / data top-up
│   ├── transfer/          # Money transfer
│   └── transactions/      # Transaction history
├── components/            # Shared UI (PrimaryButton, PhoneInput, RyngetLogo, …)
├── constants/colors.ts    # Brand tokens (primary: #1076C9)
├── context/AuthContext.tsx # Auth state via AsyncStorage
├── hooks/useColors.ts     # Colour hook
├── assets/images/         # PNG brand assets
├── scripts/build.js       # Expo web static build script
├── server/serve.js        # Static web server for deployment
├── app.json               # Expo config
├── babel.config.js
├── metro.config.js
└── tsconfig.json
```

## User preferences

- Nigerian Naira (₦) as currency
- Brand primary: #1076C9 (blue)
- Inter font family throughout
