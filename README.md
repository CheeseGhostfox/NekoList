# NekoList 🐾

> A full local web3 crypto address yellow pages app.

NekoList is a fast, secure, and fully offline-capable decentralized address book designed for the Web3 era. Keep track of all your essential cryptocurrency addresses, exchange UIDs, and social media contacts in one elegant, Telegram-style interface. 

With NekoList, your data never leaves your device unless you choose to share it.

## ✨ Features

- **Multi-Chain Support**: Store addresses across multiple networks including ETH, BNB, Arbitrum, Solana, TRON, and more with built-in format validation.
- **PushCard Technology**: Export your entire profile (including Bio, Addresses, Socials, and Exchange UIDs) into a single, beautifully designed, LZString-compressed QR Code image.
- **Scan & Go**: Seamlessly import new contacts by simply scanning or uploading a PushCard image directly from your gallery.
- **Dark/Light Mode**: Fully responsive UI that automatically adapts to your system preferences.
- **100% Local**: Powered by `localforage`, ensuring your address book remains entirely on your device with zero cloud dependency.
- **Cross-Platform**: Built with React, Vite, and Capacitor for native-like performance on both Web and Mobile.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Build for Production
```bash
# Build web version
npm run build

# Preview production build
npm run preview
```

### Native Mobile (Capacitor)
```bash
# Sync assets and web code to native Android/iOS
npx cap sync
```

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **Storage**: localforage
- **QR Code & Compression**: qrcode + lz-string
- **Icons**: Lucide React
- **Mobile Container**: Capacitor

## 📩 Contact Developer

- **X (Twitter)**: [@Cheese_Ghostfox](https://x.com/Cheese_Ghostfox)
- **Email**: cheese_ghostfox2025@outlook.com
