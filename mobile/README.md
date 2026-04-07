# ARIA Retail Mobile App

React Native + Expo mobile application for ARIA Retail system. Compatible with Expo Go for immediate testing on physical devices and emulators.

## 📦 Features

### Admin Dashboard
- **Dashboard**: Key metrics (products, low stock, revenue, customers)
- **Inventory**: Browse and search products with low-stock indicators
- **Sales**: Track today's sales, weekly revenue, and transaction history
- **Customers**: View all customers and their purchase history
- **Insights**: AI-powered business intelligence and recommendations
- **Chat**: ARIA AI assistant for product and inventory questions

### User Shopping
- **Home**: Welcome screen with shopping guide
- **Shop**: Browse products by category with search
- **Cart**: Manage items, adjust quantities, and checkout
- **Chat**: Talk to ARIA about products and recommendations
- **Profile**: Account settings and app information

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo Go app installed on your phone (download from App Store or Google Play)

### Installation

1. **Navigate to mobile app directory:**
```bash
cd aria-retail/mobile
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start Expo development server:**
```bash
expo start
```
Or:
```bash
npm start
```

4. **View in Expo Go:**
   - On Android: Open Expo Go app and scan the QR code
   - On iOS: Open Camera app and scan the QR code, then tap the Expo notification

## 🔗 Backend Connection

### For Emulator (Default)
The app is configured to connect to `http://localhost:5000/api` which works automatically in Android emulator.

### For Physical Device
Edit `src/services/api.js` and change the base URL:

```javascript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:5000/api'
// Example: http://192.168.1.100:5000/api
```

Find your computer's IP:
- **Windows**: `ipconfig` → look for IPv4 Address
- **Mac/Linux**: `ifconfig` or `hostname -I`

Ensure your device is on the same WiFi network as your computer.

## 📁 Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── auth/              # Landing, Login, Signup
│   │   ├── admin/             # Dashboard, Inventory, Sales, Customers, Insights
│   │   ├── user/              # Home, Shop, Cart
│   │   └── common/            # Chat, Profile
│   ├── components/
│   │   └── UI.js              # Reusable UI components
│   ├── services/
│   │   ├── api.js             # Backend API client
│   │   └── authService.js     # Authentication methods
│   ├── hooks/
│   │   └── useAuth.js         # Custom auth hook
│   ├── context/
│   │   └── AuthContext.js     # Global auth state
│   ├── App.jsx                # Navigation and app entry
│   └── main.jsx               # React entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🎨 Color Scheme

Matches web app design:
- Primary: Amber `#C97B2E`
- Dark: Ink `#1C1814`
- Light: Cream `#F5F2ED`
- Accent: Forest `#2A4A35`
- Alert: Rust `#B94E2D`

## 🔐 Authentication

- Auto-login from AsyncStorage on app start
- JWT token-based authentication
- Role-based navigation (admin vs user)
- Secure token storage in AsyncStorage

## 📡 API Integration

The app connects to the main backend API at `/api` endpoints:
- `/auth/*` - Login, signup
- `/inventory/*` - Products and stock
- `/sales/*` - Sales data
- `/customers/*` - Customer management
- `/chat/*` - ARIA chatbot
- `/insights/*` - Business intelligence

## 🛠️ Development

### Available Scripts

```bash
npm start      # Start Expo development server
npm run web    # Preview in web browser
npm run eject  # Eject from Expo (caution: permanent)
```

### Hot Reload
Changes to code are automatically reflected in the app. Press:
- `r` in terminal to reload
- `i` for iOS simulator (Mac only)
- `a` for Android emulator

## 🚨 Troubleshooting

### App won't connect to backend
- Check that Express server is running on port 5000
- For physical device: update IP in `src/services/api.js`
- Verify device and computer are on same WiFi

### Dependencies not found
```bash
npm install
# or if issues persist:
rm -rf node_modules package-lock.json
npm install
```

### Expo Go not responding
```bash
expo start --clear
```

## 📦 Build for Production

### Using Expo (EAS Build)
```bash
npm install -g eas-cli
eas build --platform android  # or ios
```

### Manual APK Build
```bash
npm run eject
# Follow Android build instructions
```

## 📝 Notes

- App requires backend server running
- Admin features require admin role
- User shopping creates sales records in backend
- Chat uses Groq AI via backend
- All data synced with MongoDB backend

## 🤝 Support

For issues or questions:
1. Check backend logs: `cd ../backend && npm start`
2. Verify network connection between app and backend
3. Check device console: Expo Go → Logs

## 📄 License

Same as main ARIA Retail project
