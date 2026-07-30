# Drawing-Utility 🎨

A premium, modern React application that fetches random, high-quality artistic images from Unsplash to spark your creativity. Built with a "Pro Max" UI/UX approach, featuring buttery-smooth animations, a dynamic theme engine, and a full suite of image utilities.

## ✨ Features

* **🌗 Dynamic Theming:** Seamless Dark/Light mode toggle with smooth, physics-based transitions.
* **🎬 Fluid Animations:** Powered by Framer Motion for tactile button presses, spring-physics lightboxes, and smooth state cross-fades.
* **🛠️ Utility Toolbar:** 
  * **Download:** Direct high-res image downloads.
  * **Share:** Native Web Share API on mobile, clipboard fallback on desktop.
  * **Expand:** Immersive, full-screen lightbox view.
* **⚡ Smart Fetching:** Uses `AbortController` to instantly cancel network requests mid-flight.
* **💎 Premium UI Details:** Glassmorphism cards, tactile 3D buttons, subtle film-grain texture, optical depth, and custom scrollbars.
* **📱 Responsive & Accessible:** Fluid typography, mobile-optimized layouts, and keyboard navigation support.

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **Animations:** Framer Motion
* **Styling:** Modern CSS3 (Custom Properties, Backdrop Filters, Mask Composites)
* **API:** [Unsplash API](https://unsplash.com/developers)

## 🚀 Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/aman-a-dev/Drawing-Utility/tree/main
cd Drawing-Utility
npm install
```

### 2. Install Dependencies
Ensure you have install Dependencies
```bash
npm install
```

### 3. Configure API Key
Open `src/utils/unsplashService.js` and replace the placeholder with your Unsplash Access Key:
```javascript
const ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY_HERE';
```
*(Note: You can get a free key by creating an app on the [Unsplash Developer Portal](https://unsplash.com/developers))*

### 4. Run the App
```bash
npm run dev

```

## 📜 License
MIT License. Feel free to use this code for your own projects! 

*** 

Made by [Aman dev](https://aman.is-a-fullstack.dev)